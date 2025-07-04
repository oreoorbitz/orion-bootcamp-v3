/**
 * 🧩 MÓDULO 30: Crear módulo de rutas y manejar 404s
 *
 * 🧠 Concepto clave:
 * En este módulo comenzarás a estructurar el manejo de rutas, como lo harías en un servidor real.
 * Crearás un módulo de rutas personalizado (parecido a un `Router` de Oak o Express) y establecerás
 * un comportamiento base para cuando una ruta no se encuentre (404).
 *
 * 🎯 Objetivo:
 * - Crear un archivo `router.ts` en `server/` que contenga una tabla de rutas
 * - Implementar una función `resolve(path)` que retorne el nombre del template asociado a una ruta
 * - Crear una plantilla `404.liquid` para rutas no encontradas
 * - Procesar esa plantilla con tu motor de Liquid, igual que `content_for_index.liquid`
 * - Comenzar a organizar múltiples templates y prepararte para rutas dinámicas
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *
 *    Copia tu tema a `typescript/ejercicio_30/` desde el ejercicio anterior (`ejercicio_29`).
 *    Asegúrate de incluir:
 *    - `layout/`
 *    - `templates/`
 *    - `assets/`
 *    - `main.ts`
 *
 *    Verifica que `templates/` contenga `content_for_index.liquid`.
 *
 * 2. **Crea el archivo `router.ts` en `server/`**
 *
 *    Este módulo vivirá del lado del servidor.
 *
 *    - Crea `typescript/server/router.ts`
 *    - Exporta una función u objeto `router` con una función `resolve(path: string)`
 *    - Esta función debe devolver el nombre del template asociado. Por ejemplo:
 *
 *    ```ts
 *    export const router = {
 *      resolve(path: string) {
 *        const routes = {
 *          "/": "content_for_index",
 *        };
 *        return routes[path];
 *      }
 *    };
 *    ```
 *
 *    En próximos módulos, este archivo se expandirá para admitir handles dinámicos.
 *
 * 3. **Crea la plantilla `404.liquid`**
 *
 *    Dentro de `templates/`, crea:
 *    ```
 *    templates/404.liquid
 *    ```
 *    Copia el contenido desde el snippet de abajo.
 *
 * 4. **Actualiza tu lógica de renderizado para usar el router**
 *
 *    - Importa `router` desde `server/router.ts`
 *    - Llama a `router.resolve(path)` para determinar el nombre del template
 *    - Si `resolve()` devuelve `undefined`, usa `"404"` como fallback
 *    - Usa tu motor de plantillas para procesar el archivo correspondiente (`content_for_index.liquid` o `404.liquid`)
 *    - Inyecta el resultado como `content_for_layout` en el layout
 *    - Escribe el HTML final en `themes/dev/dist/`
 *
 *    > ⚠️ Recuerda: si antes solo estabas procesando un solo template (`content_for_index.liquid`), ahora deberías asegurarte
 *    > de que tu motor puede manejar múltiples archivos `.liquid` desde `templates/`.
 *
 * 5. **Organiza tus rutas y plantillas**
 *
 *    - Si aún no lo has hecho, considera crear una función como `getTemplatePath(nombre: string)` para ubicar templates fácilmente.
 *    - Esto será útil a medida que agregues más archivos como `product.liquid`, `collection.liquid`, etc.
 *
 * 6. **Modifica tu función `iniciarServidor()` en `slightlyLate.ts`**
 *
 *    - Ajusta la función para servir el archivo correspondiente desde `themes/dev/dist/`
 *    - Si la ruta solicitada no existe en disco, sirve `404.html` con status `404`
 *    - Puedes seguir usando `Deno.readTextFile()` como hasta ahora
 *
 *    Esto simulará un comportamiento de servidor real con manejo de errores por rutas no encontradas.
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_30/
 * │   │   ├── layout/
 * │   │   ├── templates/
 * │   │   │   ├── content_for_index.liquid
 * │   │   │   └── 404.liquid
 * │   │   ├── assets/
 * │   │   ├── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── router.ts           ← ✅ nuevo archivo de este módulo
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── dist/
 * │               │   ├── index.html
 * │               │   ├── 404.html      ← ✅ nuevo archivo generado
 * │               │   └── assets/
 * │               │       └── theme.css
 *
 * 🎯 Resultado esperado:
 * - Tienes un `router.ts` funcional que resuelve rutas a templates
 * - Puedes renderizar tanto `content_for_index.liquid` como `404.liquid`
 * - Se generan correctamente `index.html` y `404.html` en `dist/`
 * - Tu servidor en `iniciarServidor()` sirve `404.html` con status 404 cuando la ruta no existe
 * - Estás listo para soportar rutas dinámicas como `/products/:handle` en el próximo módulo
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
