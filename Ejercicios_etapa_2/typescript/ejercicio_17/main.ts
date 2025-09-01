/**
 * MÓDULO 17: GENERAR ARCHIVOS HTML EN DISCO USANDO TU PIPELINE
 *
 * 🧠 Concepto clave:
 * Hasta ahora, tu motor de plantillas mostraba HTML directamente en consola. Pero en proyectos reales (como sitios estáticos),
 * el HTML generado se guarda como archivos `.html` en una carpeta como `/dist` para ser servido por un servidor o subido a producción.
 *
 * En este módulo vas a modificar tu pipeline para que guarde archivos reales en vez de solo imprimirlos.
 * Esto simula el comportamiento de herramientas como Jekyll, Astro o Eleventy.
 *
 * 🎯 Objetivo:
 * Escribir en el sistema de archivos el HTML generado a partir de una plantilla `.liquid` y un objeto `contexto`.
 *
 * ✅ Estructura sugerida:
 * ```
 * Typescript/
 * ├── plantilla_motor/
 * │   └── mod.ts
 * ├── ejercicio_17/
 * │   ├── main.ts
 * │   ├── template.liquid
 * │   ├── data.ts
 * │   └── dist/
 * │       └── index.html       ← se genera automáticamente
 * ```
 *
 * ✅ Instrucciones:
 * 1. Asegúrate de tener:
 *    - Un archivo `template.liquid`
 *    - Un archivo `data.ts` que exporte el objeto `contexto`
 *
 * 2. Crea o limpia una carpeta `dist/` en tu módulo
 *    - Puedes usar `Deno.mkdir("dist", { recursive: true })`
 *    - Puedes borrar el archivo anterior con `Deno.remove()` si deseas sobrescribirlo
 *
 * 3. Usa tu función `renderizarArchivoLiquid()` para generar el HTML como string
 *
 * 4. Guarda ese string como `dist/index.html` usando:
 *    ```ts
 *    await Deno.writeTextFile("dist/index.html", htmlGenerado);
 *    ```
 *
 * 5. Opcional: muestra un mensaje de confirmación en consola (`console.log("✅ Archivo generado")`)
 *
 * ✅ Resultado esperado:
 * Un archivo `dist/index.html` con el HTML renderizado usando la plantilla y el contexto.
 *
 * Ejemplo:
 * // template.liquid
 * "<h1>{{ titulo }}</h1><p>{{ mensaje }}</p>"
 *
 * // data.ts
 * export const contexto = { titulo: "Bienvenido", mensaje: "Este sitio fue generado con JavaScript." }
 *
 * // dist/index.html (salida)
 * <h1>Bienvenido</h1>
 * <p>Este sitio fue generado con JavaScript.</p>
 *
 * ✅ Consejo:
 * - Este módulo convierte tu motor de plantillas en una herramienta funcional de compilación estática
 * - Si usas múltiples plantillas en el futuro, puedes repetir esta lógica y generar `producto.html`, `contacto.html`, etc.
 */
