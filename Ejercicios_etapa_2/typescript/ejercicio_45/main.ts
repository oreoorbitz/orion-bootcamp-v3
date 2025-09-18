/**
 * 🧩 EJERCICIO 45: Imágenes (colecciones, productos, variantes) + filtros `image_url`, `strip_html`, `image_tag`
 *
 * 🧠 Contexto:
 * Shopify usa CDN y filtros avanzados; aquí haremos una versión simple.
 * Ya proveemos un `seedData.ts` y `planter.ts` actualizados que incluyen imágenes:
 * - **Colecciones**: una imagen destacada por colección.
 * - **Productos**: al menos una imagen destacada (position = 1).
 * - **Variantes**: exactamente UNA imagen por variante (todas las variantes del seed la traen).
 *
 * Cada **objeto imagen** tiene:
 *   { small: string, medium: string, large: string, alt: string, width: number, height: number }
 *
 * 🎯 Objetivos:
 * - Poblar la DB con imágenes (solo re-ejecutar `planter.ts`).
 * - Exponer imágenes en el **contexto** (colección, producto, variante).
 * - Incluir la imagen de la variante en cada **line item** del carrito.
 * - Implementar los filtros de Liquid:
 *   - `image_url` (por defecto "medium"; acepta `width: 'small'|'medium'|'large'`)
 *   - `strip_html` (limpiar etiquetas para usar en `alt`)
 *   - `image_tag` (genera `<img ...>` con `width`/`height` intrínsecos)
 * - Usar las nuevas plantillas:
 *   - `sections/45_featured_collection.liquid`
 *   - `snippets/45_product_card.liquid`
 *   - `templates/45_product.liquid` (cambia imagen al cambiar variante)
 *   - `templates/45_cart.liquid` (muestra imagen por línea)
 *
 * ✅ Paso 0 (Setup)
 * - Re-ejecuta **`planter.ts`** para crear/llenar tablas de imágenes:
 *   - `collection_images`, `product_images`, `variant_images`.
 * - No necesitas modificar el seed; ya incluye imágenes para TODAS las variantes (evitamos checks vacíos).
 *
 *
 * 1) **Contexto (`contextPlease.ts`)**
 *    Asegúrate de construir estos campos (ajusta tus queries SQL si hace falta):
 *    - **Colección**:
 *      collections["<handle>"].image → { small, medium, large, alt, width, height }
 *      (une por `collectionId` en `collection_images`)
 *
 *    - **Producto**:
 *      product.image → imagen destacada (de `product_images` con `position = 1`)
 *      (opcional) product.images → array si quieres extender luego (no requerido aquí)
 *
 *    - **Variante**:
 *      v.image → { small, medium, large, alt, width, height } (de `variant_images`)
 *
 *    - **Carrito**:
 *      Cada **line item** (variante) debe incluir `image` (la de la variante):
 *      {
 *        id: <variant_id>, title, handle, price, quantity, image: { ... }
 *      }
 *      y `/cart.js` debe reflejarlo.
 *
 * 2) **Servicio de carrito**
 *    - Al crear una línea con `id` (variante), adjunta `image = variant.image`.
 *    - Mantén el título de línea como "Producto - Variante" (de Ej. 44).
 *    - `toJson(token)` debe incluir `items[*].image`.
 *
 * 3) **Filtros Liquid**
 *    A) `strip_html`:
 *       - Entrada: string.
 *       - Salida: string sin etiquetas HTML (regex simple o DOM parser).
 *
 *    B) `image_url` (con sub-parámetro):
 *       - Entrada: un **objeto imagen** `{ small, medium, large, ... }`.
 *       - Uso:
 *           `{{ image | image_url }}`                     // "medium" por defecto
 *           `{{ image | image_url: width: 'small' }}`     // 'small' | 'medium' | 'large'
 *       - Salida: **string URL** (la variante de tamaño seleccionada).
 *       - Requisito para `image_tag`:
 *         Cuando `image_url` reciba un objeto imagen, guarda en un registro local de render
 *         (p. ej. `ctx.__last_image_meta`) los metadatos del objeto (`width`, `height`, `alt`),
 *         para que `image_tag` pueda incluirlos en el `<img>`.
 *
 *    C) `image_tag`:
 *       - Entrada: **URL string** (la salida de `image_url`).
 *       - Acepta atributos nombrados (ej. `class`, `id`, `alt`).
 *       - Debe generar `<img>` con:
 *         - `src` = URL entrante,
 *         - `alt` = `args.alt` si se pasó; si no, usa `ctx.__last_image_meta.alt` (aplícale `strip_html` si hace falta),
 *         - `width` y `height` = valores **intrínsecos** de `ctx.__last_image_meta`,
 *         - Recomendado: `loading="lazy" decoding="async"`.
 *       - Ejemplos:
 *         `{{ product.image | image_url | image_tag: class: 'w-full' }}`
 *         `{{ v.image | image_url: width: 'small' | image_tag: class: 'w-16 h-16 rounded' }}`
 *
 * 4) **Plantillas**
 *    - **Featured collection**: usa `sections/45_featured_collection.liquid`:
 *      - Banner con `collections["soft-shirts"].image`.
 *      - Grid renderizando `snippets/45_product_card.liquid` (cada card muestra `product.image`).
 *
 *    - **Producto**: usa `templates/45_product.liquid`:
 *      - Muestra imagen principal (vinculada a la variante seleccionada).
 *      - Cambia la imagen cuando cambian las opciones → encuentra la variante y actualiza `<img>`.
 *
 *    - **Carrito**: usa `templates/45_cart.liquid`:
 *      - Nueva columna “Imagen”: muestra `item.image` (tamaño `small`).
 *
 * 5) **Pruebas sugeridas**
 *    A) Colección:
 *       - Ver “soft-shirts” con banner (imagen large) y cards con imagen medium.
 *    B) Producto:
 *       - Cambiar opciones altera el `<img>` (URL large, `alt`, `width`/`height` correctos).
 *    C) Carrito:
 *       - Añadir dos variantes distintas → cada línea muestra su imagen (small).
 *    D) Filtros:
 *       - `image_url` sin parámetro → medium; con `width: 'large'` → large.
 *       - `image_tag` con supporte para todo los parametros en el snippet proporcionado.
 *       - `strip_html` elimina etiquetas de un `alt` con HTML.
 *
 * ✅ Resultado esperado
 * - El contexto expone imágenes en colecciones, productos y variantes.
 * - El carrito incluye `item.image` y lo muestra en `45_cart.liquid`.
 * - Los filtros `image_url`, `strip_html` y `image_tag` funcionan según lo descrito.
 * - `45_featured_collection`, `45_product` y `45_cart` renderizan imágenes sin CLS notable (tienen `width`/`height`).
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
        "assets",
        "snippets",
        "sections",
        "locales",
        "config"
    ].map(path)

    // 🔍 Validar que las rutas existan antes de observar cambios
    for (const ruta of rutas) {
        try {
            await Deno.stat(ruta);
        } catch {
            console.error(`❌ Error: La ruta ${ruta} no existe.`);
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
    console.log(`📝 Procesando cambio en: ${pathModificado}`);

    if (bloqueado) {
        console.log("⚠️ Procesamiento en curso, esperando...");
        return;
    }

    bloqueado = true;
    await empaquetarYEnviarTema(pathModificado);
    setTimeout(() => bloqueado = false, 1000); // Esperamos 1 segundo antes de permitir otra ejecución
}

async function empaquetarYEnviarTema(pathModificado: string) {
    console.log("📦 Empaquetando tema...");

    const partesRuta = pathModificado.split("/");
    const nombreArchivoModificado = partesRuta.pop() || "";
    const nombreCarpeta = partesRuta.pop() || "";
    const nombreLimpio = nombreArchivoModificado.split(".")[0] || "";
    const tipoExtension = nombreArchivoModificado.split(".").pop() || "";

    // 🎯 Detectar si es un template específico
    const esTemplate = nombreCarpeta === "templates" && tipoExtension === "liquid";

    if (esTemplate) {
        console.log(`🎯 Detectado cambio en template: ${nombreLimpio}`);
    }

    // Ruta para el archivo zip
    const rutaZipFolder = path(".");
    const archivoZip = `${rutaZipFolder}/${nombreLimpio}.zip`;

    try {
        await Deno.stat(rutaZipFolder);
    } catch {
        console.log("📂 La carpeta no existe, creándola...");
        await Deno.mkdir(rutaZipFolder, { recursive: true });
    }

    // 📦 Comprimir el archivo modificado
    await zip.compress(pathModificado, archivoZip);

    console.log("🔍 Verificando si el archivo ZIP fue creado...");
    try {
        await Deno.stat(archivoZip);
        console.log("✅ ZIP encontrado correctamente!");
    } catch {
        console.log("⚠️ No se encontró el ZIP, algo falló en la compresión.");
        return;
    }

    console.log("✅ Tema comprimido correctamente!");
    console.log("🚀 Enviando ZIP al servidor...");

    // Crear FormData y adjuntar ZIP
    const formData = new FormData();
    const zipData = await Deno.readFile(archivoZip);
    formData.append("archivo", new Blob([zipData]), nombreLimpio);
    formData.append("tipoExtension", tipoExtension);
    formData.append("carpeta", nombreCarpeta);

    // 🎯 Si es un template, enviar información adicional
    if (esTemplate) {
        formData.append("templateEspecifico", "true");
        // ✨ NUEVO: Enviar el nombre del template específico
        formData.append("templateNombre", nombreLimpio);
    }

    try {
        // Enviar solicitud POST
        const response = await fetch("http://localhost:3000/theme-update", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const responseText = await response.text();
            console.log("📝 Respuesta del servidor:", responseText);
        } else {
            console.error("❌ Error del servidor:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("❌ Error al enviar al servidor:", error);
    }

    // 🗑️ Borrar el archivo ZIP después de enviarlo
    try {
        await Deno.remove(archivoZip);
        console.log("🗑️ ZIP eliminado.");
    } catch (error) {
        console.error("⚠️ Error al eliminar ZIP:", error);
    }
}

// 🚀 Iniciar observación
observarCambios();
