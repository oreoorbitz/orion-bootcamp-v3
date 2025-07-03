/**
 * 🧩 MÓDULO 29: Separar plantilla base y contenido mediante `layout` y `templates`
 *
 * 🧠 Concepto clave:
 * En este módulo vas a separar la lógica del diseño principal (layout) del contenido específico de cada página (template).
 * Este patrón imita la arquitectura de temas de Shopify, donde `layout/theme.liquid` sirve como contenedor general
 * y cada archivo dentro de `templates/` representa el contenido de una página específica.
 *
 * 🎯 Objetivo:
 * - Crear una estructura más escalable separando `layout` y `templates`.
 * - Usar la variable especial `{{ content_for_layout }}` para inyectar el contenido de plantilla en el diseño base.
 * - Mantener la renderización en `controller.ts` con esta nueva estructura.
 *
 * ✅ Instrucciones:
 *
 * 1. **Verifica la estructura de tu tema en `typescript/ejercicio_29/`**
 *
 *    Debes tener ya tu proyecto con la siguiente estructura:
 *    - `layout/theme.liquid`
 *    - `templates/content_for_index.liquid`
 *    - `assets/theme.css`
 *    - `main.ts`
 *
 *    Puedes copiar el contenido de tu tema desde `ejercicio_28`, incluyendo las carpetas `layout/`, `templates/` y `assets/`.
 *
 * 2. **Actualiza tu archivo `layout/theme.liquid`**
 *
 *    - Reemplaza el uso de `{{ content_for_index }}` por `{{ content_for_layout }}`
 *    - Este marcador actuará como punto de entrada dinámico para el contenido de cualquier plantilla.
 *
 * 3. **Actualiza tu motor de plantillas**
 *
 *    - Debes asegurarte de que tu motor de plantillas (no importa cómo lo hayas nombrado o dividido en funciones)
 *      valide **que exista la variable `content_for_layout`**.
 *    - Ya **no debe haber ninguna lógica dentro del motor de plantillas que busque `content_for_index` directamente**.
 *    - La única variable que debe usarse para inyectar contenido en el layout es `{{ content_for_layout }}`.
 *
 *    Esta separación es importante para que en el futuro puedas reutilizar la misma estructura de layout
 *    con múltiples plantillas sin cambiar la lógica del motor.
 *
 * 4. **Actualiza `controller.ts` para combinar layout + template** LAYOUT EN CONTROLLER
 *
 *    Dentro de tu función de renderizado:
 *
 *    - Lee el archivo `templates/content_for_index.liquid` como plantilla base de contenido.
 *    - Luego, renderízalo con el contexto actual.
 *    - Usa el resultado como valor de `content_for_layout` y pásalo al motor de plantillas para procesar `layout/theme.liquid`.
 *    - Escribe el HTML final resultante dentro de `themes/dev/dist/index.html`.
 *
 *    El `controller.ts` debe ser el único lugar donde decides **qué archivo de plantilla se va a usar**.
 *    Esto te prepara para poder asociar diferentes archivos `.liquid` a diferentes rutas más adelante.
 *
 *    ⚠️ **Asegúrate de que tu motor no tenga ninguna ruta hardcoded ni que lea `content_for_index` directamente.**
 *
 * 5. **Prueba el flujo completo**
 *
 *    - Verifica que `layout/theme.liquid` y `templates/content_for_index.liquid` se combinen correctamente
 *      y que el archivo `dist/index.html` contenga ambos resultados.
 *    - Asegúrate de que los estilos de `theme.css` siguen aplicándose.
 *    - Usa `main.ts` para observar cambios y enviar actualizaciones al servidor.
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_29/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               │   └── theme.liquid
 * │               ├── templates/
 * │               │   └── content_for_index.liquid
 * │               └── dist/
 * │                   ├── index.html
 * │                   └── assets/
 * │                       └── theme.css
 *
 * 🎯 Resultado esperado:
 * El archivo final generado (`dist/index.html`) debe tener el diseño base definido en `layout/theme.liquid`
 * con el contenido dinámico de `templates/content_for_index.liquid` correctamente inyectado en `{{ content_for_layout }}`.
 *
 * Este patrón te preparará para manejar múltiples plantillas y rutas en el siguiente módulo.
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
        "assets"
    ].map(path)

    // 🔍 Validar que las rutas existan antes de observar cambios
    for (const path of rutas) {
        try {
            await Deno.stat(path);
        } catch {
            console.error(`❌ Error: La ruta ${path} no existe.`);
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
  console.log(pathModificado)
  if (bloqueado) {
        console.log("⚠️ Procesamiento en curso, esperando...");
        return;
    }

    bloqueado = true;
    await empaquetarYEnviarTema(pathModificado); // Llamamos la función original
    setTimeout(() => bloqueado = false, 1000); // Esperamos 1 segundo antes de permitir otra ejecución
}

async function empaquetarYEnviarTema(pathModificado: string) {
    console.log("📦 Empaquetando tema...");
    const nombreArchivoModificado = pathModificado.split("/").pop()
    const nombreCarpeta = pathModificado.split("/").slice(0,-1).pop() ?? ""
    const nombreLimpio = nombreArchivoModificado?.split(".")[0] ?? ""
    const tipoExtension = nombreArchivoModificado?.split(".")[1] ?? ""
    // Ruta para el archivo zip
    const rutaZipFolder = path(".")
    const archivoZip = `${rutaZipFolder}/${nombreLimpio}.zip`;

    try {
        await Deno.stat(rutaZipFolder);
    } catch {
        console.log("📂 La carpeta no existe, creándola...");
        await Deno.mkdir(rutaZipFolder, { recursive: true });
    }

    // 📦 Comprimir la carpeta
    await zip.compress(pathModificado, archivoZip);
    console.log("🔍 Verificando si el archivo ZIP fue creado...");
    try {
        await Deno.stat(archivoZip);
        console.log("✅ ZIP encontrado correctamente!");
    } catch {
        console.log("⚠️ No se encontró el ZIP, algo falló en la compresión.");
    }

    console.log("✅ Tema comprimido correctamente!");
    console.log("🚀 Enviando ZIP al servidor...");

    // Crear FormData y adjuntar ZIP
    const formData = new FormData();
    const zipData = await Deno.readFile(archivoZip);
    formData.append("archivo", new Blob([zipData]), nombreLimpio);
    formData.append("tipoExtension", tipoExtension)
    formData.append("carpeta",nombreCarpeta)
    // Enviar solicitud POST
    const response = await fetch("http://localhost:3000/theme-update", {
        method: "POST",
        body: formData
    });

    console.log("📝 Respuesta del servidor:", await response.text());

    // 🗑️ Borrar el archivo ZIP después de enviarlo
    await Deno.remove(archivoZip);
    console.log("🗑️ ZIP eliminado.");
}
observarCambios();
