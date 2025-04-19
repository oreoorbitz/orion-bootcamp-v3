/**
 * MÓDULO 11: RENDERIZAR A HTML
 *
 * Objetivo: Tomar una estructura de elemento JS (como un árbol) y convertirla en una cadena HTML.
 *
 * Instrucciones:
 * 1. Crea una función `renderizarHTML(nodo: any): string`
 * 2. Si el nodo es de tipo "texto", devuelve el contenido de texto
 * 3. Si es un "elemento", construye una cadena HTML:
 *    - comienza con `<nombre ...atributos>`
 *    - si tiene hijos, colócalos entre la etiqueta de apertura y cierre
 *    - si no tiene hijos, puedes cerrar la etiqueta como `<br />` (opcional)
 *
 * Estructura de ejemplo:
 * {
 *   tipo: 'elemento',
 *   nombre: 'div',
 *   atributos: { class: 'box', id: 'main' },
 *   hijos: [
 *     { tipo: 'texto', contenido: 'Hola mundo' },
 *     {
 *       tipo: 'elemento',
 *       nombre: 'span',
 *       atributos: {},
 *       hijos: [{ tipo: 'texto', contenido: '✨' }]
 *     }
 *   ]
 * }
 *
 * Salida esperada:
 * "<div class=\"box\" id=\"main\">Hola mundo<span>✨</span></div>"
 *
 * Enfócate en: construir cadenas, recursión, formateo de atributos HTML
 */
