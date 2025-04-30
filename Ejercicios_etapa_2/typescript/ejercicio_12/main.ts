/**
 * MÓDULO 11: ESCAPE DE CARACTERES Y CASOS ESPECIALES
 *
 * Objetivo: Asegurar que los textos renderizados no rompan el HTML, y proteger contra contenido peligroso.
 *
 * Instrucciones:
 * 1. Crea una función `escapeTexto(texto: string): string`
 * 2. Reemplaza los caracteres peligrosos por sus entidades HTML:
 *    - `&` → `&amp;`
 *    - `<` → `&lt;`
 *    - `>` → `&gt;`
 *    - `"` → `&quot;`
 *    - `'` → `&#39;`
 * 3. Asegúrate de que `renderizarHTML()` use esta función cuando se encuentre un nodo de tipo `texto`.
 *
 * Entrada de ejemplo:
 * Texto: `"Hola <script>alert('hack')</script>"`
 *
 * Resultado esperado:
 * `"Hola &lt;script&gt;alert(&#39;hack&#39;)&lt;/script&gt;"`
 *
 * Consejo:
 * - Usa `.replace()` en cadena, o un mapa de reemplazo
 * - Puedes escribir pruebas para cada carácter especial como validación
 */
