import { zip } from "jsr:@deno-library/compress";
import { notificarReloadCSS } from "./wsServer.ts";
import { router } from "./router.ts";

// 📋 Lista de endpoints .js soportados
const JS_ENDPOINTS = ['/cart.js'];

// 🛒 Función para manejar el endpoint /cart.js
async function manejarCartJs(): Promise<Response> {
    try {
        // Leer el archivo JSON desde el disco
        const cartDataText = await Deno.readTextFile("/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/cart.js");

        // Convertir el texto a JSON para validar que es válido
        const cartData = JSON.parse(cartDataText);

        return new Response(JSON.stringify(cartData), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Para permitir requests AJAX
            }
        });
    } catch (error) {
        console.error("❌ Error leyendo cart.js:", error);
        return new Response(JSON.stringify({ error: "No se pudo cargar el carrito" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// 🔧 Función para manejar todos los endpoints .js
async function manejarEndpointsJs(pathname: string): Promise<Response | null> {
    switch (pathname) {
        case '/cart.js':
            return await manejarCartJs();
        default:
            return null; // No es un endpoint .js que manejemos
    }
}

// 🎯 Función para manejar todas las rutas estáticas y dinámicas
async function manejarRutas(url: URL): Promise<Response> {
    let filePath: string;

    if (url.pathname === "/") {
        filePath = "server/themes/dev/dist/content_for_index.html";
    } else if (url.pathname === "/theme.css") {
        filePath = "server/themes/dev/dist/theme.css";
    } else if (url.pathname.startsWith("/assets/")) {
       const assetName = url.pathname.replace("/assets/", "");
       filePath = `server/themes/dev/dist/assets/${assetName}`;
    } else {
        // Usar el router para resolver todas las rutas
        const routeResult = router.resolve(url.pathname);

        if (routeResult) {
            if (routeResult.directory && routeResult.handle) {
                // Ruta dinámica (product/collection)
                filePath = `server/themes/dev/dist/${routeResult.directory}/${routeResult.handle}.html`;
            } else {
                // Ruta estática (content_for_index)
                filePath = `server/themes/dev/dist/${routeResult.type}.html`;
            }
        } else {
            // Si no se encuentra, servir 404.html directamente
            console.log(`❌ Ruta no encontrada: ${url.pathname}`);
            return await servirArchivo404();
        }
    }

    console.log(`📂 Intentando servir archivo: ${filePath}`);

    try {
        const archivo = await Deno.readTextFile(filePath);

        // Determinar el Content-Type
        const contentType = filePath.endsWith(".css") ? "text/css" : "text/html";

        return new Response(archivo, {
            headers: { "Content-Type": contentType }
        });

    } catch (error) {
        console.log(`❌ Archivo no encontrado: ${filePath}`);
        return await servirArchivo404();
    }
}

// 📄 Función para servir archivo 404
async function servirArchivo404(): Promise<Response> {
    try {
        const archivo404 = await Deno.readTextFile("server/themes/dev/dist/404.html");
        return new Response(archivo404, {
            status: 404,
            headers: { "Content-Type": "text/html" }
        });
    } catch {
        // Si no existe 404.html, devolver mensaje básico
        return new Response("404 - Página no encontrada", {
            status: 404,
            headers: { "Content-Type": "text/html" }
        });
    }
}

async function manejarPeticionThemeUpdate(req: Request, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");
    const rutaTema = `./server/themes/dev`;

    try {
        const formulario = await req.formData()
        const archivo = formulario.get("archivo") as File
        const carpetaGuardado = formulario.get("carpeta") as string
        const tipoExtension = formulario.get("tipoExtension") as string
        const templateEspecifico = formulario.get("templateEspecifico") as string
        const templateNombre = formulario.get("templateNombre") as string

        const buffer = await archivo.arrayBuffer()
        const uint = new Uint8Array(buffer)
        const nombre = archivo.name
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

        // Si el archivo es `.css`, enviamos la señal de recarga de estilos
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

        console.log("antes del callback")

        // ✨ Pasar el nombre del template específico al callback
        let changedTemplate: string | undefined;
        if (templateEspecifico === "true" && templateNombre) {
            changedTemplate = templateNombre;
            console.log(`🎯 Template específico detectado: ${changedTemplate}`);
        }

        return await callback(changedTemplate);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        // POST /theme-update
        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        // 🛒 Verificar si es un endpoint .js
        if (JS_ENDPOINTS.includes(url.pathname)) {
            const jsResponse = await manejarEndpointsJs(url.pathname);
            if (jsResponse) {
                console.log(`🛒 Sirviendo endpoint JS: ${url.pathname}`);
                return jsResponse;
            }
        }

        // 🎯 Manejar todas las demás rutas
        return await manejarRutas(url);
    });
}
