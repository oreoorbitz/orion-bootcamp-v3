/**
 * MÓDULO 15: SIMULACIÓN DE ENLACE UNIDIRECCIONAL (ONE-WAY DATA BINDING) EN TERMINAL
 *
 * 🧠 Concepto clave:
 * En frameworks modernos como Vue, React o Angular, los datos cambian y la vista se actualiza automáticamente.
 * A esto se le llama "enlace unidireccional" (one-way data binding).
 *
 * En este módulo, simularás este comportamiento en la consola:
 * - Cambias el archivo de datos manualmente
 * - El sistema detecta ese cambio
 * - Vuelve a ejecutar la plantilla y renderiza la salida en la terminal automáticamente
 *
 * Objetivo:
 * Implementar un "renderizador vivo" que observa un archivo `.json` o `.ts` y actualiza el contenido mostrado en consola
 * cada vez que los datos cambian.
 *
 * Estructura esperada:
 * - `main.ts` — código del watcher y la función `render()`
 * - `data.ts` — archivo con el objeto `contexto` que puede ser editado manualmente
 * - `template.liquid.html` — archivo de plantilla HTML con variables de tipo `{{ }}` o directivas `{% %}`
 *
 * Instrucciones:
 * 1. Crea un archivo llamado `data.ts` que exporte un objeto `contexto`, por ejemplo:
 *    export const contexto = { nombre: "Ana", edad: 30 }
 *
 * 2. Usa `Deno.watchFs()` en `main.ts` para escuchar cambios en `data.ts`
 *    - Cada vez que cambie, usa `import("file:///.../data.ts?version=${Date.now()}")` para volver a importar los datos actualizados.
 *
 * 3. Crea una función `render()` que:
 *    - Cargue el contenido de la plantilla (puede estar embebida o en un archivo)
 *    - Reemplace los datos usando tu pipeline de módulos anteriores (tokens, variables, condiciones, bucles, filtros)
 *    - Imprima el resultado en consola (limpia la consola antes si es posible)
 *
 * Consejo:
 * - Usa `console.clear()` o imprime una línea de separación para mejorar la legibilidad
 * - Puedes usar un `setTimeout` o `setInterval` si prefieres evitar `Deno.watchFs` al principio
 *
 * Resultado esperado:
 * Cada vez que edites y guardes `data.ts`, el programa recompila la salida y la muestra en la terminal.
 *
 * Ejemplo de flujo:
 * // template.liquid.html
 * "<h1>{{ nombre }}</h1><p>Tienes {{ edad }} años.</p>"
 *
 * // data.ts
 * export const contexto = { nombre: "Ana", edad: 30 }
 *
 * // consola
 * <h1>Ana</h1>
 * <p>Tienes 30 años.</p>
 *
 * // Editas data.ts → edad: 31
 *
 * // consola actualizada automáticamente
 * <h1>Ana</h1>
 * <p>Tienes 31 años.</p>
 *
 * Este módulo convierte tu compilador en un renderizador en tiempo real con enlace unidireccional.
 */
