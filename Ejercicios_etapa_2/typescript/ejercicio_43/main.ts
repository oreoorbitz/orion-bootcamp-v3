/**
 * 🧩 EJERCICIO 43: Line item properties (por producto) + Cart attributes (globales)
 *
 * 🧠 Contexto:
 * Además de cantidades, tu carrito debe guardar datos extra:
 * - **Line item properties** (por línea): p. ej., Color, Talla, Grabado.
 * - **Cart attributes** (globales del carrito): p. ej., gift_note, rush_delivery.
 *
 * En este ejercicio:
 * - La **página de producto** (43_product.liquid) permite enviar `properties` al añadir al carrito.
 * - La **página de carrito** (43_cart.liquid) **muestra** las `properties` de cada línea (solo lectura)
 *   y permite **editar** los `attributes` del carrito (gift_note, rush_delivery).
 *
 * 🎯 Objetivos:
 * - Extender el modelo de carrito para soportar:
 *   - `item.properties: { [k: string]: string }`
 *   - `cart.attributes: { [k: string]: string }`
 * - Asegurar que `/cart.add`, `/cart/update`, `/cart.js` y `context.cart` trabajen con estos datos.
 * - Actualizar plantillas para:
 *   - En producto: enviar `properties` junto con `id` y `quantity`.
 *   - En carrito: renderizar `properties` por línea (read-only) y editar `attributes` globales.
 *
 * ✅ Instrucciones:
 *
 * 1) **Servicio de carrito**
 *
 *    Estructura requerida:
 *    - Item:
 *      {
 *        product_id: number,
 *        title: string,
 *        handle: string,
 *        price: number,
 *        quantity: number,
 *        properties?: { [k: string]: string }
 *      }
 *      → En Liquid, cada ítem expone `id` como alias de `product_id`.
 *
 *    - Carrito:
 *      {
 *        token: string,
 *        items: Item[],
 *        attributes?: { [k: string]: string },
 *        item_count: number,
 *        total_price: number
 *      }
 *
 *    Utilidades mínimas:
 *    - getCart(token)
 * - setQuantity(token, productId, quantity)        // conserva properties existentes
 * - setLineItemProperties(token, productId, obj)   // fusiona/establece propiedades por línea
 * - setCartAttributes(token, obj)                  // fusiona/establece atributos globales
 * - recalculate(cart)
 * - toJson(token) → incluir `items[*].properties` y `attributes` en la salida
 *
 * 2) **Endpoint `/cart/add` (POST)**
 *
 *    - Acepta: { id: number, quantity: number, properties?: { [k: string]: string } }
 *    - Lógica:
 *      - Añade o incrementa la línea `product_id = id`.
 *      - Si vienen `properties`, adjúntalas/actualízalas en esa línea.
 *      - Recalcula y responde 200 (puede ser JSON o redirección según tu flujo).
 *
 * 3) **Endpoint `/cart/update` (POST)**
 *
 *    - Acepta:
 *      {
 *        updates?: { "<product_id>": number, ... },
 *        attributes?: { [k: string]: string }
 *      }
 *
 *    - Lógica:
 *      - Aplica `setQuantity` por cada par en `updates`.
 *      - Si `attributes` existe, llama a `setCartAttributes`.
 *      - Responde 200 con JSON del carrito (`toJson(token)`).
 *
 * 4) **Endpoint `/cart.js`**
 *
 *    - Debe exponer:
 *      {
 *        token: "...",
 *        items: [
 *          { product_id, title, handle, price, quantity, properties?: {...} }
 *        ],
 *        attributes?: { ... }
 *      }
 *
 * 5) **Plantillas**
 *
 *    - **Producto**: usa `templates/43_product.liquid`
 *      - Contiene un formulario con `quantity` y campos opcionales de `properties`
 *        (Color, Talla, Grabado).
 *      - Envía `POST /cart/add` con `{ id, quantity, properties }` (no envía `attributes`).
 *
 *    - **Carrito**: usa `templates/43_cart.liquid`
 *      - Muestra `item.properties` (si existen) debajo del título del producto (read-only).
 *      - Permite editar atributos globales:
 *        - `attributes[gift_note]` → `<textarea>`
 *        - `rush_delivery` → checkbox (se envía como string `'true'| 'false'`)
 *      - Envío: `POST /cart/update` con `{ updates, attributes }`.
 *      - Mantiene botón **Vaciar carrito** → `POST /cart/clear` + redirección a `/cart`.
 *
 * 6) **Pruebas sugeridas**
 *
 *    A) **Añadir con properties desde producto**
 *       - En `/products/:handle`, elige Color/Talla/Grabado y añade `quantity = 1`.
 *       - Abre `/cart.js`: verifica que la línea tenga `properties`.
 *       - Abre `/cart`: verifica que las `properties` aparecen bajo el producto.
 *
 *    B) **Editar attributes del carrito en /cart**
 *       - Escribe una nota en `gift_note` y marca/desmarca `rush_delivery`.
 *       - Pulsa **Actualizar carrito** → debe llamar a `/cart/update`.
 *       - Al recargar, `cart.attributes.gift_note` y `cart.attributes.rush_delivery`
 *         deben persistir y renderizarse.
 *
 *    C) **Actualizar cantidades + consistencia**
 *       - Cambia `updates[<id>]` a 0 o a otro número.
 *       - Verifica totales, `item_count` y que las `properties` se conserven en líneas
 *         que solo cambian cantidad (si la implementación mantiene la referencia).
 *
 * ✅ Resultado esperado:
 * - `/cart.add` guarda `properties` por línea al añadir el producto.
 * - `/cart.update` acepta `updates` y `attributes` (gift_note/rush_delivery) en el mismo body.
 * - `/cart.js` y `context.cart` incluyen `items[*].properties` y `attributes`.
 * - `43_product.liquid` y `43_cart.liquid` funcionan de forma coherente:
 *   - **Producto** define `properties`.
 *   - **Carrito** muestra `properties` (read-only) y edita `attributes` globales.
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
