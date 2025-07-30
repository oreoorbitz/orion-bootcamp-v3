/**
 * 🧩 EJERCICIO 37: Soporte para `settings_schema.json` y `settings_data.json`
 *
 * 🧠 Contexto:
 * Shopify permite definir configuraciones globales para una tienda a través de los archivos `config/settings_schema.json`
 * y `config/settings_data.json`. Estas configuraciones están disponibles como el objeto global `settings` en Liquid.
 *
 * 🗂 A partir de este ejercicio:
 * - Cada tema debe tener una carpeta `config/`
 * - Dentro de esa carpeta se definen:
 *   - `settings_schema.json`: Describe los campos disponibles
 *   - `settings_data.json`: Define los valores actuales de esos campos
 *
 * 📤 Ambos archivos deben subirse al servidor igual que `sections/`, `snippets/` o `locales/`.
 *     El servidor los guardará en:
 *
 * ```
 * themes/dev/config/settings_schema.json
 * themes/dev/config/settings_data.json
 * ```
 *
 * ⚠️ No necesitas usar `settings_schema.json` para nada aún — solo incluirlo. Sirve como referencia para construir un editor en el futuro.
 *
 * 🎯 Objetivos:
 * - Leer `settings_data.json` desde tu servidor y convertirlo a un objeto JS
 * - Exponer ese objeto como `settings` en el contexto de tu motor Liquid
 *   - Esto permitirá escribir `{{ settings.copyright.text }}` en cualquier plantilla
 * - Exponer también un objeto `shop` con información básica de la tienda
 *   - Por ahora solo tendrá la propiedad `name`
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `config/` a tu tema**
 *
 *    Dentro de ella, copia los siguientes archivos desde `liquid_snippets/`:
 *
 *    - `37_settings_schema.json` → `config/settings_schema.json`
 *    - `37_settings_data.json` → `config/settings_data.json`
 *
 *    ✅ Sube estos archivos al servidor como parte del tema. El servidor los debe guardar en:
 *
 *    ```
 *    themes/dev/config/
 *    ```
 *
 * 2. **Actualiza `contextPlease.ts`**
 *
 *    - Lee el contenido de `settings_data.json` y conviértelo a objeto JS
 *    - No es necesario interpretar la schema aún
 *    - Asegúrate de que el objeto `context` exportado tenga:
 *      - Una propiedad `settings` con el contenido del objeto `current` en `settings_data.json`
 *      - Un objeto `shop`, con al menos:
 *
 *    ```ts
 *    shop: {
 *      name: "Mi tienda"
 *    }
 *    ```
 *
 * 3. **Actualiza tu motor de plantillas**
 *
 *    - Asegúrate de que el objeto `settings` esté disponible como variable global en todas tus plantillas Liquid
 *    - Asegúrate de que el objeto `shop` también esté disponible como variable global
 *
 * 4. **Usa el layout provisto**
 *
 *    Copia el archivo `37_layout.liquid` desde `liquid_snippets/` y colócalo en tu carpeta `layout/` como `theme.liquid`.
 *
 * ✅ Resultado esperado:
 * - El `<title>` del HTML se muestra correctamente con el nombre de la tienda (`shop.name`)
 * - El pie de página muestra el texto definido en `settings.copyright.text`
 * - Ambos objetos están disponibles como variables globales
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
