import { transpile } from "https://deno.land/x/emit/mod.ts";

export async function injector(tsPath: string, htmlPath: string): Promise<void> {
    try {
        console.log("✅ Iniciando la inyección de TypeScript...");
        console.log(` Archivo TS: ${tsPath}`);
        console.log(` Archivo HTML: ${htmlPath}`);

        // Leer contenido del HTML directamente con `Deno.readTextFile()`
        const htmlContent = await Deno.readTextFile(htmlPath);
        console.log(" Contenido HTML leído correctamente.");

        // Transpilar TypeScript a JavaScript
        const tsPathAbsoluto = new URL(tsPath, import.meta.url).href.replace("/server/", "/typescript/server/");
        console.log(new URL(tsPath, import.meta.url).href)
        console.log('tsPathAbsoluto es:',tsPathAbsoluto)
        console.log('tsPath es:',tsPath)
        const result = await transpile(tsPathAbsoluto);

        // Verificar si hay código transpilado
        if (!result || result.size === 0) {
        throw new Error("❌ Error: No se generó código transpilado.");
        }

        // Extraer el código JS generado
        const jsCode = result.get(tsPathAbsoluto);

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
