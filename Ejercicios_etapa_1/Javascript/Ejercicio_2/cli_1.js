#!/usr/bin/env node

import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function examples to display
const prompts = [
  {
    message: `
📢 PASO 1: Concatenación de Strings con +
En JavaScript, podemos unir strings usando el operador **+**.

Ejemplo:
\`\`\`js
function nombreElemento(simbolo, nombre) {
    return "El símbolo químico de " + nombre + " es " + simbolo;
}
\`\`\`

✍️ **Escribe la función exactamente como aparece arriba** en una sola línea.`,
    expected: `function nombreElemento(simbolo, nombre) { return "El símbolo químico de " + nombre + " es " + simbolo; }`
  },
  {
    message: `
📢 PASO 2: Interpolación con Template Literals (\`\`)
En JavaScript, podemos usar **interpolación** con **template literals (\`\`)**.

Ejemplo:
\`\`\`js
function masaMolar(elemento, valor) {
    return \`La masa molar de \${elemento} es \${valor} g/mol\`;
}
\`\`\`

✍️ **Escribe la función exactamente como aparece arriba** en una sola línea.`,
    expected: `function masaMolar(elemento, valor) { return \`La masa molar de \${elemento} es \${valor} g/mol\`; }`
  },
  {
    message: `
📢 PASO 3: Combinación de Concatenación e Interpolación
Podemos combinar **+** y \`\` en una función.

Ejemplo:
\`\`\`js
function reaccionQuimica(reactivo1, reactivo2, producto) {
    return reactivo1 + " y " + reactivo2 + " reaccionan para formar " + \`\${producto}\`;
}
\`\`\`

✍️ **Escribe la función exactamente como aparece arriba** en una sola línea.`,
    expected: `function reaccionQuimica(reactivo1, reactivo2, producto) { return reactivo1 + " y " + reactivo2 + " reaccionan para formar " + \`\${producto}\`; }`
  }
]

let currentIndex = 0

// Function to normalize input (remove spaces & tabs)
const normalize = (input) => input.replace(/\s+/g, "")

// Function to ask user for input
const askQuestion = () => {
  if (currentIndex >= prompts.length) {
    console.log("\n🎉 ¡Felicidades! Has completado el ejercicio de interpolación. 🎉\n")
    rl.close()
    return
  }

  console.log(prompts[currentIndex].message)
  rl.question("> ", (userInput) => {
    if (normalize(userInput) === normalize(prompts[currentIndex].expected)) {
      console.log("✅ Correcto!\n")
      currentIndex++
      askQuestion() // Move to next prompt
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.\n")
      askQuestion() // Repeat the same question
    }
  })
}

// Start CLI
console.log("📢 Aprende a concatenar e interpolar strings en JavaScript con términos de química.\n")
askQuestion()
