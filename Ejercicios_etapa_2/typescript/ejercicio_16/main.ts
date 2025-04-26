/**
 * MÓDULO 16: ESCRITURA DE ARCHIVOS HTML A LA CARPETA `dist/`
 *
 * 🧠 Concepto clave:
 * Los generadores de sitios estáticos (como Eleventy, Astro, o Hugo) transforman datos y plantillas en archivos HTML
 * que se escriben a una carpeta lista para ser servida, generalmente llamada `dist/` o `public/`.
 *
 * En este módulo, escribirás los archivos HTML que has generado previamente con tu pipeline a la carpeta `dist/`,
 * preparándolos para ser servidos en un navegador.
 *
 * Objetivo:
 * Crear una función que escriba uno o más archivos HTML en una carpeta local.
 *
 * Instrucciones:
 * 1. Asegúrate de que el resultado final del procesamiento (como el generado por `generarHTMLDesdePlantilla(...)`) esté disponible como string.
 * 2. Usa la función `Deno.writeTextFile()` para escribir ese string en un archivo dentro de la carpeta `dist/`.
 *    - Si la carpeta no existe, créala con `Deno.mkdir('dist', { recursive: true })`
 * 3. Si estás generando múltiples archivos (por ejemplo, uno por producto), genera nombres como `producto1.html`, `producto2.html`, etc.
 *
 * Ejemplo de uso:
 * ```ts
 * const contenido = generarHTMLDesdePlantilla(template, contexto);
 * await Deno.mkdir('dist', { recursive: true });
 * await Deno.writeTextFile('dist/index.html', contenido);
 * ```
 *
 * Consejo:
 * - Si quieres generar múltiples archivos, puedes usar un loop sobre un arreglo de objetos.
 * - Este módulo es el último paso antes de servir tus archivos en un navegador.
 */
