// @ts-check

/**
 * EJERCICIO DE FUNCIONES CON CONCEPTOS DE QUÍMICA Y ESTRUCTURAS CONDICIONALES
 *
 * Instrucciones:
 *
 * 1. Escribe una función que reciba un número que representa la concentración
 *    de iones de hidrógeno (en moles/litro) y retorne el pH calculado.
 *
 *    Detalles:
 *    - Usa la fórmula: pH = -log10(concentracion)
 *    - Para calcular el logaritmo en base 10, utiliza Math.log10. Si necesitas más información, consulta la documentación en la web.
 *    - Copia el siguiente fragmento para validar la concentración (no olvides este paso). Ponlo al inicio de la función:
 *
 *         if (concentracion <= 0) {
 *             throw new Error("La concentración debe ser mayor a 0");
 *         }
 *
 *      Este fragmento es un ejemplo de "early return" o "salida temprana", lo que significa que se interrumpe la ejecución
 *      de la función si la concentración no es válida.
 *
 *    Sugerencia: Nombra esta función usando un verbo que describa su acción, por ejemplo "calcularPH".
 *
 * 2. Escribe una función declaración que tome 1 argumento, el cual representa el pH.
 *    Utiliza estructuras condicionales para devolver:
 *    - "ácida" si el pH es menor a 7,
 *    - "neutral" si el pH es igual a 7,
 *    - "básica" si el pH es mayor a 7.
 *
 *    Pista: Puedes usar el siguiente fragmento como guía para las condicionales:
 *
 *         if (ph < 7) {
 *             return "ácida";
 *         }
 *
 *         if (ph === 7) {
 *             return "neutral";
 *         }
 *
 *         return "básica";
 *
 *      Nota: Una función puede tener múltiples sentencias "return", pero solo se ejecutará la primera que cumpla la condición.
 *      En este ejemplo, si el pH es menor a 7 se ejecuta el primer return y la función termina; si no, se evalúa la siguiente condición, y así sucesivamente.
 *
 *    Sugerencia: Nombra esta función usando un verbo, por ejemplo "clasificarPH".
 *
 * 3. Escribe una función declaración que reciba la concentración de iones de hidrógeno,
 *    y realice lo siguiente:
 *    - Calcule el pH usando la función del paso 1.
 *    - Clasifique el pH utilizando la función del paso 2.
 *    - Retorne un mensaje con el formato:
 *      "La solución tiene un pH de X, por lo tanto es Y."
 *      (donde X es el pH redondeado a dos decimales, y Y es la clasificación obtenida).
 *
 *    Sugerencia: Nombra esta función usando un verbo, por ejemplo "analizarSolucion".
 *
 * Recuerda que el objetivo de este ejercicio es practicar:
 *  - La creación de funciones que retornen valores.
 *  - El uso de variables para almacenar dichos valores.
 *  - La integración de funciones, pasando el resultado de una función a otra.
 *
 * ¡Éxito con tu implementación!
 */

// TODO: Escribe la función para calcular el pH.
// Sugerencia de nombre: calcularPH
// Pista: Recuerda usar Math.log10 y copiar el siguiente fragmento para validar la concentración:
// if (concentracion <= 0) {
//     throw new Error("La concentración debe ser mayor a 0");
// }

// TODO: Escribe la función para clasificar el pH.
// Sugerencia de nombre: clasificarPH
// Pista: Copia el siguiente condicional de ejemplo en el cuerpo de la función:
// if (ph < 7) {
//     return "ácida";
// }
//
// if (ph === 7) {
//     return "neutral";
// }
//
// return "básica";
// Recuerda: Aunque hay varios return, solo se ejecutará el primero que cumpla su condición.

// TODO: Escribe la función para analizar la solución.
// Sugerencia de nombre: analizarSolucion
// Esta función debe:
// 1. Calcular el pH utilizando tu función para calcular el pH.
// 2. Clasificar el pH utilizando tu función para clasificar el pH.
// 3. Retornar un mensaje que contenga el pH redondeado a dos decimales y la clasificación.

// Escribe código aquí abajo

/**
 * Calcular el pH de nuestra concentración
 * @param {number} concentracion -
 * @returns {number}
 */
const calcularph = (concentracion) => {
  if (concentracion <= 0) {
     throw new Error("La concentración debe ser mayor a 0");
  }

  /** @type {number} */
  const logInverso = -Math.log10(concentracion);

  /** @type {string} */
  const logInversoFix = logInverso.toFixed(2);

  /** @type {number} */
  const logInversoFloat = parseFloat(logInversoFix);

    return logInversoFloat
}


const clasificarpH = (pH) => {
if (pH < 7) {
  return "ácida";
} else if (pH === 7) {
  return "neutral";
} else if (pH > 7) {
  return "básica";
}
}

const analizarSolucion = (concentracion) => {
  const pH = calcularph(concentracion);
  return `La solucion tiene un pH de ${pH} y por lo tanto es ${clasificarpH(pH)}`;
}

console.log(analizarSolucion(0));
