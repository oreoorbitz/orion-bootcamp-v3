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
 * Ejercicios_etapa_2/
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
//CORRER CON EN COMANDO     deno run --allow-read --allow-run main.ts
//imports
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";

const plantillaPath = "./template.liquid";
const dataPath = "./data.ts";
const outputPath = "./dist/index.html";


//**Observar cambios en `data.ts`** (no hubo cambios en el observador)
async function observarCambios() {
  for await (const evento of Deno.watchFs("./")) {
    if (evento.paths.some(path => path.endsWith("data.ts"))) {
      console.log("\n🔄 Cambio detectado en `data.ts`, generando nuevo archivo HTML...");
      await recargarYGenerarHTML();
    }
  }
}


// **Recargar `data.ts` y procesar la plantilla**
//**Recargar `data.ts` y generar el HTML**  (aquí si hay cambios comparado con ej.16)
async function recargarYGenerarHTML() {
  try {
    console.clear();

    // 1️ Recargar `data.ts`
    const contextoImportado = await import(`file://${Deno.cwd()}/${dataPath}?version=${Date.now()}`);
    const contexto = contextoImportado.contexto;

    // 2️ Leer `template.liquid`
    const entradaLiquid = await Deno.readTextFile(plantillaPath);

    // 3️ Procesar la plantilla con los datos actualizados
    const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
    const arbolDOM = htmlParser(plantillaRenderizada);
    const htmlFinal = renderDOM(arbolDOM);

    // 4️ Guardar el HTML en `dist/index.html`
    await Deno.writeTextFile(outputPath, htmlFinal);
    console.log("\n Archivo `dist/index.html` generado exitosamente.");
  } catch (error) {
    console.error("\n Error al generar el archivo HTML:", error);
  }
}

// **Ejecutamos el watcher**
await recargarYGenerarHTML(); // Render inicial
observarCambios(); // Monitorea cambios en `data.ts`
