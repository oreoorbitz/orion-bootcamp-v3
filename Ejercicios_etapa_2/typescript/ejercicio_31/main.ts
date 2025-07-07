/**
 * 🧩 MÓDULO 31: Rutas dinámicas `/products/:handle` y `/collections/:handle`
 *
 * 🧠 Concepto clave:
 * En este módulo agregarás soporte para rutas dinámicas basadas en el `handle` de productos y colecciones.
 * Esto refleja cómo Shopify renderiza páginas como `/products/camisa-suave-a` o `/collections/sale`.
 *
 * 🎯 Objetivo:
 * - Agregar soporte para rutas como `/products/:handle` y `/collections/:handle`
 * - Crear las plantillas `product.liquid` y `collection.liquid`
 * - Resolver qué plantilla usar y qué objeto pasar como contexto
 * - Renderizar ese objeto en la plantilla correspondiente
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *
 *    Copia tu tema a `typescript/ejercicio_31/` desde el ejercicio anterior (`ejercicio_30`).
 *    Asegúrate de incluir:
 *    - `layout/`
 *    - `templates/`
 *    - `assets/`
 *    - `main.ts`
 *
 * 2. **Actualiza `router.ts` para soportar handles**
 *
 *    En `typescript/server/router.ts`, modifica la función `resolve(path: string)` para que detecte rutas dinámicas.
 *
 *    - Para rutas que coincidan con `/products/:handle`, debe devolver información que indique que se usará el template `product` y el objeto correspondiente del contexto.
 *    - Para rutas que coincidan con `/collections/:handle`, debe devolver el template `collection` junto con su objeto.
 *    - Para `/`, debe seguir devolviendo lo necesario para renderizar el template de inicio.
 *    - Si no hay coincidencia, debe devolver `undefined`.
 *
 *    ✅ Utiliza los datos que provienen del objeto `context`, generado por `contextPlease.ts`. Este archivo ya se encarga de consultar la base de datos SQLite y devolver un objeto con las propiedades `products`, `collections`, y `productCollections`, entre otras.
 *
 *    El objeto que devuelve `resolve(path)` debe tener al menos estas propiedades:
 *    ```ts
 *    {
 *      template: "product" | "collection" | "content_for_index",
 *      object?: any // objeto relevante que se pasa al template
 *    }
 *    ```
 *
 * 3. **Agrega las nuevas plantillas `product.liquid` y `collection.liquid`**
 *
 *    En la carpeta `templates/`, crea:
 *    ```
 *    templates/product.liquid         ← ✅ nuevo archivo
 *    templates/collection.liquid      ← ✅ nuevo archivo
 *    ```
 *    Copia el contenido desde los archivos:
 *    - `typescript/liquid_snippets/31_product.liquid`
 *    - `typescript/liquid_snippets/31_collection.liquid`
 *
 * 4. **Actualiza `content_for_index.liquid`**
 *
 *    En lugar de mostrar todos los detalles de productos y colecciones, ahora enlaza a sus páginas individuales.
 *    Reemplaza el contenido actual con el de:
 *    - `typescript/liquid_snippets/31_content_for_index.liquid`
 *
 * 5. **Actualiza tu lógica de renderizado**
 *
 *    Cuando llames a `resolve(path)`:
 *    - Determina el nombre del template adecuado desde la respuesta del router.
 *    - Combina el contexto global (desde `contextPlease.ts`) con el objeto específico (`product` o `collection`) si está presente.
 *    - Si `resolve()` devuelve `undefined`, renderiza `404.liquid` usando `layout/theme.liquid` e insértalo como `content_for_layout`.
 *
 * 6. **Organiza tu salida en carpetas por tipo**
 *
 *    Hasta ahora, los archivos `.html` se han generado directamente en `dist/`, pero a partir de este módulo:
 *
 *    - Las páginas de producto deben escribirse dentro de `dist/products/`.
 *    - Las páginas de colección dentro de `dist/collections/`.
 *
 *    Actualiza la lógica de generación de archivos HTML para que:
 *    - Detecte cuándo se está renderizando una plantilla como `product.liquid` o `collection.liquid`
 *    - Genere el archivo `.html` en la subcarpeta correspondiente dentro de `dist/`
 * 
 * 7. **Verifica que el servidor sirva correctamente las rutas**
 *
 *    Asegúrate de que el servidor pueda servir páginas como:
 *    - `/products/camisa-suave-a` → `dist/products/camisa-suave-a.html`
 *    - `/collections/sale` → `dist/collections/sale.html`
 *    - Páginas no encontradas deben devolver `404.html` con status `404`
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_31/
 * │   │   ├── layout/
 * │   │   ├── templates/
 * │   │   │   ├── content_for_index.liquid
 * │   │   │   ├── product.liquid         ← ✅ nuevo archivo
 * │   │   │   ├── collection.liquid      ← ✅ nuevo archivo
 * │   │   │   └── 404.liquid
 * │   │   ├── assets/
 * │   │   ├── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── router.ts
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── dist/
 * │               │   ├── content_for_index.html
 * │               │   ├── products/camisa-suave-a.html         ← ✅ generado dinámicamente
 * │               │   ├── collections/sale.html                 ← ✅ generado dinámicamente
 * │               │   ├── 404.html
 * │               │   └── assets/
 * │               │       └── theme.css
 *
 * 🎯 Resultado esperado:
 * - Tu router ahora resuelve handles dinámicos para productos y colecciones
 * - Se renderizan correctamente los archivos `product.liquid` y `collection.liquid`
 * - El contexto que llega a cada template contiene el objeto correspondiente (`product` o `collection`)
 * - Los archivos `.html` generados respetan la estructura de carpetas
 * - Tu servidor sirve correctamente las páginas o `404.html` cuando no encuentra coincidencias
 */

