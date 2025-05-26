// @ts-check
import { productoUno, productoUnoVerDos, productoUnoVerTres } from '../data/productos.js'
/**
 * Objeto que mapea códigos de moneda a sus respectivos símbolos.
 * @type {{USD: string, EUR: string, GBP: string}}
 */
const monedas = {
  USD: "$",
  EUR: "€",
  GBP: "£"
}

/**
 * Convierte una cantidad en centavos a un formato monetario.
 *
 * @param {number} centavos - Número entero que representa la cantidad en centavos.
 * @param {string} codigoMoneda - Código de la moneda (por ejemplo, "USD", "EUR", "GBP").
 * @returns {string} El valor formateado en la moneda correspondiente o un mensaje de error si los parámetros no son válidos.
 *
 * Ejemplos:
 *  convertirCentsAMoneda(1234, "USD") => "$12.34"
 *  convertirCentsAMoneda(50, "EUR")  => "€0.50"
 *  convertirCentsAMoneda(-100, "GBP") => "Valor invalido"
 *  convertirCentsAMoneda(200, "ABC") => "Codigo de moneda invalido"
 */
export const convertirCentsAMoneda = (centavos, codigoMoneda) => {
  return '' // Reemplazar por la implementación
}

// Ejemplos de uso:
const convercion = convertirCentsAMoneda(-4000, "GBP")
const convercionDos = convertirCentsAMoneda(1000, "EURR")
const convercionTres = convertirCentsAMoneda(2000, "USD")

/**
 * Compara dos objetos y retorna si son equivalentes usando JSON.stringify
 *
 * @param {any} obj1
 * @param {any} obj2
 * @returns {boolean}
 */
export const compararObjetosPorStringify = (obj1, obj2) => {
  return false //  Reemplazar por la implementación
}

// Pruebas manuales
console.log("Uno vs VerDos:", compararObjetosPorStringify(productoUno, productoUnoVerDos)); // true
console.log("Uno vs VerTres:", compararObjetosPorStringify(productoUno, productoUnoVerTres)); // false
console.log("VerDos vs VerTres:", compararObjetosPorStringify(productoUnoVerDos, productoUnoVerTres)); // false
