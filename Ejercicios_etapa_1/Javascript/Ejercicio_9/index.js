// index.js

/**
 * EJERCICIO 9: GENERACIÓN Y VALIDACIÓN DE SKUs EN UN ENTORNO E-COMMERCE
 *
 * Instrucciones:
 *
 * 1. Se te proporcionan dos cadenas (strings) que representan objetos con propiedades inspiradas en Shopify:
 *      PRODUCTO_STRING_UNO y PRODUCTO_STRING_DOS.
 *    Cada una contiene valores como:
 *      - id
 *      - handle
 *      - vendor
 *      - title
 *      - price
 *      - tags
 *    El primer paso es convertir dichas cadenas a objetos JavaScript reales usando JSON.parse.
 *
 * 2. Crea la función "generarSKU" que reciba un objeto producto y retorne un string con este formato:
 *    - Los 2 primeros caracteres de product.vendor en mayúsculas.
 *    - Un guion medio.
 *    - El id con 4 dígitos (puedes usar .padStart(4,"0") o un método similar).
 *    - Un carácter "X" adicional si product.price > 100 (opcional según tu criterio).
 *    Ejemplo: "VE-0042" o "VE-0042X"
 *
 * 3. Crea la función "validarSKU" que reciba un string (sku) y retorne un boolean:
 *    - Usa un regex que encaje con la lógica anterior. Por ejemplo:
 *      ^[A-Z]{2}-\d{4}[A-Z]?$
 *    - Retorna true si hace match, false en caso contrario.
 *
 * 4. DEMO (una vez implementado):
 *    a. Usa JSON.parse para convertir PRODUCTO_STRING_UNO (y opcionalmente PRODUCTO_STRING_DOS) a objetos.
 *    b. Llama a "generarSKU" con uno o ambos objetos y guarda los resultados.
 *    c. Imprime los SKUs generados.
 *    d. Llama a "validarSKU" con cada SKU y muestra si es válido o no.
 *
 * ¡Suerte con la práctica de regex y funciones de generación / validación de SKUs!
 */

// ------------------------------------------------------------------------------------------------
// Cadena con datos de un producto
// ------------------------------------------------------------------------------------------------
export const PRODUCTO_STRING_UNO = `{
  "id": 42,
  "handle": "simple-tee",
  "vendor": "Velocity",
  "title": "Camiseta Simple",
  "price": 1999,
  "tags": ["ropa", "camiseta", "oferta"]
}`;

export const PRODUCTO_STRING_DOS = `{
  "id": 256,
  "handle": "casual-tee",
  "vendor": "Velocity",
  "title": "Camiseta Casual",
  "price": 1999,
  "tags": ["ropa", "camiseta"]
}`;

// 1b. TODO: Convierte la cadena PRODUCTO_STRING_UNO y PRODUCTO_STRING_DOS a objetos reales usando JSON.parse.
// llama las variables, productoUno y productoDos Asegúrate de exportarlos para la prueba.

// ------------------------------------------------------------------------------------------------
// 2. Crea la función "generarSKU"
// ------------------------------------------------------------------------------------------------
/**
 * Genera un SKU en el formato "<XX>-<####>[X]":
 *  - <XX>: 2 primeros caracteres de 'vendor' en mayúscula
 *  - <####>: el id con 4 dígitos
 *  - [X]: opcional si el precio > 100
 *  - Pistas: vas a querer usar prototype.string.padStart
 * @param {object} producto - Objeto con { id: number, vendor: string, price: number, ... }
 * @returns {string} El SKU generado
 */
// la funcion debria llamarse generarSKU, asegura exportarla

// ------------------------------------------------------------------------------------------------
// 3. Crea la función "validarSKU"
// ------------------------------------------------------------------------------------------------
/**
 * Valida un SKU según la regla:
 *  ^[A-Z]{2}-\\d{4}[A-Z]?$
 * @param {string} sku - El SKU a validar
 * @returns {boolean} true si es válido, false en caso contrario
 */
// la funcion debria llamarse validarSKU, asegura exportarla

