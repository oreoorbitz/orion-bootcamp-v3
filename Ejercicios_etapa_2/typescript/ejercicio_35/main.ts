/**
 * 🧩 EJERCICIO 35: Soporte para secciones con `{% section %}` y esquema (`{% schema %}`)
 *
 * 🧠 Contexto:
 * Shopify permite estructurar páginas usando *secciones*. Una sección es un archivo `.liquid` en la carpeta `sections/`
 * que puede incluir contenido dinámico y configuración editable a través de un bloque `{% schema %}`.
 *
 * Para mantenerlo simple por ahora:
 * - No vamos a usar un archivo externo de configuración.
 * - En su lugar, vas a copiar un objeto JS con los datos de configuración de la sección y pasarlo manualmente al motor.
 *
 * A futuro, ese objeto vendrá de un archivo `.json` generado por el usuario (como en Shopify).
 *
 * 📁 Las secciones viven en su propia carpeta:
 *
 * ```
 * /ejercicio_35/
 * ├── templates/
 * ├── snippets/
 * ├── sections/
 * │   └── header_menu.liquid
 * ```
 *
 * 🎯 Objetivos:
 * - Implementar soporte para `{% section 'header_menu' %}`
 * - Leer el archivo desde `sections/header_menu.liquid`
 * - Procesar su contenido usando su propio contexto (como `render`)
 * - Soportar `{% schema %}` para extraer configuración de la sección
 * - Inyectar los valores en `section.settings`, que estará disponible en la plantilla
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `sections/` en tu tema**
 *
 *    Igual que con `snippets/`, tu tema ahora debe tener una carpeta llamada `sections/`.
 *    Asegúrate de que cuando subas tus archivos al servidor, cualquier archivo de sección
 *    sea guardado correctamente en:
 *
 *    ```
 *    themes/dev/sections/
 *    ```
 *
 * 2. **Agrega soporte para `{% section 'nombre' %}` en tu motor de plantillas**
 *
 *    - Debes reconocer expresiones como: `{% section 'header_menu' %}`
 *    - Leer el archivo `header_menu.liquid` de la carpeta `sections/`
 *    - Procesar su contenido con una estrategia similar a `render`, es decir:
 *      - Scope aislado (no tiene acceso a variables locales del template padre)
 *      - Debe tener acceso a los Drops globales (`collections`, `all_products`, etc.)
 *    - Si el archivo no existe, renderiza:
 *
 *      ```
 *      Liquid error: section 'header_menu' not found
 *      ```
 *
 * 3. **Soporte para `{% schema %}`**
 *
 *    Dentro del archivo de sección, encontrarás un bloque `{% schema %}` al final.
 *    Este bloque contiene un JSON válido que describe los inputs configurables de la sección.
 *
 *    🧠 Importante: El bloque `{% schema %}` define únicamente la **estructura** de configuración — **no contiene los valores reales**.
 *
 *    En este ejercicio, los valores reales los vas a definir manualmente en `contextPlease.ts`.
 *    Para eso:
 *
 *    - Copia el objeto de configuración desde `35_section_data_header_menu.js`
 *    - Inclúyelo dentro del objeto `context` que ya estás exportando
 *    - Usa una nueva propiedad `sections`, donde cada clave es el nombre de la sección (`"header_menu"`)
 *    - El valor asociado debe tener una clave `schema_data` que contenga el objeto
 *
 *    Ejemplo de cómo debe verse el contexto exportado desde `contextPlease.ts`:
 *
 *    ```ts
 *    export const context = {
 *      collections: collectionsDrop,
 *      all_products: allProductsDrop,
 *      sections: {
 *        header_menu: {
 *          schema_data: {
 *            heading: "Menú principal",
 *            link_1_label: "Camisas suaves",
 *            link_1_url: "/collections/soft-shirts",
 *            link_2_label: "Camisa suave A",
 *            link_2_url: "/products/camisa-suave-a"
 *          }
 *        }
 *      }
 *    };
 *    ```
 *
 *    Tu motor debe:
 *    - Leer el bloque `{% schema %}` del archivo de sección
 *    - Buscar los valores para cada `id` en `context.sections[nombre].schema_data`
 *    - Generar un objeto `section.settings` con las claves y valores combinados
 *
 *    Por ejemplo:
 *    - Si el schema dice `{ "id": "heading" }`
 *    - Y `schema_data.heading = "Menú principal"`
 *    - Entonces `section.settings.heading` debe estar disponible en el template
 *
 * 4. **Probar con la sección `header_menu`**
 *
 *    Copia:
 *    - `35_content_for_index.liquid` a tu carpeta `templates/`
 *    - `35_header_menu.liquid` a tu carpeta `sections/`
 *    - `35_section_data_header_menu.js`, que contiene el objeto JS con la configuración esperada
 *
 *    No necesitas importar ese archivo, simplemente copia y pega el objeto en `contextPlease.ts`.
 *
 * ✅ Resultado esperado:
 * - `{% section 'header_menu' %}` incluye correctamente el contenido del archivo
 * - Se extrae el schema correctamente y se interpreta
 * - `section.settings` está disponible y tiene los valores correctos
 * - El motor renderiza con un scope aislado, como `render`
 * - El servidor guarda correctamente los archivos de sección
 * - Si no existe la sección, aparece: `Liquid error: header_menu not found`
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
        "sections"
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
