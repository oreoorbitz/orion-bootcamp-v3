#!/usr/bin/env node

import readline from "readline";
import cardinal from "cardinal"; 
import customTheme from "../../../cardinal_theme.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para aplicar resaltado de sintaxis usando Cardinal
const highlight = (code) => {
  // El segundo parámetro indica el lenguaje, en este caso 'javascript'
  return cardinal.highlight(code, { language: 'javascript', theme: customTheme });
};

// Lista de pasos del ejercicio con ejemplos resaltados
const steps = [
  {
    explanation: `
PASO 1: Escribe la cabecera de la función para calcular moles.
Debe comenzar con:
${highlight("function calcularMoles(masa, masaMolar) {")}
✍️ Anota en tu cuaderno: la línea de cabecera para 'calcularMoles'.
Presiona ENTER cuando lo hayas anotado.`,
    expected: `function calcularMoles(masa, masaMolar) {`
  },
  {
    explanation: `
PASO 2: Escribe la instrucción que realiza la operación dentro de la función calcularMoles.
Debe ser:
${highlight("return masa / masaMolar;")}
✍️ Anótalo en tu cuaderno y presiona ENTER cuando estés listo.`,
    expected: `return masa / masaMolar;`
  },
  {
    explanation: `
PASO 3: Escribe la llave de cierre para finalizar la función calcularMoles.
Debe ser:
${highlight("}")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `}`
  },
  {
    explanation: `
PASO 4: Escribe la función completa 'calcularMoles' en una sola línea.
Debería quedar así:
${highlight("function calcularMoles(masa, masaMolar) { return masa / masaMolar; }")}
✍️ Anótalo en tu cuaderno y presiona ENTER cuando lo hayas escrito.`,
    expected: `function calcularMoles(masa, masaMolar) { return masa / masaMolar; }`
  },
  {
    explanation: `
PASO 5: Escribe la cabecera de la función para calcular la molaridad.
Debe comenzar con:
${highlight("function calcularMolaridad(moles, volumen) {")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `function calcularMolaridad(moles, volumen) {`
  },
  {
    explanation: `
PASO 6: Escribe la instrucción que calcula la molaridad dentro de la función.
Debe ser:
${highlight("return moles / volumen;")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `return moles / volumen;`
  },
  {
    explanation: `
PASO 7: Escribe la llave de cierre para finalizar la función calcularMolaridad.
Debe ser:
${highlight("}")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `}`
  },
  {
    explanation: `
PASO 8: Escribe la función completa 'calcularMolaridad' en una sola línea.
Debe quedar así:
${highlight("function calcularMolaridad(moles, volumen) { return moles / volumen; }")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `function calcularMolaridad(moles, volumen) { return moles / volumen; }`
  },
  {
    explanation: `
PASO 9: Escribe la línea de código para calcular e imprimir la molaridad de una solución de NaCl.
Utiliza los siguientes valores:
- Masa de NaCl = 10
- Masa molar de NaCl = 58.44
- Volumen = 1
La línea debe usar interpolación para mostrar:
${highlight("console.log(`Moles de NaCl: ${calcularMoles(10, 58.44).toFixed(3)} mol, Molaridad de la solución: ${calcularMolaridad(calcularMoles(10, 58.44), 1).toFixed(3)} M`);")}
✍️ Anótalo en tu cuaderno y presiona ENTER.`,
    expected: `console.log(\`Moles de NaCl: \${calcularMoles(10, 58.44).toFixed(3)} mol, Molaridad de la solución: \${calcularMolaridad(calcularMoles(10, 58.44), 1).toFixed(3)} M\`);`
  }
];

let currentIndex = 0;

// Función para normalizar el input (elimina espacios y tabulaciones)
const normalize = (input) => input.replace(/\s+/g, "");

const askQuestion = () => {
  if (currentIndex >= steps.length) {
    console.log("\n🎉 ¡Felicidades! Has completado el ejercicio de molaridad paso a paso. 🎉\n");
    rl.close();
    return;
  }

  console.log(steps[currentIndex].explanation);
  rl.question("> ", (userInput) => {
    if (normalize(userInput) === normalize(steps[currentIndex].expected)) {
      console.log("✅ Correcto!\n");
      currentIndex++;
      askQuestion();
    } else {
      console.log("❌ Incorrecto. Intenta de nuevo.\n");
      askQuestion();
    }
  });
};

console.log("📢 Vamos a construir las funciones para calcular moles y molaridad de una solución.\n");
askQuestion();
