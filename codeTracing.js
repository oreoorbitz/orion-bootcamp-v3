// @ts-check

export class CodeTracePrompt {
    /**
     * @param {CodeTraceConfig} config
     */
    constructor(config) {
        this.config = config;

        /** @type {string[]|null[]} */
        this.userAnswers = new Array(config.traceLines.length).fill(null);
    }

    /**
     * Returns the code snippet to trace at a given index.
     * @param {number} index
     */
    getPrompt(index) {
        if (index < 0 || index >= this.config.traceLines.length) {
            throw new Error('Invalid trace index');
        }
        const code = this.config.traceLines[index];
        return this.config.colorTransformer
            ? this.config.colorTransformer(code, 'prompt')
            : code;
    }

    /**
     * Submit user's answer to a trace.
     * @param {number} index
     * @param {any} answer - The answer could be a string, number, object, etc.
     */
    submitAnswer(index, answer) {
        if (index < 0 || index >= this.userAnswers.length) {
            throw new Error('Invalid trace index');
        }
        this.userAnswers[index] = answer;
    }

    /**
     * Gets the stored user answer.
     * @param {number} index
     */
    getAnswer(index) {
        return this.userAnswers[index];
    }

    /**
     * Returns all formatted prompts
     */
    getAllPrompts() {
        return this.config.traceLines.map((_, i) => this.getPrompt(i));
    }
}

export class CodeTraceHintStorage {
    /**
     * @param {string[]} hints
     */
    constructor(hints) {
        this.hints = hints;
    }

    /**
     * Returns a hint string for the given index.
     * @param {number} index
     * @returns {string}
     */
    getHint(index) {
        if (index < 0 || index >= this.hints.length) {
            throw new Error('Invalid hint index');
        }
        return this.hints[index];
    }
}

export class CodeTraceEvaluator {
    /**
     * @param {CodeTraceConfig} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Evaluate a single trace automatically using eval or customEvaluator
     * @param {number} index
     */
    evaluateAutomatically(index) {
        const code = this.config.traceLines[index];
        try {
            const result = this.config.customEvaluator
                ? this.config.customEvaluator(code)
                : eval(code);
            return result;
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Compares all user answers with expected results.
     * If allowManualAnswer is false, answers are ignored and auto-evaluation is done.
     * @param {any[]} userAnswers
     * @returns {boolean[]}
     */
    evaluateAll(userAnswers) {
        return this.config.traceLines.map((_, i) => {
            const expected = this.config.correctResults[i];
            let actual = this.config.allowManualAnswer
                ? userAnswers[i]
                : this.evaluateAutomatically(i);
            return JSON.stringify(actual) === JSON.stringify(expected);
        });
    }

    /**
     * Evaluate a single answer by index
     * @param {number} index
     * @param {any} answer
     */
    evaluateOne(index, answer) {
        const expected = this.config.correctResults[index];
        const actual = this.config.allowManualAnswer ? answer : this.evaluateAutomatically(index);
        return JSON.stringify(actual) === JSON.stringify(expected);
    }
}


/**
 * @typedef {Object} CodeTraceConfig
 * @property {string[]} traceLines - Lines of code to trace. Each string is a full JavaScript snippet.
 * @property {any[]} correctResults - Expected result for each trace line. Can be any JS value.
 * @property {boolean} [allowManualAnswer] - If true, the user can manually submit answers instead of auto-eval. Defaults to false.
 * @property {(code: string) => any} [customEvaluator] - Optional custom evaluator to replace `eval`.
 * @property {(text: string, role: 'prompt' | 'success' | 'error') => string} [colorTransformer] - Optional formatter for CLI/UI display.
 */

/**
 * @typedef {Object} CodeTracePrompt
 * @property {(index: number) => string} getPrompt - Returns the code snippet for a given index.
 * @property {(index: number, answer: any) => void} submitAnswer - Submits a user's answer.
 * @property {(index: number) => any} getAnswer - Returns the user's answer at the given index.
 * @property {() => string[]} getAllPrompts - Returns all trace prompts formatted.
 */

/**
 * @typedef {Object} CodeTraceEvaluator
 * @property {(index: number) => any} evaluateAutomatically - Evaluates a trace line using eval or a custom evaluator.
 * @property {(userAnswers: any[]) => boolean[]} evaluateAll - Compares all user answers or auto-evals with expected results.
 * @property {(index: number, answer: any) => boolean} evaluateOne - Compares a single answer (or eval) with the expected result.
 */

/**
 * @typedef {Object} CodeTraceHintStorage
 * @property {string[]} hints - Array of hints for the code trace.
 * @property {(index: number) => string} getHint - Returns a single hint string by index.
 */