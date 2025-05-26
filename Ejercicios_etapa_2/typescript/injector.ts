//export async function injector(tsPath: string, htmlPath: string): Promise<void> {

//}
const tsPath = "../ejercicio_22/frontend.ts";

import { transpile } from "https://deno.land/x/emit/mod.ts";



try {
    const { files } = await transpile(tsPath, { bundle: "module" });

    console.log("🔹 Código JS transpilar:", files["deno:///bundle.js"]);
} catch (error) {
    console.error("❌ Error en injector:", error);
}
