import { transpile } from "https://deno.land/x/emit/mod.ts";

export async function injector(tsPath: string, htmlPath: string): Promise<void> {
    try {
        console.log("✅ Iniciando la inyección de TypeScript...");
        console.log(` Archivo TS: ${tsPath}`);
        console.log(` Archivo HTML: ${htmlPath}`);

        // Leer contenido del HTML directamente con `Deno.readTextFile()`
        const htmlContent = await Deno.readTextFile(htmlPath);
        console.log(" Contenido HTML leído correctamente.");

        //console.log("📌 Verificando ruta TS antes de transpilar:", tsPath);
        const result = await transpile(tsPath);
        //console.log("📌 Resultado de transpile:", result);

        // Verificar si hay código transpilado
        if (!result || result.size === 0) {
        throw new Error("❌ Error: No se generó código transpilado.");
        }

        // Verificar qué clave tiene `result`
        console.log("📌 Claves disponibles en result:", Array.from(result.keys()));

        // Buscar la clave correcta en el Map
        const transpiledKey = Array.from(result.keys()).find(key => key.includes("hotreload.ts"));

        if (!transpiledKey) {
          throw new Error("❌ Error: No se encontró la clave correcta para el código transpilado.");
        }

        // Extraer el código JS generado
        const jsCode = result.get(transpiledKey);

        if (!jsCode) {
        throw new Error("❌ Error: Código transpilado está vacío.");
        }
        console.log(" Código JS transpilado:", jsCode);

        //Comprobación antes de modificar el HTML
        if (htmlContent.includes(`<script>${jsCode}</script>`)) {
        console.log("⚠️ El código JS ya está inyectado, omitiendo actualización.");
        return;
        }

        // Insertar el código JS en `index.html`
        const modifiedHtml = htmlContent.replace(
        "</body>",
        `<script>${jsCode}</script></body>`
        );
        console.log("✅ Código JS inyectado en HTML correctamente.");

        // Guardar los cambios en `index.html`
        await Deno.writeTextFile(htmlPath, modifiedHtml);
        console.log("✅ Archivo HTML actualizado con éxito.");

    } catch (error) {
        console.error("❌ Error en injector:", error);
        return;
    }
}