import { zip } from "jsr:@deno-library/compress";
import { debounce } from "jsr:@std/async/debounce";

function path(stl: string) {
  return new URL(stl, import.meta.url).pathname

}

export async function observarCambios() {
    const rutas = [
        "templates",
        "layout",
        "assets"
    ].map(path)

    // 🔍 Validar que las rutas existan antes de observar cambios
    for (const path of rutas) {
        try {
            await Deno.stat(path);
        } catch {
            console.error(`❌ Error: La ruta ${path} no existe.`);
            Deno.exit(1); // Salimos del programa si alguna ruta no existe
        }
    }

    console.log("✅ Todas las rutas existen, iniciando observación...");

    const watcher = Deno.watchFs(rutas);
    const procesarCambio = debounce((event: Deno.FsEvent) => {
        console.log(`🔄 Archivo(s) modificado(s): ${event.paths.join(", ")}`);
        const pathModificado = event.paths[0]
        empaquetarYEnviarTemaConControl(pathModificado);
    }, 500); // Esperamos 500ms para evitar activaciones múltiples

    for await (const event of watcher) {
        procesarCambio(event);
    }
}

let bloqueado = false;

async function empaquetarYEnviarTemaConControl(pathModificado: string) {
  console.log(pathModificado)
  if (bloqueado) {
        console.log("⚠️ Procesamiento en curso, esperando...");
        return;
    }

    bloqueado = true;
    await empaquetarYEnviarTema(pathModificado); // Llamamos la función original
    setTimeout(() => bloqueado = false, 1000); // Esperamos 1 segundo antes de permitir otra ejecución
}

async function empaquetarYEnviarTema(pathModificado: string) {
    console.log("📦 Empaquetando tema...");
    const nombreArchivoModificado = pathModificado.split("/").pop()
    const nombreCarpeta = pathModificado.split("/").slice(0,-1).pop() ?? ""
    const nombreLimpio = nombreArchivoModificado?.split(".")[0] ?? ""
    const tipoExtension = nombreArchivoModificado?.split(".")[1] ?? ""
    // Ruta para el archivo zip
    const rutaZipFolder = path(".")
    const archivoZip = `${rutaZipFolder}/${nombreLimpio}.zip`;

    try {
        await Deno.stat(rutaZipFolder);
    } catch {
        console.log("📂 La carpeta no existe, creándola...");
        await Deno.mkdir(rutaZipFolder, { recursive: true });
    }

    // 📦 Comprimir la carpeta
    await zip.compress(pathModificado, archivoZip);
    console.log("🔍 Verificando si el archivo ZIP fue creado...");
    try {
        await Deno.stat(archivoZip);
        console.log("✅ ZIP encontrado correctamente!");
    } catch {
        console.log("⚠️ No se encontró el ZIP, algo falló en la compresión.");
    }

    console.log("✅ Tema comprimido correctamente!");
    console.log("🚀 Enviando ZIP al servidor...");

    // Crear FormData y adjuntar ZIP
    const formData = new FormData();
    const zipData = await Deno.readFile(archivoZip);
    formData.append("archivo", new Blob([zipData]), nombreLimpio);
    formData.append("tipoExtension", tipoExtension)
    formData.append("carpeta",nombreCarpeta)
    // Enviar solicitud POST
    const response = await fetch("http://localhost:3000/theme-update", {
        method: "POST",
        body: formData
    });

    console.log("📝 Respuesta del servidor:", await response.text());

    // 🗑️ Borrar el archivo ZIP después de enviarlo
    await Deno.remove(archivoZip);
    console.log("🗑️ ZIP eliminado.");
}
observarCambios();
