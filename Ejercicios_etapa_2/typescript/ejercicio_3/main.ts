/**
 * MÓDULO 3: MANEJO DE ATRIBUTOS
 *
 * 🧠 Concepto clave:
 * En HTML, las etiquetas pueden tener *atributos* que modifican su comportamiento: `<div class="box" id="main">`.
 * Estos atributos se usan para aplicar estilos, referenciar elementos, o darles comportamiento.
 * En este módulo, vamos a extraer esa información para que luego podamos buscar elementos por `id`, `class`, etc.
 *
 * Objetivo:
 * Detectar y extraer los atributos presentes dentro de las etiquetas de apertura o autocierre.
 *
 * Instrucciones:
 * 1. Modifica la salida del módulo 2 (o crea una nueva función) para detectar atributos.
 * 2. Para cada etiqueta que tenga atributos, crea un campo `atributos` como un objeto:
 *    `{ class: 'box', id: 'main' }`
 * 3. Usa expresiones regulares o divisiones con `.split`, `.matchAll`, etc.
 *
 * Ejemplo de entrada:
 * `<div class="box" id="main">`
 *
 * Resultado esperado:
 * {
 *   tipo: 'apertura',
 *   nombre: 'div',
 *   contenido: null,
 *   atributos: { class: 'box', id: 'main' }
 * }
 *
 * Consejo:
 * - Busca solo dentro del contenido de la etiqueta (no el texto externo)
 * - Este paso te ayudará a construir funciones como `getElementById` o `getElementsByClassName` más adelante.
 */
