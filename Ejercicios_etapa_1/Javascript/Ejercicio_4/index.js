import { E } from "vitest/dist/chunks/reporters.d.CqBhtcTq.js";

/**
 * EJERCICIO 4: USO DE typeof Y CONDICIONALES
 *
 * Instrucciones:
 *   1. Crea una función llamada "checarTipo" que reciba dos parámetros:
 *      - "variable": puede ser de cualquier tipo (number, string, boolean, etc.)
 *      - "tipoEsperado": un string que describe el tipo esperado (por ejemplo, "number", "string", "boolean", etc.)
 *   2. Dentro de la función:
 *      - Usa "typeof" para obtener el tipo de "variable"
 *      - Verifica si coincide con "tipoEsperado"
 *      - Retorna un string que indique:
 *        - Qué tipo se esperaba
 *        - Si realmente coincide o no
 *   3. Utiliza plantillas literales (interpolación) para construir el string final.
 *
 * Ejemplos:
 *   checarTipo(10, "number") => "La variable es number: true"
 *   checarTipo("Hola", "number") => "La variable es number: false"
 *
 * @param {*} variable - La variable de cualquier tipo que vamos a verificar
 * @param {string} tipoEsperado - El tipo de dato que se espera (por ejemplo, "number")
 * @returns {string} Un mensaje indicando el tipo esperado y si la variable coincide
 */
export const checarTipo = (variable, tipoEsperado) => {
  const tipoVerdadero = typeof variable
  if(typeof variable === tipoEsperado){
    return 'El tipo esperado coincide'
  }
  
  return  `La variable ${tipoEsperado} ${variable}` // Reemplazar por la implementación correcta
}

const r = checarTipo(21, "number");

console.log(checarTipo(21, "number")); //true
console.log(checarTipo("String", "number")); //false
console.log(checarTipo(21, "string")); //false
console.log(checarTipo("21", "string"));//true


/**
 * EJERCICIO 4: EVALUACIÓN DE VALORES FALSY Y TRUTHY
 *
 * Instrucciones:
 *   1. Crea una función llamada "esFalsy" que reciba un parámetro:
 *      - "elemento": puede ser de cualquier tipo (number, string, boolean, array, object, etc.)
 *   2. Dentro de la función:
 *      - Verifica si "elemento" es estrictamente `false`
 *        - En ese caso, retorna: `"El elemento es el booleano false"`
 *      - Verifica si "elemento" es estrictamente `true`
 *        - En ese caso, retorna: `"El elemento es el booleano true"`
 *      - Si "elemento" es un valor falsy en JavaScript (`0`, `""`, `null`, `undefined`, `NaN`):
 *        - Retorna `"El elemento es falsy: true"`
 *      - Si "elemento" no es falsy (es decir, es truthy):
 *        - Retorna `"El elemento es truthy: true"`
 *   3. Usa interpolación de strings para construir el mensaje final.
 *
 * Ejemplos:
 *   esFalsy(false) => "El elemento es el booleano false"
 *   esFalsy(true) => "El elemento es el booleano true"
 *   esFalsy(0) => "El elemento es falsy: true"
 *   esFalsy("") => "El elemento es falsy: true"
 *   esFalsy("Hola") => "El elemento es truthy: true"
 *   esFalsy([]) => "El elemento es truthy: true"
 *
 * @param {*} elemento - Cualquier valor que se desea evaluar
 * @returns {string} Un mensaje indicando si el valor es falsy, booleano false, booleano true, o truthy.
 */
export const falsosoVerdadoso = (elemento) => {
};

// Ejemplos de ejecución en la consola
console.log(falsosoVerdadoso(false));  // "El elemento es el booleano false"
console.log(falsosoVerdadoso(true));   // "El elemento es el booleano true"
console.log(falsosoVerdadoso(0));      // "El elemento es falsy: true"
console.log(falsosoVerdadoso(""));     // "El elemento es falsy: true"
console.log(falsosoVerdadoso(null));   // "El elemento es falsy: true"
console.log(falsosoVerdadoso(undefined)); // "El elemento es falsy: true"
console.log(falsosoVerdadoso(NaN));    // "El elemento es falsy: true"
console.log(falsosoVerdadoso(42));     // "El elemento es truthy: true"
console.log(falsosoVerdadoso("Hola")); // "El elemento es truthy: true"
console.log(falsosoVerdadoso([]));     // "El elemento es truthy: true"
console.log(falsosoVerdadoso({}));     // "El elemento es truthy: true"

