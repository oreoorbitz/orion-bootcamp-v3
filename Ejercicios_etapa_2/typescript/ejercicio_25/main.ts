/**
 * MÓDULO 25: CLI Mockify y conexión con servidor local
 *
 * 🧠 Concepto clave:
 * En entornos profesionales como Shopify, los desarrolladores usan una interfaz de línea de comandos (CLI)
 * para iniciar un servidor, observar archivos, generar plantillas
 *
 * En este módulo, vas a crear tu propia CLI llamada `Mockify` para simular parte de ese flujo:
 * - Validar la estructura de carpetas esperada
 * - Observar archivos importantes para cambios
 *
 * 🎯 Objetivo:
 * Implementar una CLI usable como:
 *
 * ```
 * deno run --allow-all ../mockify.ts theme dev
 * ```
 *
 * que:
 * - Valide que el directorio actual tenga la estructura esperada
 * - Observe cambios en archivos `.liquid` o de CSS dentro de `assets/`
 * - Los cambios que observa mockify, son enviados al servido. Al momento cierta funcionalidad que va ir al servido lo estamos guardando en main.ts
 * - Reciba una URL para previsualizar la tienda y la muestre en consola
 *
 * ✅ Instrucciones:
 *
 * 1. Crea un archivo `mockify.ts` en el directorio superior (`Ejercicios_etapa_2/typescript`).
 *
 * 2. Implementa una función que valide que el directorio actual tenga:
 *    - Una carpeta `assets/`
 *    - Un archivo `content_for_index.liquid`
 *    - Un archivo `theme.liquid`
 *    - Un archivo `main.ts`
 *
 * 3. Usa `Deno.watchFs()` para escuchar cambios en:
 *    - Todos los archivos dentro de `assets/`
 *    - `content_for_index.liquid`
 *    - `theme.liquid`
 *
 * 4. Usa `Deno.args` para verificar si el comando recibido es:
 *
 * 5. Mockify no debe generar el html final. Esta funcionalidad lo puedes poner en main.ts, o crear otro modulo en Ejercicios_etapa_2/typescript/server. Tu dicides de la mejor forma para que los cambios observados en mockify activen esta funcionalidad para este ejercicio.
 *
 * ```
 * theme dev
 * ```
 *
 * y toma la carpeta actual como contexto. // elminar esta linea
 *
 * 5. Conéctate al servidor a través de WebSocket.
 *    - Cuando el servidor esté listo, debe enviarte un mensaje como:
 *      `{ type: "ready", url: "http://127.0.0.1:9292" }`
 *    - Muestra esa URL con un formato decorado como:
 *
 * ```
 * ╭─ success ─────────────────────────────────────────────╮
 * │                                                      │
 * │  Preview your theme (t)                              │
 * │    • http://127.0.0.1:9292                           │
 * ╰──────────────────────────────────────────────────────╯
 * ```
 *
 * 6. Cada vez que un archivo observado cambie:
 *    - Si es un archivo `.css`, envía al servidor:
 *
 * ```ts
 * { type: "reload-css" }
 * ```
 *
 *
 *    - Luego, envía al servidor:
 *
 * ```ts
 * { type: "reload" }
 * ```
 *
 * para que el navegador recargue.
 *
 *
 * 📁 Estructura esperada:
 * En la carpeta donde se ejecuta `Mockify`, debe existir:
 *
 * ```
 * .
 * ├── assets/
 * ├── content_for_index.liquid
 * ├── theme.liquid
 * ```
 *
 * 🧠 ¿Quién hace qué?
 *
 * A partir de este módulo:
 *
 * - `Mockify` se encarga de observar archivos, comunicarse con el servidor.
 *
 * En módulos futuros, `main.ts` irá perdiendo responsabilidades hasta desaparecer,
 * y el servidor o el CLI se harán cargo por completo.
 *
 * 🧭 Consejo:
 * Si quieres correr el comando como `Mockify theme dev` directamente,
 * puedes añadir el directorio donde está `mockify.ts` a tu `PATH` del sistema.
 *
 * Esto es opcional pero útil para imitar el flujo de trabajo de herramientas reales.
 *
 * 🔁 Recomendación:
 * Usa este módulo como base para un entorno de desarrollo donde consola, servidor,
 * navegador y archivos estén conectados y reaccionen en tiempo real.
 */
import { iniciarServidor } from "./server/slightlyLate.ts";
import { liquidEngine } from "./plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "./plantilla_motor/parserDehtml.ts";
import { renderDOM } from "./plantilla_motor/renderizador.ts";
import { injector } from "./injector.ts";

const plantillaPath = "./content_for_index.liquid";
const outputPath = "./dist/index.html";

//  Contexto para la plantilla
const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" },
};



//Para recargar y regenerar el html
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

        // Inyectar `hotreload.ts` en el HTML
        const tsPath = new URL("../server/hotreload.ts", import.meta.url).href
        await injector(tsPath, outputPath);
        console.log("\n✅ Hot Reload inyectado correctamente en index.html.");

    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
    }
}

//// Esto es lo que va a ser ejecutado

await recargarYGenerarHTML(); //

//  **Asegurar que el servidor se inicia correctamente**
iniciarServidor(3000);
