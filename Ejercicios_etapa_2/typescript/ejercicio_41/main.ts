/**
 * 🧩 EJERCICIO 41: Exponer `cart` como objeto Liquid y mostrarlo en una página
 *
 * 🧠 Contexto:
 * Ya cuentas con un carrito en memoria (token por navegador) y endpoints `/cart.js` y `/cart/add` (ej. 38–39).
 * Ahora ese mismo carrito debe estar disponible *sincrónicamente* en Liquid como `cart`, para renderizar una página.
 *
 * 🎯 Objetivos:
 * - Construir un objeto `cart` a partir del almacenamiento en memoria
 * - Exponerlo en el contexto de Liquid (p. ej., `context.cart`)
 * - Renderizar una plantilla de carrito que liste líneas y totales básicos
 *
 * ✅ Instrucciones:
 *
 * 1) **Obtén el carrito por token y calcula derivados**
 *
 *    - Lee el `cart_token` de las cookies de la petición.
 *    - Carga (o crea) el carrito desde tu estructura en memoria (Map).
 *    - Calcula:
 *      - `item_count`: suma de `quantity` en todas las líneas.
 *      - `total_price`: suma de `price * quantity` en todas las líneas.
 *    - Estructura mínima del carrito que vas a exponer:
 *
 *      cart: {
 *        token: string,
 *        items: Array<{ product_id: number, title: string, handle: string, price: number, quantity: number }>,
 *        item_count: number,
 *        total_price: number
 *      }
 *
 * 2) **Expón `cart` en el contexto de render**
 *
 *    - En tu `contextPlease.ts` (o donde construyes el `context`), agrega la propiedad `cart` con la forma anterior.
 *    - Asegúrate de que el origen de datos sea el mismo que usan tus endpoints (debe coincidir con `/cart.js`).
 *
 * 3) **Crea la plantilla de carrito**
 *
 *    - Copia `41_cart.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 *    - Configura tu router para servirla en la ruta `/cart`.
 *    - La plantilla debe:
 *      - Iterar `cart.items`
 *      - Mostrar `title`, `quantity`, `price | money` y `price * quantity | money`
 *      - Mostrar `cart.item_count` y `cart.total_price | money`
 *      - Mostrar un mensaje si no hay ítems
 *
 * 4) **Prueba de punta a punta**
 *
 *    - En una página de producto, usa el botón **“Añadir al carrito”** (ejercicio 39).
 *    - Visita **`/cart`** y verifica que:
 *      - Se listan los artículos con sus cantidades.
 *      - `item_count` y `total_price` reflejan el estado actual.
 *    - Abre **`/cart.js`** y valida que el JSON coincide con lo que ves en Liquid.
 *    - Refresca la página y confirma que el contenido del carrito persiste durante la sesión.
 *
 * ✅ Resultado esperado:
 * - `cart` está disponible en Liquid con `items`, `item_count` y `total_price`.
 * - La ruta `/cart` muestra el contenido del carrito y coincide con `/cart.js`.
 * - La experiencia es consistente entre el render del servidor y los endpoints Ajax.
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
