/**
 * 🧩 EJERCICIO 33: Soporte para `{% include %}` al estilo Shopify
 *
 * 🧠 Contexto:
 * Shopify permite usar `{% include %}` en sus plantillas Liquid para reutilizar fragmentos de código.
 * Un `include` toma el nombre de un archivo `.liquid` que vive en la carpeta `snippets/`, lo lee, lo interpreta
 * como parte del archivo actual y lo renderiza usando el **mismo contexto global** que el archivo original.
 *
 * Es decir, no tiene un scope local: puede acceder a todas las variables del archivo donde fue invocado.
 *
 * 📁 A partir de este módulo, todos tus temas deberán tener una carpeta `snippets/` junto a `templates/` y `sections/`.
 *
 * 🎯 Objetivos:
 * - Crear soporte para la expresión `{% include "nombre-del-snippet" %}`
 * - Asegurar que se lea desde un archivo real dentro de la carpeta `snippets/`
 * - Procesar su contenido como parte del archivo original, usando el **contexto global**
 * - Asegurar que los archivos de snippet se guarden correctamente en el servidor
 *
 * ✅ Instrucciones:
 *
 * 1. **Crea una carpeta `snippets/` dentro de tu tema**
 *
 *    A partir de este ejercicio, todos tus temas deben incluir una carpeta llamada `snippets/`.
 *    Ahí es donde vas a colocar todos los fragmentos reutilizables en formato `.liquid`.
 *
 *    Por ejemplo:
 *    ```
 *    /ejercicio_33/
 *    ├── templates/
 *    ├── snippets/
 *    │   └── mensaje.liquid
 *    ```
 *
 *    Puedes usar `liquid_snippets/33_mensaje.liquid` como ejemplo para tu primer snippet.
 *
 * 2. **Asegúrate de que el servidor reciba y guarde los archivos de snippet correctamente**
 *
 *    Ya implementaste lógica para enviar archivos `.liquid` al servidor.
 *    Ahora, asegúrate de que si un archivo recibido corresponde a un snippet, el servidor lo guarde en la carpeta:
 *
 *    ```
 *    themes/dev/snippets/
 *    ```
 *
 *    No es necesario que el cliente tenga una estructura fija en el zip.
 *    El servidor debe poder identificar que un archivo es un snippet (por su ruta o contenido) y ubicarlo correctamente.
 *
 * 3. **Agrega soporte para `{% include %}` en tu motor de plantillas**
 *
 *    - Tu motor debe reconocer y procesar expresiones como: `{% include "mensaje" %}`
 *    - Debes:
 *      1. Buscar el archivo `mensaje.liquid` dentro del folder `snippets/`
 *      2. Leer su contenido como texto
 *      3. Procesar ese contenido con la misma función que usas para cualquier plantilla
 *      4. Usar el **mismo contexto global** que tiene la plantilla original donde apareció el `include`
 *    - Si el archivo no existe, debes renderizar el texto:
 *
 *      ```
 *      Liquid error: mensaje not found
 *      ```
 *
 *    🧠 Consejo: Usa `path.join(snippetsDir, nombre + ".liquid")` para encontrar el archivo.
 *
 * 4. **Prueba tu implementación usando la plantilla `33_content_for_index.liquid`**
 *
 *    Este archivo usa `include` para insertar un snippet:
 *
 *    ```liquid
 *    <h1>Ejemplo de include</h1>
 *    {% include "mensaje" %}
 *    ```
 *
 *    Asegúrate de copiar:
 *    - `33_content_for_index.liquid` dentro de tu carpeta `templates/`
 *    - `33_mensaje.liquid` dentro de tu carpeta `snippets/`
 *
 * 5. **Vuelve a correr `planter.ts` si necesitas regenerar los datos**
 *
 *    Este ejercicio no modifica la base de datos, pero si necesitas resetear tu entorno puedes ejecutar:
 *
 *    ```bash
 *    deno run --allow-read --allow-write --allow-net planter.ts
 *    ```
 *
 * ✅ Resultado esperado:
 * - `{% include "mensaje" %}` inserta correctamente el contenido del snippet
 * - El snippet se procesa como parte del archivo original, usando el mismo contexto
 * - Si el snippet no existe, se renderiza el mensaje `"Liquid error: mensaje not found"`
 * - El servidor guarda correctamente los archivos de snippet en la carpeta `themes/dev/snippets/`
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
