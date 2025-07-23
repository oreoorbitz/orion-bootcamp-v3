/**
 * 🧩 EJERCICIO 36: Soporte para filtro `translate` (`| translate` o `| t`)
 *
 * 🧠 Contexto:
 * Shopify permite traducir strings de forma dinámica usando archivos `.json` de traducción por idioma.
 * Cada tienda tiene un idioma activo, y se accede a los textos usando un filtro como:
 *
 * ```liquid
 * {{ 'actions.view' | translate }}
 * {{ 'actions.view' | t }}
 * ```
 *
 * 🗂 A partir de este ejercicio:
 * - Cada tema debe tener una carpeta `locales/`
 * - Los archivos `.json` dentro de esa carpeta deben subirse al servidor, igual que haces con `sections/` o `snippets/`
 * - El archivo debe guardarse en: `themes/dev/locales/en.json`, `themes/dev/locales/es.json`, etc.
 *
 * 📦 Además, tu `contextPlease.ts` debe incluir un objeto `Mockify` dentro del `context`, con una propiedad `locale`.
 * - Por ejemplo: `{ Mockify: { locale: "en" } }`
 * - A futuro esta estructura crecerá, como en Shopify.
 *
 * 🎯 Objetivos:
 * - Crear un filtro llamado `translate`, con alias `t`
 * - Leer el archivo de traducción correspondiente al valor de `Shopify.locale`
 * - Usar el string de entrada como un path de acceso (`actions.view` busca en `{ actions: { view: ... } }`)
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `locales/` en tu tema**
 *
 *    Por ejemplo:
 *    ```
 *    /ejercicio_36/
 *    ├── locales/
 *    │   ├── en.json
 *    │   └── es.json
 *    ```
 *
 *    Asegúrate de que cuando subas los archivos, el servidor los guarde en:
 *    ```
 *    themes/dev/locales/
 *    ```
 *
 *    El servidor debe poder identificar que estos archivos corresponden a traducciones.
 *
 * 2. **Agrega `Mockify.locale` y la sección al contexto**
 *
 *    Abre `contextPlease.ts` y actualiza tu `context` para que incluya lo siguiente:
 *
 *    ```ts
 *    export const context = {
 *      products: productsDrop,
 *      collections: collectionsDrop,
 *      Mockify: {
 *        locale: "en"
 *      },
 *      sections: {
 *        featured_collection: {
 *          schema_data: {
 *            title: "Productos destacados"
 *          }
 *        }
 *      }
 *    };
 *    ```
 *
 *    👉 Puedes copiar directamente el objeto `sections` desde el archivo `36_section_data_featured_collection.js`.
 *
 * 3. **Agrega el filtro `translate` en tu motor**
 *
 *    - Tu motor debe registrar un filtro llamado `translate`, con un alias `t`.
 *    - El filtro debe:
 *      1. Leer el valor de `Shopify.locale` desde el contexto
 *      2. Buscar y cargar el archivo correspondiente (`locales/en.json`, por ejemplo)
 *      3. Interpretar el string de entrada como una ruta (`actions.view`)
 *      4. Devolver el valor traducido
 *    - Si el archivo no existe o el path no está definido, puedes devolver la misma clave de entrada
 *
 * 4. **Agrega estilos base para el contenido**
 *
 *    Copia el archivo `36_theme.css` y asegúrate de que esté disponible en tu tema.
 *    Puedes colocarlo en una carpeta `assets/` y enlazarlo desde tu layout global.
 *
 * 🧪 Prueba tu implementación con los siguientes archivos:
 *
 * - `36_content_for_index.liquid` en `templates/`
 * - `36_featured_collection.liquid` en `sections/`
 * - `36_product_card.liquid` en `snippets/`
 * - `36_section_data_featured_collection.js` para el contexto
 * - `36_en.json` y `36_es.json` en `locales/`
 * - `36_theme.css` en `assets/`
 *
 * ✅ Resultado esperado:
 * - El botón al final muestra el texto traducido según el valor de `Shopify.locale`
 * - Si cambias `locale` a `'es'`, ves el texto en español sin cambiar ninguna otra línea de código
 * - El resto del contenido (secciones, snippets, loops, Drops) sigue funcionando correctamente
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
        "locales"
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