/**
 * EJERCICIO 4: DIVISIÓN SEGURA CON DETECCIÓN DE NaN Y EARLY RETURN
 *
 * Instrucciones:
 *   1. Crea una función llamada "divisionSegura" que reciba dos parámetros:
 *      - "dividendo": el número a dividir.
 *      - "divisor": el número por el cual se divide.
 *   2. Dentro de la función:
 *      - Si **cualquiera** de los dos valores **no es un número**, retorna `"Error: Uno de los valores no es un número"`.
 *      - Si **el divisor es 0**, retorna `"Error: No se puede dividir por 0"`.
 *      - Si **cualquier valor es NaN**, retorna `"Error: Uno de los valores es NaN"`.
 *      - De lo contrario, realiza la división y retorna el resultado como `string` interpolado:  
 *        `"El resultado de dividir <dividendo> entre <divisor> es <resultado>"`.
 *   3. Utiliza **early return** para evitar cálculos innecesarios.
 *   4. Usa `typeof` para validar que los valores son números.
 *   5. Usa `isNaN()` para detectar NaN correctamente.
 *
 * Ejemplos:
 *   divisionSegura(10, 2) => "El resultado de dividir 10 entre 2 es 5"
 *   divisionSegura(10, "Hola") => "Error: Uno de los valores no es un número"
 *   divisionSegura(10, 0) => "Error: No se puede dividir por 0"
 *   divisionSegura(0 / 0, 5) => "Error: Uno de los valores es NaN"
 *
 * @param {*} dividendo - Número que será dividido
 * @param {*} divisor - Número por el cual se divide
 * @returns {string} Mensaje indicando el resultado de la operación o un error.
 */
export const divisionSegura = (dividendo, divisor) => {
   // Implementar aqui
};

// 📌 Ejemplos de ejecución en la consola
console.log(divisionSegura(10, 2));      // "El resultado de dividir 10 entre 2 es 5"
console.log(divisionSegura(10, "Hola")); // "Error: Uno de los valores no es un número"
console.log(divisionSegura(10, 0));      // "Error: No se puede dividir por 0"
console.log(divisionSegura(NaN, 5));     // "Error: Uno de los valores es NaN"
console.log(divisionSegura(0 / 0, 5));   // "Error: Uno de los valores es NaN"
console.log(divisionSegura(100, 4));     // "El resultado de dividir 100 entre 4 es 25"
console.log(divisionSegura("20", 5));    // "Error: Uno de los valores no es un número"
console.log(divisionSegura(50, undefined)); // "Error: Uno de los valores no es un número"


/**
 * EJERCICIO 4: MANEJO DE `null` Y `undefined`
 *
 * Instrucciones:
 *   1. Crea una función llamada "valorSeguro" que reciba un parámetro:
 *      - "valor": puede ser cualquier tipo de dato (string, number, object, etc.).
 *   2. Dentro de la función:
 *      - Si el valor es `null`, retorna `"El valor es null (ausencia intencional de datos)"`.
 *      - Si el valor es `undefined`, retorna `"El valor es undefined (valor no asignado)"`.
 *      - Si el valor es falsy pero NO null ni undefined, retorna `"El valor es falsy pero definido: <valor>"`
 *      - Si el valor es truthy, retorna `"El valor es válido: <valor>"`
 *   3. Usa los operadores `??`, `||`, y `&&` para manejar diferentes casos.
 *
 * Ejemplos:
 *   valorSeguro(null) => "El valor es null (ausencia intencional de datos)"
 *   valorSeguro(undefined) => "El valor es undefined (valor no asignado)"
 *   valorSeguro(0) => "El valor es falsy pero definido: 0"
 *   valorSeguro(false) => "El valor es falsy pero definido: false"
 *   valorSeguro("Hola") => "El valor es válido: Hola"
 *
 * @param {*} valor - Cualquier valor a evaluar.
 * @returns {string} Mensaje indicando el estado del valor.
 */
export const valorSeguro = (valor) => {
  // Implementar aqui
}

// 📌 Ejemplos de ejecución en la consola
console.log(valorSeguro(null));        // "El valor es null (ausencia intencional de datos)"
console.log(valorSeguro(undefined));   // "El valor es undefined (valor no asignado)"
console.log(valorSeguro(0));           // "El valor es falsy pero definido: 0"
console.log(valorSeguro(""));          // "El valor es falsy pero definido: "
console.log(valorSeguro(false));       // "El valor es falsy pero definido: false"
console.log(valorSeguro(NaN));         // "El valor es falsy pero definido: NaN"
console.log(valorSeguro("Hola"));      // "El valor es válido: Hola"
console.log(valorSeguro(42));          // "El valor es válido: 42"
console.log(valorSeguro({}));          // "El valor es válido: [object Object]"