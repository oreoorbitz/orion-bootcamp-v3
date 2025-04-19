// EJERCICIO 4: TIPOS Y EXPRESIONES IF EN JAVASCRIPT
//
// Instrucciones para el/la estudiante:
//
// 1. Debes declarar y exportar las funciones EXACTAMENTE con los siguientes nombres:
//    - determinarTipoNumero
//    - esPositivo
//    - dividirSeguro
//    - evaluarLongitud
//
// 2. Sigue los comentarios "TODO" dentro de cada sección para implementar la lógica.
//
// 3. El archivo de pruebas (test) requiere que exportes e importes
//    las mismas funciones con estos mismos nombres, así que no los cambies.
//
// 4. Las constantes de texto (TEXTO_DIVISOR, etc.) ya están definidas y exportadas.
//    Úsalas para retornar los mensajes necesarios.
//
// Ejemplo de Uso (una vez implementadas las funciones):
// console.log(determinarTipoNumero(10.0));  // "Número entero: 10"
// console.log(esPositivo(-1.0));            // false
// console.log(dividirSeguro(10, 0));       // "Error: divisor es cero"
// console.log(evaluarLongitud("Lovelace")) // "El texto 'Lovelace' es largo"

export const TEXTO_DIVISOR = "Error: divisor es cero";
export const TEXTO_NUMERO_ENTERO = "Número entero:";
export const TEXTO_NUMERO_DECIMAL = "Número decimal:";
export const TEXTO_CORTO = "es corto";
export const TEXTO_LARGO = "es largo";

/**
 * TODO: Implementar la función "determinarTipoNumero"
 * Debe recibir un número (num) y retornar un string:
 *   - Si es entero (num % 1 === 0), retornar `${TEXTO_NUMERO_ENTERO} ${num}`
 *   - De lo contrario, retornar `${TEXTO_NUMERO_DECIMAL} ${num}`
 *
 * Recuerda exportarla con: export function determinarTipoNumero(num) {...}
 */
//
// export function determinarTipoNumero(num) {}

export function determinarTipoNumero(num){
    
    if (num % 1 === 0){ 
       return `${TEXTO_NUMERO_ENTERO} ${num}`

    }
}
let r = determinarTipoNumero(10)
console.log(r)
r = determinarTipoNumero(3.50)
console.log(r)

/**
 * TODO: Implementar la función "esPositivo"
 * Debe recibir un número (num) y retornar un boolean:
 *   - true si num es mayor que 0
 *   - false en caso contrario
 *
 * Recuerda exportarla con: export function esPositivo(num) {...}
 */
//
// export function esPositivo(num) {
export function esPositivo(num){
    
}
   
    
/**
 * TODO: Implementar la función "dividirSeguro"
 * Debe recibir dos números (dividendo, divisor) y retornar:
 *   - El resultado de la división (dividendo / divisor) si divisor != 0
 *   - TEXTO_DIVISOR si divisor === 0
 *
 * Recuerda exportarla con: export function dividirSeguro(dividendo, divisor) {...}
 */
//
// export function dividirSeguro(dividendo, divisor) {
export function dividirSeguro(dividendo, divisor){
    
    if (divisor === 0){
        const TEXTO_DIVISOR = "Error divisor es "
        return `${TEXTO_DIVISOR} ${dividendo/divisor}`

    }
}

/**
 * TODO: Implementar la función "evaluarLongitud"
 * Debe recibir un string (texto) y retornar:
 *   - "El texto '<texto>' es largo" si texto.length > 5
 *   - "El texto '<texto>' es corto" si texto.length <= 5
 *
 * Recuerda exportarla con: export function evaluarLongitud(texto) {...}
 */export function evaluarLongitud(texto){

 }
//
// export function evaluarLongitud(texto) {}

