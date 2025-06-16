import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { caminoExiste, crearDirectorioSiNoExiste } from "./utils/utils.ts";
import { CallbackData} from '../types/types.ts'
import { notificarRecargaPagina, notificarReloadCSS } from "./wsServer.ts";

const plantillaPath = new URL("./themes/dev/templates/content_for_index.liquid", import.meta.url).pathname;
const outputPath = new URL('./themes/dev/dist/', import.meta.url).pathname;

const hotreloadTsPath = new URL("./hotreload.ts", import.meta.url).pathname;

const fileMap: Record<string, string> = {
    [plantillaPath]: `${outputPath}/index.html`,
};

const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" },
};

export async function recargarYGenerarHTML() {
    try {
        if( !(await caminoExiste(plantillaPath))) {
            console.error("❌ Plantilla no encontrada, abortando.");
            return new Response("Plantilla no encontrada", { status: 404 });
        }

        const liquidTemplate = await Deno.readTextFile(plantillaPath);
        if(liquidTemplate?.trim === "") {
            console.error("❌ Plantilla vacía, abortando.");
            return new Response("Plantilla vacía", { status: 400 });
        }
            
        const renderedTemplate =  await liquidEngine(liquidTemplate, contexto);
        
        const domTree = await htmlParser(renderedTemplate);
        const finalHTML = await renderDOM(domTree);

        const outputFilePath = fileMap[plantillaPath];

        await crearDirectorioSiNoExiste(outputPath);

        await Deno.writeTextFile(outputFilePath, finalHTML);

        await injector(hotreloadTsPath, outputFilePath);

        return new Response("Recargando y generando HTML...", { status: 200 });
    } catch (error) {
        console.log('test0rror', error);
    }
}

export async function onThemeUpdate(data: CallbackData ) {
    const { rutaBase,fileName, stem, parentFolder } = data;

    if(!rutaBase || !fileName || !stem || !parentFolder) {
        console.error("❌ Datos incompletos para procesar el tema.");
        return new Response("Datos incompletos", { status: 400 });
    }

    await recargarYGenerarHTML();

    if(fileName.includes('.css')) {
        notificarReloadCSS();
    } else {
        notificarRecargaPagina();
    }

    return new Response(`${fileName} fue actualizado`, { status: 200 });

}

iniciarServidor(3002, onThemeUpdate);