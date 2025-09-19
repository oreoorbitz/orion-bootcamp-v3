#!/usr/bin/env node

import readline from "readline";
import cardinal from "cardinal";
import customTheme from "../../../cardinal_theme.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function examples to display, with code examples stored separately.
const prompts = [
  {
    message: `
📢 PASO 1: Concatenación de Strings con +
En JavaScript, podemos unir strings usando el operador **+**.

Ejemplo:`,
    codeExample: `function nombreElemento(simbolo, nombre) {
    return "El símbolo químico de " + nombre + " es " + simbolo;
}`,
    expected: `function nombreElemento(simbolo, nombre) { return "El símbolo químico de " + nombre + " es " + simbolo; }`
  },
  {
    message: `
📢 PASO 2: Interpolación con Template Literals (\`\`)
En JavaScript, podemos usar **interpolación** con **template literals (\`\`)**.

Ejemplo:`,
    codeExample: `function masaMolar(elemento, valor) {
    return \`La masa molar de \${elemento} es \${valor} g/mol\`;
}`,
    expected: `function masaMolar(elemento, valor) { return \`La masa molar de \${elemento} es \${valor} g/mol\`; }`
  },
  {
    message: `
📢 PASO 3: Combinación de Concatenación e Interpolación
Podemos combinar **+** y \`\` en una función.

Ejemplo:`,
    codeExample: `function reaccionQuimica(reactivo1, reactivo2, producto) {
    return reactivo1 + " y " + reactivo2 + " reaccionan para formar " + \`\${producto}\`;
}`,
    expected: `function reaccionQuimica(reactivo1, reactivo2, producto) { return reactivo1 + " y " + reactivo2 + " reaccionan para formar " + \`\${producto}\`; }`
  }
];

let currentIndex = 0;

// Remove all whitespace to normalize user input for comparison.
const normalize = (input) => input.replace(/\s+/g, "");

// Ask the user a question, printing the highlighted code using Cardinal.
const askQuestion = () => {
  if (currentIndex >= prompts.length) {
    console.log("\n🎉 ¡Felicidades! Has completado el ejercicio de interpolación. 🎉\n");
    rl.close();
    return;
  }

  const currentPrompt = prompts[currentIndex];
  console.log(currentPrompt.message);
  // Highlight the code snippet using Cardinal with the custom theme.
  console.log(cardinal.highlight(currentPrompt.codeExample, { theme: customTheme }));

  rl.question("> ", (userInput) => {
    if (normalize(userInput) === normalize(currentPrompt.expected)) {
      console.log("✅ Correcto!\n");
      currentIndex++;
      askQuestion(); // Proceed to the next prompt.
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.\n");
      askQuestion(); // Repeat the current prompt.
    }
  });
};

// Start the CLI.
console.log("📢 Aprende a concatenar e interpolar strings en JavaScript con términos de química.\n");
askQuestion();
