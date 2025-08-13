/**
 * 🧩 EJERCICIO 38: Implementar endpoint `/cart.js`
 *
 * 🧠 Contexto:
 * Shopify expone una API pública en `/cart.js` que devuelve el contenido actual del carrito
 * como JSON. Este endpoint se usa en tiendas para actualizar dinámicamente precios,
 * cantidades y productos usando JavaScript o AJAX sin recargar la página.
 *
 * En este ejercicio, comenzarás implementando una versión *estática* de ese endpoint,
 * que devolverá una respuesta fija usando contenido proporcionado.
 *
 * En ejercicios posteriores, este endpoint se volverá dinámico según el contenido real del carrito.
 *
 * 🎯 Objetivos de esta primera parte:
 * - Crear una ruta `/cart.js` en el servidor
 * - Devolver una respuesta JSON estática (hardcoded) copiando contenido desde un archivo proporcionado
 *
 * ✅ Instrucciones:
 *
 * 1. **Copia el contenido del archivo de respuesta estática**
 *
 *    Abre el archivo `38_cart_response.json` que encontrarás en la carpeta `liquid_snippets/`.
 *    Copia todo su contenido.
 *
 * 2. **Agrega la ruta `/cart.js` al servidor**
 *
 *    Dentro de tu archivo `slightlyLate.ts`, agrega una ruta GET para `/cart.js`.
 *
 *    Para mantener tu código organizado, te recomendamos:
 *
 *    - Crear una función separada que se encargue de construir la respuesta de este endpoint.
 *    - Definir un arreglo con los endpoints `.js` que vas a soportar, y usarlo para decidir qué función ejecutar según la ruta exacta.
 *
 *    Luego, simplemente devuelve el objeto que copiaste como parte del cuerpo de la respuesta,
 *    junto con el encabezado `Content-Type: application/json`.
 *
 *    ⚠️ Estas recomendaciones son solo sugerencias de organización — puedes implementar la lógica de la forma que prefieras.
 *
 *    Ejemplo esperado:
 *    ```
 *    GET /cart.js → 200 OK
 *    Content-Type: application/json
 *    Body: { "token": "...", "items": [...], ... }
 *    ```
 *
 * 🧪 Puedes probarlo accediendo directamente a:
 *
 *    ```
 *    http://localhost:PORT/cart.js
 *    ```
 *
 *    El contenido devuelto debe coincidir exactamente con el JSON que copiaste del archivo.
 *
 * 3. **Haz una solicitud a `/cart.js` desde el navegador**
 *
 *    Abre tu layout principal (`layout/theme.liquid`) y agrega un `<script>` al final del `<body>`.
 *
 *    ⚠️ Ten en cuenta que escribir JavaScript para el navegador es distinto a cómo lo hemos estado haciendo con Deno.
 *
 *    Para escribir código que se ejecute cuando la página termine de cargar:
 *
 *    - Te recomendamos buscar información sobre el evento `DOMContentLoaded` en JavaScript.
 *    - Dentro del callback de ese evento, haz una solicitud `fetch()` al endpoint `/cart.js`.
 *    - Puedes usar `async/await` o una cadena de `.then()` — te recomendamos repasar estas dos formas de manejar asincronía si no las tienes frescas.
 *
 *    Dentro del callback exitoso del `fetch`, muestra el resultado con un simple `alert()` que muestre el texto crudo de la respuesta.
 *
 *    💡 No necesitas procesar el JSON aún — solo mostrar el contenido textual.
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
