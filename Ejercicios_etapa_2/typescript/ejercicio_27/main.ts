/**
 * MÓDULO 27: Introducción al Modelo (MVC) y uso de datos dinámicos
 *
 * 🧠 Concepto clave:
 * En este módulo vas a estructurar tu aplicación siguiendo el patrón Modelo-Vista-Controlador (MVC).
 * Vas a crear un "modelo" que centraliza la información del contexto de renderizado.
 * De esta forma, el servidor puede generar HTML a partir de datos reales como productos y colecciones.
 *
 * 🎯 Objetivo:
 * Separar la capa de datos del controlador, y renderizar HTML dinámico con productos y colecciones
 * que provienen de un módulo llamado `contextPlease.ts`.
 *
 * ✅ Instrucciones:
 *
 * 1. **Copia el contenido base a `Ejercicios_etapa_2/typescript/ejercicio_27/`**
 *    Asegúrate de que la estructura de carpetas sea como sigue:
 *    - `layout/theme.liquid`
 *    - `templates/content_for_index.liquid`
 *    - `assets/theme.css`
 *    - `main.ts`
 *
 *    Puedes copiar el contenido base desde `ejercicio_26`, que ya tiene este formato.
 *
 * 2. **En `contextPlease.ts`:**
 *    - Crea un archivo nuevo en:
 *      ```
 *      Ejercicios_etapa_2/typescript/server/contextPlease.ts
 *      ```
 *    - Importa los datos desde `seedData.ts`:
 *      ```ts
 *      import { products, collections, productCollections } from "../seedData.ts";
 *      ```
 *    - Construye un objeto llamado `context` con esta información. Ejemplo:
 *      ```ts
 *      export const context = {
 *        products,
 *        collections,
 *        productCollections
 *      };
 *      ```

 * 3. **En `controller.ts`:**
 *    - Importa `context` desde el nuevo módulo:
 *      ```ts
 *      import { context } from "./contextPlease.ts";
 *      ```
 *    - Reemplaza cualquier dato que antes estaba definido directamente en `controller.ts`
 *      por el uso del objeto `context`.

 * 4. **Agrega un filtro de dinero:**
 *    - En el lugar donde registras filtros de Liquid, agrega un filtro llamado `money` que:
 *      - Recibe un número como argumento
 *      - Lo divide por 100 y devuelve un número con dos decimales (`toFixed(2)`)
 *
 *      Ejemplo:
 *      ```ts
 *      liquidEngine.registerFilter("money", (value: number) => (value / 100).toFixed(2));
 *      ```

 * 5. **Renderiza la plantilla con datos reales:**
 *    - Asegúrate de que el motor Liquid reciba `context` como contexto al momento de renderizar.

 * 6. **En tu ejercicio (`ejercicio_27`)**
 *    - Abre el archivo `templates/content_for_index.liquid` y reemplaza su contenido con el snippet:
 *      Copia desde:
 *      ```
 *      Ejercicios_etapa_2/typescript/liquid_snippets/27_content_for_index.liquid
 *      ```
 *    - Abre el archivo `assets/theme.css` y reemplaza su contenido con el snippet:
 *      Copia desde:
 *      ```
 *      Ejercicios_etapa_2/typescript/css_snippets/27_theme.css
 *      ```
 *    - Estos snippets renderizarán las colecciones y productos de forma dinámica.

 * 🧪 Prueba:
 * - Inicia el servidor con:
 *   ```bash
 *   deno run --allow-all Ejercicios_etapa_2/typescript/server/controller.ts
 *   ```
 * - Envía el archivo actualizado desde:
 *   ```bash
 *   deno run --allow-all Ejercicios_etapa_2/typescript/ejercicio_27/main.ts
 *   ```
 * - Abre la URL del servidor en el navegador (p. ej. `http://localhost:3000`)
 * - Debes ver los títulos de las colecciones y productos correctamente renderizados en HTML
 * - Los precios deben mostrarse en formato decimal gracias al filtro `money`

 * 🧠 Recomendación:
 * Piensa en el archivo `contextPlease.ts` como el “modelo” en tu arquitectura:
 * - Centraliza los datos
 * - Permite que el controlador se enfoque solo en renderizar la vista
 *
 * Este patrón te permitirá escalar y modificar tu sitio fácilmente en los próximos módulos.
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_27/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   ├── server/
 * │   │   ├── contextPlease.ts
 * │   │   ├── controller.ts
 * │   │   ├── slightlyLate.ts
 * │   │   ├── wsServer.ts
 * │   │   └── themes/
 * │   │       └── dev/
 * │   │           ├── layout/
 * │   │           │   └── theme.liquid
 * │   │           ├── templates/
 * │   │           │   └── content_for_index.liquid
 * │   │           ├── assets/
 * │   │           │   └── theme.css
 * │   │           └── dist/
 * │   │               └── index.html
 * │   ├── seedData.ts
 * │   ├── liquid_snippets/
 * │   │   └── 27_content_for_index.liquid
 * │   └── css_snippets/
 * │       └── 27_theme.css
 *
 * 🎯 Resultado esperado:
 * Has dividido correctamente tu app en Modelo (context), Vista (Liquid) y Controlador (render).
 * Tu motor de plantillas ahora usa datos dinámicos, y la vista se adapta al contenido sin hardcodear nada.
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
