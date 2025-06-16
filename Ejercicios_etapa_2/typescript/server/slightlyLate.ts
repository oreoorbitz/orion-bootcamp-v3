import { zip } from "jsr:@deno-library/compress";
import { CallbackData, ParentFolder, FileName } from '../types/types.ts';

const isValidFileName = (name: string): name is FileName => /\.(zip|css|liquid)$/.test(name);

async function manejarPeticionThemeUpdate(req: Request, callback: (data: CallbackData) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");

    try {
        const form = await req.formData();

        const file = form.get("archivo") as File;

        if (!file) {
            console.error("❌ No se recibió archivo ZIP.");
            return new Response("No se recibió archivo ZIP", { status: 400 });
        }

        const fileName = file.name;

        if( !isValidFileName(fileName)) {
            console.error("❌ Nombre de archivo no válido:", fileName);
            return new Response("Nombre de archivo no válido", { status: 400 });
        }
        
        const stem = fileName.split('.')[0]
        const parentFolder = form.get("carpeta") as ParentFolder;

        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const rutaBase = Deno.realPathSync("./server/themes/dev");
        const rutaZip = `${rutaBase}/${stem}.zip`;

        const rutaAssets = `${rutaBase}/dist/assets`;

        // Verificar si el archivo es un ZIP válido
        if (uint8Array[0] !== 0x50 || uint8Array[1] !== 0x4b) {
            console.error("❌ El archivo no es un ZIP válido.");
            return new Response("El archivo no es un ZIP válido", { status: 400 });
        }

        await Deno.writeFile(rutaZip, uint8Array);

        const rutaParentFolder = `${rutaBase}/${parentFolder}`;

        try {
            await Deno.stat(rutaParentFolder);
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                await Deno.mkdir(rutaParentFolder, { recursive: true });
                console.log(`📂 Carpeta '${parentFolder}' creada en: ${rutaParentFolder}`);
            }
            else {
                console.error("❌ Error al verificar o crear la carpeta padre:", error);
                return new Response("Error al verificar o crear la carpeta padre", { status: 500 });
            }
        }

        try {
            await Deno.stat(rutaAssets);
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                await Deno.mkdir(`${rutaParentFolder}/dist/assets`, { recursive: true });
                console.log(`📂 Carpeta 'dist/assets' creada en: ${rutaParentFolder}/dist/assets`);
            } else {
                console.error("❌ Error al verificar o crear la carpeta 'dist/assets':", error);
                return new Response("Error al verificar o crear la carpeta 'dist/assets'", { status: 500 });
            }
        }

        if (parentFolder === 'assets') {
            await zip.uncompress(rutaZip, rutaAssets);
        } else {
            await zip.uncompress(rutaZip, rutaParentFolder);
        }

        await Deno.remove(rutaZip);

        return await callback({ rutaBase,fileName, stem, parentFolder });

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: (data: CallbackData) => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);
        const indexPath = new URL("./themes/dev/dist/index.html", import.meta.url).pathname;

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        let path = url.pathname === "/" ? indexPath : `themes/dev/dist${url.pathname}`;
        console.log(`📂 Intentando servir archivo: ${path}`);

        try {
            if (url.pathname.startsWith("/assets")) {
                path = `themes/dev${url.pathname}`;
            }

            const archivo = await Deno.readTextFile(path);
            return new Response(archivo, {
                headers: {
                    "Content-Type": path.endsWith(".css") ? "text/css" : "text/html"
                }
            });
        } catch {
            return new Response("404 - Página no encontrada", { status: 404 });
        }
    });
}
