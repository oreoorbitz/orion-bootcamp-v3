#!/usr/bin/env node

import readline from "readline"

// Configuración de la CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const challenges = [
  { prompt: "Escribe una multiplicación que resulte en 10:", expected: 10 },
  { prompt: "Escribe una suma que resulte en 20:", expected: 20 },
  { prompt: "Escribe una resta que resulte en 5:", expected: 5 },
  { prompt: "Escribe una división que resulte en 4:", expected: 4 }
]

let currentIndex = 0

// Función para evaluar la expresión
const evaluateExpression = (input, expected) => {
  try {
    // Evaluamos el input del usuario
    const result = eval(input)

    // Comparamos el resultado
    return result === expected
  } catch (error) {
    return false // Si hay un error, la respuesta no es válida
  }
}

// Función para preguntar al usuario
const askQuestion = () => {
  if (currentIndex >= challenges.length) {
    console.log("\n🎉 ¡Has completado todos los desafíos! 🎉\n")
    rl.close()
    return
  }

  const { prompt, expected } = challenges[currentIndex]
  rl.question(`\n${prompt} `, (userInput) => {
    if (evaluateExpression(userInput, expected)) {
      console.log("✅ Correcto!")
      currentIndex++
      askQuestion() // Pasamos al siguiente desafío
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.")
      askQuestion() // Repite la misma pregunta
    }
  })
}

// Iniciar la CLI
console.log("📢 ¡Escribe expresiones JavaScript correctas para completar el reto!\n")
askQuestion()
