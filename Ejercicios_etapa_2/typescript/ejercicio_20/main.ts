/**
 * MÓDULO 20: ENTRADA CLARA Y USO MODULAR REALISTA (main.ts)
 *
 * 🧠 Concepto clave:
 * En proyectos reales, todo empieza con un archivo de entrada (entry point) — como `main.ts` o `index.js`.
 * Este archivo importa y orquesta todos los módulos: el motor de plantillas, el servidor, los datos, etc.

 * Es importante que:
 * - El archivo principal sea fácil de leer
 * - La intención de cada línea esté clara
 * - Los módulos tengan interfaces limpias y usables

 *
 * 🎯 Objetivo:
 * Usar `mod.ts` y `slightlyLate.ts` desde tu `main.ts`, de forma clara y bien organizada.
 * Si alguna de las funciones exportadas tiene una interfaz confusa, ¡refactórala!

 *
 * ✅ Instrucciones:
 * 1. Asegúrate de tener estos archivos:
 *   - `mod.ts` — tu motor de plantillas (importa todo lo necesario: renderizado, lógica, filtros, etc.)
 *   - `slightlyLate.ts` — tu servidor reusable
 *   - `main.ts` — tu punto de entrada para correr todo

 * 2. En tu `main.ts`, importa ambos módulos de forma clara:
 *    ```ts
 *    import { renderizarArchivoLiquid } from "../mod.ts";
 *    import { iniciarServidor } from "../slightlyLate.ts";

 *    const contexto = { titulo: "Hola", descripcion: "Bienvenido" };
 *    const resultado = await renderizarArchivoLiquid("plantilla.liquid", contexto);
 *    await Deno.writeTextFile("dist/index.html", resultado);

 *    iniciarServidor(3000);
 *    ```

 * 3. Si te cuesta recordar cómo usar tus funciones, considera mejorar sus interfaces o nombres.
 *    - Por ejemplo, podrías hacer que `renderizarArchivoLiquid` reciba una ruta completa automáticamente.
 *    - O puedes agrupar funciones en un objeto para claridad, como `LiquidMotor.render(...)`.

 *
 * 🧪 Ejemplo realista (Node + LiquidJS + Express):
 * ```js
 * // index.js (Node)
 * const express = require("express");
 * const Liquid = require("liquidjs");
 * const app = express();

 * const engine = new Liquid.Liquid();
 * app.engine("liquid", engine.express());
 * app.set("views", "./templates");
 * app.set("view engine", "liquid");

 * app.get("/", (req, res) => {
 *   res.render("index", { titulo: "Hola", descripcion: "Desde Express" });
 * });

 * app.listen(3000);
 * ```

 *
 * 🧪 Ejemplo equivalente (Deno + Oak + Eta):
 * ```ts
 * import { Application, Router } from "https://deno.land/x/oak/mod.ts";
 * import { configure } from "https://deno.land/x/eta/mod.ts";

 * configure({ views: "./templates" });
 * const app = new Application();

 * const router = new Router();
 * router.get("/", async (ctx) => {
 *   const body = await Eta.renderFile("index", { titulo: "Hola desde Deno" });
 *   ctx.response.body = body;
 * });

 * app.use(router.routes());
 * app.listen({ port: 3000 });
 * ```

 *
 * ✅ Consejo:
 * - Este módulo no te pide escribir nuevas funcionalidades, sino evaluar si tu estructura actual es clara.
 * - Si no lo es, estás en el mejor momento para refactorizar.

 *
 * 🎯 Resultado esperado:
 * Un `main.ts` que:
 * - Tiene muy pocas líneas
 * - Usa bien tus módulos
 * - Se lee como una historia: importar → preparar contexto → renderizar → servir
 */

import { iniciarServidor } from '../slightlyLate.ts'
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";

const plantillaPath = "./template.liquid";
const dataPath = "./data.ts";
const outputPath = "./dist/index.html";

//**Observar cambios en `data.ts`**
async function observarCambios() {
  console.log(" Observando cambios en `data.ts` y `index.liquid`...");

  for await (const evento of Deno.watchFs("./")) {
    if (
      evento.paths.some(path => path.endsWith("data.ts")) ||
      evento.paths.some(path => path.endsWith("index.liquid"))
    ) {
      console.log("\n🔄 Cambio detectado en `data.ts` o `index.liquid`, regenerando HTML...");
      await recargarYGenerarHTML();
    }
  }
}

// **Recargar `data.ts` y generar el HTML**
async function recargarYGenerarHTML() {
  try {
    console.clear();

    // 1️ Recargar `data.ts`
    const contextoImportado = await import(`file://${Deno.cwd()}/${dataPath}?version=${Date.now()}`);
    const contexto = contextoImportado.contexto; // Usamos la variable `contexto` que definiste

    // 2️ Leer `template.liquid`
    const entradaLiquid = await Deno.readTextFile(plantillaPath);

    // 3️ Procesar la plantilla con los datos actualizados
    const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
    const arbolDOM = htmlParser(plantillaRenderizada);
    const htmlFinal = renderDOM(arbolDOM);

    // 4️ Guardar el HTML en `dist/index.html`
    await Deno.writeTextFile(outputPath, htmlFinal);
    console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");
  } catch (error) {
    console.error("\n❌ Error al generar el archivo HTML:", error);
  }
}

//**Ejecutamos el watcher**
await recargarYGenerarHTML(); // Render inicial
observarCambios(); // Monitorea cambios en `data.ts`


// 🔥 Iniciar el servidor después de generar el HTML(así ya no usamos la basurota d archivo server owo)
iniciarServidor(3000);
