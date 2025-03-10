#!/usr/bin/env node

import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Steps: each step asks the user to write a function in a different format
const steps = [
  {
    message: `
📢 PASO 1: Declaración de Función
En JavaScript, una **declaración de función** usa la palabra clave **function**.
Escribe una función llamada **sumar** que reciba dos números y devuelva su suma.

Ejemplo esperado:
\`\`\`js
function sumar(a, b) { return a + b }
\`\`\`
✍️ Escribe la función en una sola línea:`,
    expected: `function sumar(a, b) { return a + b }`
  },
  {
    message: `
📢 PASO 2: Expresión de Función
Las **expresiones de función** almacenan la función dentro de una variable.

Ejemplo esperado:
\`\`\`js
const sumar = function(a, b) { return a + b }
\`\`\`
✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = function(a, b) { return a + b }`
  },
  {
    message: `
📢 PASO 3: Arrow Function Básica
Las **arrow functions** pueden ser más cortas.

Ejemplo esperado:
\`\`\`js
const sumar = (a, b) => { return a + b }
\`\`\`
✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = (a, b) => { return a + b }`
  },
  {
    message: `
📢 PASO 4: Arrow Function Implícita
Si la función tiene **una sola expresión**, podemos omitir las llaves **{}** y **return**.

Ejemplo esperado:
\`\`\`js
const sumar = (a, b) => a + b
\`\`\`
✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = (a, b) => a + b`
  }
]

let currentIndex = 0

// Function to normalize input (remove spaces & tabs)
const normalize = (input) => input.replace(/\s+/g, "")

// Function to ask user for input
const askQuestion = () => {
  if (currentIndex >= steps.length) {
    console.log("\n🎉 ¡Felicidades! Has practicado todas las formas de escribir funciones. 🎉\n")
    rl.close()
    return
  }

  console.log(steps[currentIndex].message)
  rl.question("> ", (userInput) => {
    if (normalize(userInput) === normalize(steps[currentIndex].expected)) {
      console.log("✅ Correcto!\n")
      currentIndex++
      askQuestion() // Move to next step
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.\n")
      askQuestion() // Repeat the same question
    }
  })
}

// Start CLI
console.log("📢 Aprende diferentes formas de escribir funciones en JavaScript.\n")
askQuestion()
