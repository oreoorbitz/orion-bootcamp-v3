// @ts-check

/**
 * @typedef {Object} Config
 * @property {array[]} testLines - An array of arrays of strings, each sub array will contain the code that should be jumbled
 * @property {boolean} addSpaces - Whether or not to add spaces between the strings
 * @property {boolean} evaluate - Whether or not to use eval to evaluate the results
 * @property {array[]} correctResultsEvaled - If evaluate is true, this should contain the exact result to be compared against the result of eval on each array of strings.
 * @property {(text: string, role: string) => string} [colorTransformer] - Optional function that transforms text based on a role.
 *           For example, a CLI user might supply a function that wraps text in ANSI escape codes,
 *           while a web user might return HTML or CSS-styled text.
 */

// CONSTANTS
const ENV_SPECIFIC_REGEXES = [
    /^(document|window|alert|prompt)$/,
    /^(process|require|module|fs)$/
];

// UTILITIES

/**
 * Shuffles an array then double checks that the result is not the same as the original, tries again if it is.
 * Cannot have 2 or less elements in the array.
 * @param {array} array - The array to be shuffled
 * @returns {array} - The shuffled array
 */
const shuffle = (array) => {
    if (array.length <= 2) {
        throw new Error('Array must have more than 2 elements');
    }
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (JSON.stringify(shuffled) === JSON.stringify(array)) {
        return shuffle(array);
    }
    return shuffled;
};

// MAIN FUNCTIONALITY

/**
 * The jumbler, takes a config object, which should include the content to be jumbled,
 * and then returns the jumbled content.
 * 
 * If evaluate is true in the config, each test line is first joined into a string and evaluated
 * with eval. If evaluation fails (e.g. due to an undefined variable), an error is thrown.
 *
 * @param {Object} input 
 */
export const parsonsPuzzleJumbler = (input) => {
    const { testLines, evaluate, correctResultsEvaled } = input;

    if (evaluate) {
        // Validate that correctResultsEvaled is provided and has the same length as testLines.
        if (!correctResultsEvaled || correctResultsEvaled.length !== testLines.length) {
            throw new Error("For evaluate mode, correctResultsEvaled must be provided and have the same length as testLines.");
        }
        // Pre-evaluation: check that each test line evaluates to its expected value.
        testLines.forEach((line, index) => {
            const joinedLine = line.join(' ');
            let evaluated;
            try {
                evaluated = eval(joinedLine);
            } catch (e) {
                throw new Error(`Test line at index ${index} failed to eval: "${joinedLine}". Error: ${e.message}`);
            }
            if (evaluated !== correctResultsEvaled[index]) {
                throw new Error(`Test line at index ${index} does not evaluate to the expected value. Expected: ${correctResultsEvaled[index]}, got: ${evaluated}`);
            }
        });
    }

    // Proceed to jumble each test line.
    const arrayOfJumbledLines = testLines.map((line) => shuffle(line));
    return arrayOfJumbledLines;
}

/**
 * The helper Class, takes the jumbled content and the config object.
 * The instance can be used to build UI agnostic prompts for the user to input their answers.
 */
export class ParsonsPrompt {
    /**
     * @param {array[]} jumbledContent - Array of arrays of strings output by parsonsPuzzleJumbler.
     * @param {Object} config - The config object containing flags like addSpaces, evaluate, and optionally a colorTransformer.
     *                         colorTransformer: (text: string, role: string) => string
     */
    constructor(jumbledContent, config) {
        this.jumbledContent = jumbledContent;
        this.config = config;
        // Initialize an array to store user attempts; each index will hold an array of tokens.
        this.userAttempts = new Array(jumbledContent.length).fill(null);
    }

    /**
     * Returns a formatted prompt for the puzzle at the given index.
     * This method uses the configuration flags to determine the formatting.
     * If a colorTransformer is provided, it is applied with the role "prompt".
     * Additionally, if a syntaxHighlighter function is provided, it is applied.
     * @param {number} index - The index of the puzzle to display.
     * @returns {string} - The formatted prompt as a string.
     */
    getPrompt(index) {
        if (index < 0 || index >= this.jumbledContent.length) {
            throw new Error("Invalid index");
        }
        let prompt = this.config.addSpaces
            ? this.jumbledContent[index].join(' ')
            : this.jumbledContent[index].join('');
        // Apply syntax highlighting if a highlighter function is provided.
        if (this.config.syntaxHighlighter && typeof this.config.syntaxHighlighter === 'function') {
            prompt = this.config.syntaxHighlighter(prompt);
        }
        // Apply user-supplied color transformation if available.
        if (this.config.colorTransformer && typeof this.config.colorTransformer === 'function') {
            prompt = this.config.colorTransformer(prompt, 'prompt');
        }
        return prompt;
    }

