/**
 * 🧩 EJERCICIO 42: Endpoints `/cart/update` y `/cart/clear` + página de carrito interactiva
 *
 * 🧠 Contexto:
 * Ya cuentas con `/cart/add`, `/cart.js` y una página de carrito (Ej. 41) que muestra `cart`.
 * Ahora vas a permitir **actualizar cantidades** y **vaciar el carrito** desde la UI.
 *
 * 🎯 Objetivos:
 * - Implementar `POST /cart/update` para cambiar cantidades (soporta actualización por lotes)
 * - Implementar `/cart/clear` para vaciar el carrito y redirigir a `/cart`
 * - Asegurar que la plantilla de carrito pueda enviar cambios y verlos reflejados
 *
 * ✅ Instrucciones:
 *
 * 1) **Prepara tu servicio de carrito (memoria por `cart_token`)**
 *
 *    Asegúrate de contar con utilidades (o créalas ahora):
 *    - `getCart(token)` → retorna el carrito (lo crea si no existe)
 *    - `setQuantity(token, productId, quantity)`:
 *        - Si `quantity > 0` → establece la cantidad de esa línea
 *        - Si `quantity <= 0` → elimina la línea
 *    - `clearCart(token)` → deja `items: []`
 *    - `recalculate(cart)` → calcula `item_count` y `total_price` (para tu `context.cart`)
 *    - `toJson(token)` → construye el JSON mínimo usado por `/cart.js`:
 *      ```json
 *      {
 *        "token": "<cart_token>",
 *        "items": [
 *          { "product_id": 1, "title": "Camisa suave A", "handle": "camisa-suave-a", "price": 2500, "quantity": 2 }
 *        ]
 *      }
 *      ```
 *
 *    ℹ️ **Alias `id` en Liquid**: para facilitar la edición en la plantilla,
 *       expón en **Liquid** cada línea con un campo `id` que sea igual a `product_id`.
 *       Ejemplo de cada ítem en **Liquid**:
 *       `{ id: product_id, product_id, title, handle, price, quantity }`
 *
 * 2) **Implementa `POST /cart/update`**
 *
 *    - Ruta: `/cart/update`
 *    - Lee `cart_token` desde cookie.
 *    - **Formato de entrada** (batch):
 *      ```json
 *      { "updates": { "<product_id>": <quantity>, ... } }
 *      ```
 *      (El `<product_id>` es string en el JSON del request; conviértelo a número si tu store lo requiere.)
 *    - Aplica `setQuantity()` para cada par (productId, quantity).
 *    - Responde `200` con el carrito actualizado como JSON (`toJson(token)`), con `Content-Type: application/json`.
 *
 * 3) **Implementa `/cart/clear` con redirección**
 *
 *    - Ruta: `/cart/clear`
 *    - Método: `POST` (puedes usar `GET` si te resulta más simple para probar).
 *    - Lógica: `clearCart(token)` y responde **302** con `Location: /cart`.
 *
 * 4) **Usa la plantilla interactiva**
 *
 *    - Copia `42_cart.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 *    - Sirve esta plantilla en la ruta `/cart`.
 *    - Esta plantilla:
 *        - Muestra inputs `number` por línea con `name="updates[{{ item.id }}]"`.
 *        - Hace `fetch('/cart/update', { method: 'POST', body: JSON.stringify({ updates }) })` en `submit`.
 *        - Llama a `/cart/clear` y redirige a `/cart` al vaciar.
 *
 * 5) **Alinear estado entre Liquid y Ajax**
 *
 *    - Asegúrate de que `context.cart` (Liquid) se derive del **mismo** carrito en memoria que usa `/cart.js`.
 *    - Tras `update` o `clear`, recarga la página para ver los nuevos totales en Liquid.
 *
 * 6) **Pruebas sugeridas**
 *
 *    - Añade artículos desde una página de producto (Ej. 39).
 *    - En `/cart`, cambia cantidades y pulsa **Actualizar carrito**:
 *        - Debe llamar a `POST /cart/update` y al recargar verás cantidades y totales actualizados.
 *        - Abre `/cart.js` para confirmar que el JSON coincide.
 *    - Pulsa **Vaciar carrito**:
 *        - Debe ejecutar `/cart/clear`, redirigir a `/cart` y mostrar el carrito vacío.
 *
 * ✅ Resultado esperado:
 * - `POST /cart/update` procesa cambios por lotes y elimina líneas con cantidad 0.
 * - `/cart/clear` vacía el carrito y redirige a `/cart`.
 * - El estado es consistente entre `/cart` (Liquid) y `/cart.js` (Ajax).
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
