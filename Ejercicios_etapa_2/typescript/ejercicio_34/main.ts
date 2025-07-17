/**
 * 🧩 EJERCICIO 34: Soporte para `{% render %}` con scope aislado
 *
 * 🧠 Contexto:
 * Shopify ofrece dos formas de insertar snippets: `{% include %}` y `{% render %}`.
 * Ya implementaste `{% include %}`, que reusa el **mismo contexto global** del archivo actual.
 *
 * Ahora vas a implementar `{% render %}`, que permite pasar un **scope local** a un snippet.
 *
 * La diferencia principal es que en `{% render %}`:
 * - Solo se puede acceder a:
 *   - Las variables pasadas explícitamente (por clave)
 *   - Los *drops* y contexto global (como `collections`, `all_products`, etc.)
 * - **NO** se accede a variables locales definidas con `assign` en el archivo que invoca el `render`
 *
 * 🧪 Ejemplo:
 * ```liquid
 * {% assign saludo = "hola" %}
 * {% render 'mensaje', texto: "bienvenidos" %}
 * ```
 * Si el snippet `mensaje.liquid` contiene `{{ saludo }}`, **no** verá esa variable.
 * Pero sí verá `{{ texto }}` (porque fue pasada) y `{{ collections }}` (porque es global).
 *
 * 🎯 Objetivos:
 * - Implementar soporte para `{% render 'nombre', clave: valor %}`
 * - Buscar el snippet en la carpeta `snippets/`
 * - Evaluar su contenido usando:
 *   - Un scope local que **solo incluye las variables pasadas**
 *   - Además del contexto global (drops como `collections`)
 *
 * ✅ Instrucciones:
 *
 * 1. **Asegúrate de tener la carpeta `snippets/`**
 *
 *    Igual que en el ejercicio anterior, tu tema debe incluir esta estructura:
 *
 *    ```
 *    /ejercicio_34/
 *    ├── templates/
 *    ├── snippets/
 *    │   └── mensaje.liquid
 *    ```
 *
 *    Puedes usar el archivo `liquid_snippets/34_mensaje.liquid` como ejemplo.
 *
 * 2. **Agrega soporte para `{% render %}` en tu motor de plantillas**
 *
 *    - Reconoce expresiones como: `{% render 'mensaje', texto: "algo" %}`
 *    - Debes:
 *      1. Buscar `mensaje.liquid` en la carpeta `snippets/`
 *      2. Crear un nuevo scope que:
 *         - Incluya solo las variables pasadas (`texto`, en el ejemplo)
 *         - Tenga acceso a los drops del contexto global (como `collections`)
 *      3. Evaluar el contenido del snippet con ese nuevo scope
 *    - Si el archivo no existe, devuelve el texto:
 *
 *      ```
 *      Liquid error: mensaje not found
 *      ```
 *
 *    🧠 Consejo: Puedes clonar el contexto global y añadirle únicamente las variables pasadas.
 *
 * 3. **Prueba tu implementación con el siguiente archivo**
 *
 *    Copia:
 *    - `34_content_for_index.liquid` dentro de tu carpeta `templates/`
 *    - `34_mensaje.liquid` dentro de tu carpeta `snippets/`
 *
 *    Este ejemplo incluye:
 *    - Un `assign` de nivel superior (no debe verse en el render)
 *    - Un `include` que sí puede verlo
 *    - Un `render` que solo debe ver la variable pasada
 *
 * 4. **Resultado esperado**
 * - El contenido del render aparece correctamente
 * - La variable pasada explícitamente aparece
 * - Las variables globales como `collections` también están disponibles
 * - Variables locales no se filtran hacia el snippet
 * - Si el snippet no existe, aparece el mensaje `Liquid error: nombre not found`
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
        "snippets"
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
