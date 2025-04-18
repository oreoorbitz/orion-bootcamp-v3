/**
 * MÓDULO 3: MANEJO DE ATRIBUTOS
 *
 * Objetivo: Extraer y almacenar los atributos dentro de las etiquetas HTML.
 *
 * Instrucciones:
 * 1. Modifica la función del módulo anterior (o crea una nueva) para procesar los atributos de cada etiqueta de apertura/autocierre.
 * 2. Usa expresiones regulares o división con `.split` para detectar atributos como `class="btn"` o `id="main"`.
 * 3. Devuelve los tokens con un campo adicional: `atributos: Record<string, string>`
 *
 * Ejemplo:
 * Entrada: `<div class="box" id="main">`
 *
 * Resultado esperado:
 * {
 *   tipo: 'apertura',
 *   nombre: 'div',
 *   contenido: null,
 *   atributos: { class: 'box', id: 'main' }
 * }
 *
 * Sugerencia:
 * - Busca las comillas para separar los valores.
 * - Usa el método `.matchAll()` o una expresión regular tipo `(\w+)="([^"]*)"`
 */
