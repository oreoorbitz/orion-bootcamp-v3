/**
 * MÓDULO 19: MODULARIZACIÓN DEL SERVIDOR LOCAL (slightlyLate)
 *
 * 🧠 Concepto clave:
 * En proyectos reales, no escribimos un servidor desde cero cada vez.
 * Usamos bibliotecas como **Express** (Node.js) o **Oak** (Deno) que encapsulan toda la lógica de servidor
 * en funciones reutilizables y fáciles de mantener.

 * En este módulo, vas a **extraer tu servidor a un módulo reutilizable** que te servirá para los siguientes ejercicios.

 * 🎯 Objetivo:
 * Crear un módulo llamado `slightlyLate.ts` que pueda iniciar un servidor básico y servir archivos HTML desde la carpeta `dist/`
 * de tu ejercicio corrspondiente.

 * ✅ Instrucciones:
 * 1. Crea un archivo llamado `slightlyLate.ts` en la carpeta raíz de esta parte del curso (por ejemplo, en `Ejercicios_etapa_2/`)
 *
 * 2. En este archivo, exporta una función llamada `iniciarServidor`, que reciba un puerto como parámetro:
 *    ```ts
 *    export function iniciarServidor(puerto: number = 3000) {
 *      Deno.serve({ port: puerto }, async (req) => {
 *        const url = new URL(req.url);
 *        const path = url.pathname === "/" ? "/index.html" : url.pathname;
 *        try {
 *          const archivo = await Deno.readTextFile(`dist${path}`);
 *          return new Response(archivo, {
 *            headers: { "Content-Type": "text/html" }
 *          });
 *        } catch {
 *          return new Response("404 - Página no encontrada", { status: 404 });
 *        }
 *      });
 *    }
 *    ```

 * 3. En tu archivo `server.ts`, importa esta función:
 *    ```ts
 *    import { iniciarServidor } from "../slightlyLate.ts";
 *    iniciarServidor(3000);
 *    ```

 * 4. Corre el servidor con los mismos permisos que antes:
 *    ```bash
 *    deno run --allow-net --allow-read ejercicio_19/server.ts
 *    ```

 * ✅ Consejo:
 * - En el mundo real, Express (Node.js) o Oak (Deno) encapsulan este tipo de lógica.
 * - Aquí estás simulando ese tipo de abstracción para entender cómo funcionan estos módulos internamente.

 * 🧪 Bonus:
 * Puedes mejorar tu módulo para que detecte automáticamente el tipo MIME (`text/html`, `text/css`, etc.)
 * usando extensiones de archivo si quieres expandirlo.

 * Este módulo sienta las bases para reutilizar tu servidor de forma sencilla a medida que tus proyectos crecen.
 */

import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";

const plantillaPath = "./template.liquid";
const dataPath = "./data.ts";
const outputPath = "./dist/index.html";

//**Observar cambios en `data.ts`**
async function observarCambios() {
  for await (const evento of Deno.watchFs("./")) {
    if (evento.paths.some(path => path.endsWith("data.ts"))) {
      console.log("\n🔄 Cambio detectado en `data.ts`, generando nuevo archivo HTML...");
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
