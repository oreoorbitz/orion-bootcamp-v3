/**
 * MÓDULO 22: INYECTAR JAVASCRIPT TRANSPILADO EN HTML
 *
 * 🧠 Concepto clave:
 * Aunque Deno permite ejecutar TypeScript directamente, los navegadores no lo soportan.
 * Por eso, si quieres que tu código TypeScript corra en el navegador, primero debes transpilarlo a JavaScript plano.
 *
 * Usarás `transpile()` desde `https://deno.land/x/emit/mod.ts`, que reemplaza el antiguo `Deno.emit()`.
 * Esto te permite obtener el JavaScript en memoria (como string), sin necesidad de generar archivos `.js`.
 *
 * 🎯 Objetivo:
 * Crear una función que:
 * - Transpile un archivo `.ts` a `.js` en memoria
 * - Inserte ese JS como `<script>` inline dentro de un archivo HTML
 * - Sobrescriba el HTML original con el nuevo contenido
 *
 * ✅ Instrucciones:
 *
 * 1. En la raíz del proyecto (junto a `Ejercicios_etapa_2/typescript`), crea un archivo `injector.ts`
 * 2. Define y exporta la siguiente función:
 *
 * ```ts
 * export async function injector(
 *   tsPath: string,
 *   htmlPath: string
 * ): Promise<void>
 * ```
 *
 * 3. Esta función debe:
 * - Leer el contenido del archivo HTML (`htmlPath`)
 * - Usar `transpile()` para convertir el archivo `.ts` (`tsPath`) en JavaScript
 * - Insertar el JS como script inline justo antes de `</body>`
 * - Guardar el HTML resultante sobrescribiendo el archivo original
 *
 * ✅ Ejemplo de uso:
 *
 * ```ts
 * import { injector } from "../injector.ts";
 *
 * await injector("frontend.ts", "index.html");
 * ```
 *
 * ✅ Ejemplo del resultado esperado en `index.html`:
 *
 * ```html
 * <html>
 * <body>
 *   ...contenido HTML...
 *   <script>
 *     // tu JS inline aquí
 *     console.log("Este JS se ejecuta en el navegador");
 *   </script>
 * </body>
 * </html>
 * ```
 *
 * ⚙️ Importante:
 * - Deno **no tiene un DOM**, así que debes modificar el HTML como string (usa `.replace()` o `.lastIndexOf()` sin librerías externas)
 * - El módulo `emit` es el nuevo estándar para transpilar `.ts` sin escribir archivos intermedios:
 *
 * ```ts
 * import { transpile } from "https://deno.land/x/emit/mod.ts";
 *
 * const url = new URL("./frontend.ts", import.meta.url);
 * const result = await transpile(url);
 * const jsCode = result.get(url.href); // código JS como string
 * ```
 *
 * 🧪 Consejo:
 * Esta técnica es común en herramientas modernas como Vite y Astro.
 * Inyectar código inline te permite experimentar sin necesidad de un sistema complejo de rutas.
 *
 * 🧩 Integración con tu flujo actual:
 * Puedes probar esta función de dos maneras:
 * - A: Crear un `index.html` manual con contenido básico
 * - B: Usar el HTML generado por tu sistema de plantillas
 *
 * Ambas opciones funcionan, pero **en el siguiente módulo necesitarás integrarlo a tu flujo real**.
 *
 * ⚠️ Recomendación:
 * Asegúrate de tener `injector()` funcionando correctamente con HTML generado desde plantillas,
 * ya que en el Módulo 23 lo necesitarás para implementar hot reload completo.
 */
import { iniciarServidor } from "../server/slightlyLate.ts";
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts"; //  Importamos `injector()`

const plantillaPath = "./content_for_index.liquid";
const outputPath = "./dist/index.html";
const tsPath = "./frontend.ts"; //  Ajustamos la ruta de TypeScript

//  Contexto para la plantilla
const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" }
};

// **Observar cambios en `content_for_index.liquid` y `frontend.ts`**
async function observarCambios() {
    console.log("🕵️ Observando cambios en `content_for_index.liquid` y `frontend.ts`...");

    for await (const evento of Deno.watchFs("./")) {
        if (evento.paths.some((path) => path.endsWith("content_for_index.liquid")) ||
            evento.paths.some((path) => path.endsWith("frontend.ts"))) {
            console.log("\n🔄 Cambio detectado, regenerando HTML y transpiling TypeScript...");
            await recargarYGenerarHTML();
        }
    }
}

// **Generar el HTML + Inyectar el TypeScript**
async function recargarYGenerarHTML() {
    try {
        console.clear();
        console.log("✅ Generando HTML desde la plantilla...");

        //  Leer `template.liquid`
        const entradaLiquid = await Deno.readTextFile(plantillaPath);

        //  Procesar la plantilla con el contexto
        const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
        const arbolDOM = htmlParser(await plantillaRenderizada);
        const htmlFinal = renderDOM(arbolDOM);

        //  Guardar el HTML en `dist/index.html`
        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

        //  Inyectar código TypeScript en `index.html`
        await injector(tsPath, outputPath);
        console.log("✅ Código TypeScript transpilado e inyectado en `index.html`.");

    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
    }
}

// **Ejecutamos el watcher**
await recargarYGenerarHTML(); //  Render inicial + Inyección de TS
observarCambios(); //  Monitorea cambios en `content_for_index.liquid` y `frontend.ts`

//  Iniciar el servidor una sola vez
iniciarServidor(3000);