    /**
     * Returns all formatted prompts as an array of strings.
     * @returns {string[]} - An array of prompts.
     */
    getAllPrompts() {
        return this.jumbledContent.map((_, index) => this.getPrompt(index));
    }

    /**
     * Accepts a user's attempt for a specific puzzle index.
     * The attempt is provided as a string, which is then tokenized.
     * This updated version uses a regex to separate words and punctuation.
     * Additionally, if evaluation mode is enabled, it checks the tokens
     * against a regex table to reject environment-specific tokens.
     * @param {number} index - The index of the puzzle.
     * @param {string} attemptString - The user's attempt as a single string.
     * @returns {array} - The processed attempt as an array of tokens.
     */
    submitAttempt(index, attemptString) {
        if (index < 0 || index >= this.jumbledContent.length) {
            throw new Error("Invalid index");
        }
        const tokens = attemptString.match(/([a-zA-Z0-9_$.]+|[^\s])/g) || [];
        if (this.config.evaluate) {
            for (const token of tokens) {
                for (const regex of ENV_SPECIFIC_REGEXES) {
                    if (regex.test(token)) {
                        throw new Error(`Prompt rejected: environment-specific token "${token}" detected.`);
                    }
                }
            }
        }
        this.userAttempts[index] = tokens;
        return tokens;
    }

    /**
     * Retrieves the stored attempt for the given puzzle index in token format.
     * This is the format expected by ParsonsEvaulator's evaluateResultByIndex.
     * @param {number} index - The index of the puzzle.
     * @returns {array} - The user's attempt as an array of tokens.
     */
    getAttempt(index) {
        if (index < 0 || index >= this.userAttempts.length) {
            throw new Error("Invalid index");
        }
        return this.userAttempts[index];
    }

    /**
     * Provides feedback based on an array of booleans.
     * Each boolean corresponds to whether the attempt at that index passed or failed.
     * If a colorTransformer is provided, "Pass" is transformed with the role "success" and "Fail" with "error".
     * @param {boolean[]} feedbackArray - Array where each element indicates if the corresponding attempt is correct.
     * @returns {string[]} - Array of feedback indicators (e.g., "Pass" or "Fail") for each puzzle.
     */
    getFeedback(feedbackArray) {
        if (!Array.isArray(feedbackArray) || feedbackArray.length !== this.jumbledContent.length) {
            throw new Error("Feedback array must be the same length as the number of puzzles");
        }
        return feedbackArray.map(passed => {
            let text = passed ? "Pass" : "Fail";
            if (this.config.colorTransformer && typeof this.config.colorTransformer === 'function') {
                text = this.config.colorTransformer(text, passed ? 'success' : 'error');
            }
            return text;
        });
    }
}

/**
 * The ParsonsEvaulator class creates an instance that you can feed results into
 * and then check if they are correct.
 */
export class ParsonsEvaulator {
    constructor(config) {
        this.results = [];
        this.config = config;
    }

    /** 
     * Takes the result array, and the correct results from the config "correctResultsEvaled"
     * (if evaluate is true) or the original testLines (if evaluate is false) and compares them,
     * returning an array of booleans.
     * @param {array[]} results - Array of token arrays representing the user's attempts.
     * @returns {boolean[]} - Array of booleans indicating correctness.
     */
    evaluateEachResultIndex(results) {
        const { testLines } = this.config;
        if (this.config.evaluate) {
            return results.map((result, index) => {
                const attemptString = result.join('');
                let evaluatedAttempt;
                try {
                    evaluatedAttempt = eval(attemptString);
                } catch (e) {
                    evaluatedAttempt = undefined;
                }
                return evaluatedAttempt === this.config.correctResultsEvaled[index];
            });
        } else {
            return results.map((result, index) => JSON.stringify(result) === JSON.stringify(testLines[index]));
        }
    }

    /**
     * Evaluates a single puzzle attempt by index.
     * @param {number} index - The index of the puzzle.
     * @param {array} result - The user's attempt as an array of tokens.
     * @returns {boolean} - True if the attempt is correct, false otherwise.
     */
    evaluateResultByIndex(index, result) {
        const { testLines } = this.config;
        if (this.config.evaluate) {
            const attemptString = result.join('');
            let evaluatedAttempt;
            try {
                evaluatedAttempt = eval(attemptString);
            } catch (e) {
                evaluatedAttempt = undefined;
            }
            return evaluatedAttempt === this.config.correctResultsEvaled[index];
        } else {
            return JSON.stringify(result) === JSON.stringify(testLines[index]);
        }
    }
}
