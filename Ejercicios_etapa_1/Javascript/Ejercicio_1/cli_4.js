#!/usr/bin/env node

import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Parsons puzzles - Scrambled function syntax (in different styles)
const puzzles = [
  {
    message: `
📢 PASO 1: Declaración de Función (Function Declaration)
Ordena las líneas correctamente para definir la función.

1. { return a + b }
2. function sumar(a, b)

✍️ Escribe la función en una sola línea:`,
    expected: `function sumar(a, b) { return a + b }`
  },
  {
    message: `
📢 PASO 2: Expresión de Función (Function Expression)
Ordena las líneas correctamente para definir la función.

1. = function(a, b) { return a + b }
2. const sumar

✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = function(a, b) { return a + b }`
  },
  {
    message: `
📢 PASO 3: Arrow Function Básica (Basic Arrow Function)
Ordena las líneas correctamente para definir la función.

1. = (a, b) => { return a + b }
2. const sumar

✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = (a, b) => { return a + b }`
  },
  {
    message: `
📢 PASO 4: Arrow Function Implícita (Implicit Arrow Function)
Ordena las líneas correctamente para definir la función.

1. = (a, b) => a + b
2. const sumar

✍️ Escribe la función en una sola línea:`,
    expected: `const sumar = (a, b) => a + b`
  }
]

let currentIndex = 0

// Function to normalize input (remove spaces & tabs)
const normalize = (input) => input.replace(/\s+/g, "")

// Function to ask user for input
const askQuestion = () => {
  if (currentIndex >= puzzles.length) {
    console.log("\n🎉 ¡Felicidades! Has completado todas las funciones en diferentes formatos. 🎉\n")
    rl.close()
    return
  }

  console.log(puzzles[currentIndex].message)
  rl.question("> ", (userInput) => {
    if (normalize(userInput) === normalize(puzzles[currentIndex].expected)) {
      console.log("✅ Correcto!\n")
      currentIndex++
      askQuestion() // Move to next puzzle
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.\n")
      askQuestion() // Repeat the same question
    }
  })
}

// Start CLI
console.log("📢 Ordena correctamente las funciones según lo aprendido en `cli_3.js`.\n")
askQuestion()
