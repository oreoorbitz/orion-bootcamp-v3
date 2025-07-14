import { zip } from "jsr:@deno-library/compress";
import { notificarReloadCSS } from "./wsServer.ts";
import { ThemeUpdateData } from "./types.ts";
import { router } from "./router.ts";
import { generarDesdeRuta } from "./controller.ts";


function temmplateToHtmlMapper(template: string) {
    switch (template) {
        case "index":
            return "index.html";
        case "article":
            return "article.html";
        case "blog":
            return "blog.html";
        case "cart":
            return "cart.html";
        case "collection":
            return "collection.html";
        case "list-collections":
            return "list-collections.html";
        case "customers/account":
            return "customers/account.html";
        case "customers/activate_account":
            return "customers/activate_account.html";
        case "customers/addresses":
            return "customers/addresses.html";
        case "customers/login":
            return "customers/login.html";
        case "customers/order":
            return "customers/order.html";
        case "customers/register":
            return "customers/register.html";
        case "customers/reset_password":
            return "customers/reset_password.html";
        case "gift_card":
            return "gift_card.html";
        case "page":
            return "page.html";
        case "password":
            return "password.html";
        case "product":
            return "product.html";
        case "search":
            return "search.html";
        default:
            return "index.html";
    }
}

async function manejarPeticionThemeUpdate(req: Request, callback: () => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");
    const rutaTema = `./server/themes/dev`;


    try {
        const formulario = await req.formData()
        const archivo = formulario.get("archivo") as File
        const carpetaGuardado = formulario.get("carpeta") as string
        const buffer = await archivo.arrayBuffer()
        const uint = new Uint8Array(buffer)
        const nombre = archivo.name
        const tipoExtension = formulario.get("tipoExtension") as string
        const rutaZip = `${rutaTema}/${nombre}.zip`;
        const rutaDestino = carpetaGuardado === "assets"
            ? `${rutaTema}/dist/${carpetaGuardado}`
            : `${rutaTema}/${carpetaGuardado}`;

        await Deno.writeFile(rutaZip, uint)

        // 📂 Asegurar que la carpeta existe antes de continuar
        try {
            await Deno.stat(rutaDestino);
        } catch {
            console.log(`📂 La carpeta ${rutaDestino} no existe, creándola...`);
            await Deno.mkdir(rutaDestino, { recursive: true });
        }

        // 📦 Descomprimiendo el ZIP en la ruta correcta
        console.log(`📦 Desempaquetando el ZIP en: ${rutaDestino}`);
        await zip.uncompress(rutaZip, rutaDestino);

        //Si el archivo es `.css`, enviamos la señal de recarga de estilos
        if (tipoExtension == "css") {
            notificarReloadCSS();
            console.log("📤 Señal de recarga de CSS enviada a los clientes WebSocket.");
        }

        // 🗑️ Ahora eliminamos zip
        try {
            await Deno.remove(rutaZip, { recursive: true });
            console.log(`La carpeta ${rutaZip} ha sido eliminada correctamente.`);
        } catch {
            console.log(`La carpeta ${rutaZip} no ha podido ser eliminada o no existía`);
        }


        const data: ThemeUpdateData = {
            carpetaGuardado,
            tipoExtension,
            nombre
        }

        console.log("antes del callback")
        return await callback(data);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: () => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    let path: string;

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        if (url.pathname.startsWith("/assets")) {
            const assetPath = `server/themes/dev/dist${url.pathname}`;
            try {
                const asset = await Deno.readTextFile(assetPath);
                return new Response(asset, {
                    headers: { "Content-Type": "text/css" }
                });
            } catch {
                return new Response("404 - Asset not found", { status: 404 });
            }
        }

        try {
            const html = await generarDesdeRuta(url.pathname);
            return new Response(html, {
                headers: { "Content-Type": "text/html" }
            });
        } catch (err) {
            console.error("❌ Error generando HTML desde ruta:", err);
            return new Response("Error interno del servidor", { status: 500 });
        }
    });
}
