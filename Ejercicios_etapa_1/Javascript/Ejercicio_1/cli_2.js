#!/usr/bin/env node

import readline from "readline"

// Configuración de la CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Código correcto
const correctAnswer = `function edadEnDias(anios) { return 365 * anios }`

// Código desordenado (cada línea en orden incorrecto)
const shuffledLines = [
  "return 365 * anios",
  "function edadEnDias(anios) {",
  "}"
]

// Mostrar código desordenado
console.log("\n📢 Ordena el código correctamente para que sea una función válida.\n")
shuffledLines.forEach((line, index) => {
  console.log(`${index + 1}. ${line}`)
})

console.log("\n✍️ Escribe el código correctamente (en una sola línea):\n")

// Preguntar al usuario
rl.question("> ", (userInput) => {
  // Eliminar espacios en blanco y comparar
  const formattedInput = userInput.replace(/\s+/g, "")
  const formattedCorrect = correctAnswer.replace(/\s+/g, "")

  if (formattedInput === formattedCorrect) {
    console.log("\n✅ ¡Correcto! Has ordenado la función correctamente.\n")
  } else {
    console.log("\n❌ Incorrecto. Intenta de nuevo ejecutando `node cli_2.js`.\n")
  }

  rl.close()
})
