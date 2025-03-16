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
const checarTipo = (variable, tipoEsperado) => {
  return `` // Reemplazar por la implementación correcta
}
const r = checarTipo(21, "number");

console.log(checarTipo(21, "number")); //true
console.log(checarTipo("String", "number")); //false
console.log(checarTipo(21, "string")); //false
console.log(checarTipo("21", "string"));//true