/**
 * 🧩 MÓDULO 28: Reemplazar datos estáticos con una base de datos SQLite
 *
 * 🧠 Concepto clave:
 * En sistemas reales como Shopify, los datos como productos y colecciones viven en una base de datos.
 * En este módulo, vas a reemplazar tu `context.ts` estático por una versión conectada a una base de datos real.
 * Usarás SQLite y consultas SQL simples para obtener los datos.
 *
 * 🎯 Objetivo:
 * - Consultar datos de una base de datos SQLite
 * - Generar el objeto `context` dinámicamente desde esas consultas
 * - Usar TypeScript para combinar esos datos en un objeto estructurado
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *    - Copia tu tema a `typescript/ejercicio_28/`
 *    - Asegúrate de que tenga esta estructura:
 *      - `layout/theme.liquid`
 *      - `templates/content_for_index.liquid`
 *      - `assets/theme.css`
 *
 * 2. **Ejecuta el script de plantado**
 *    - En la carpeta `typescript/`, encontrarás un script llamado `planter.ts`.
 *    - Este script crea un archivo `data.db` con datos de ejemplo para productos, colecciones y relaciones.
 *    - Lógralo ejecutando:
 *      ```bash
 *      deno run --allow-read --allow-write Ejercicios_etapa_2/typescript/planter.ts
 *      ```
 *    - Puedes abrir el archivo para ver cómo se insertan los datos si quieres entender cómo funcionan las sentencias SQL `INSERT`.
 *
 * 3. **Actualiza `contextPlease.ts` para leer desde la base de datos**
 *    - Este módulo ya existe desde el módulo anterior.
 *    - Conéctate a `data.db` usando `DatabaseSync` del módulo `node:sqlite`.
 *    - Investiga cómo escribir sentencias SQL simples: `SELECT`, `WHERE`, `JOIN`, etc.
 *    - Usa `db.prepare(...).all()` para realizar **tres consultas separadas**:
 *      - Una para obtener todos los productos (`id`, `title`, `handle`, `precio`)
 *      - Una para obtener todas las colecciones (`id`, `title`, `handle`)
 *      - Una para obtener las relaciones entre productos y colecciones (`productId`, `collectionId`)
 *
 * 4. **Construye el objeto `context`**
 *    - Usa la lógica de TypeScript para unir los productos y las colecciones.
 *    - Piensa cómo podrías combinar estas tres listas para que cada colección tenga un array de productos dentro.
 *    - No necesitas una sola gran consulta SQL — puedes hacerlo desde JavaScript con `.map()` y `.filter()`.
 *
 *    Tu objeto `context` final debería verse así:
 *    ```ts
 *    export const context = {
 *      settings: {
 *        titulo: "titulo",
 *      },
 *      products: [...],      // todos los productos
<<<<<<< HEAD
 *      collections: [...],   // cada una con sus productos correspondientes
 *    };
 *    ```
 *
 * 5. **No modifiques `controller.ts`**
 *    - `controller.ts` debe seguir importando el contexto desde `contextPlease.ts`.
 *    - El resto del pipeline (renderizado, dist/, hotreload) no necesita cambiar.
=======
 *      collections: [...],   // cada colección con su propiedad `products`: un array de productos relacionados
 *    };
 *    ```
 *
 * 5. **Usa la plantilla Liquid proporcionada**
 *    - Copia el archivo `liquid_snippets/28_content_for_index.liquid` y colócalo dentro de `templates/content_for_index.liquid`.
 *    - Esta plantilla recorre todas las colecciones, muestra sus productos, y luego muestra todos los productos disponibles.
 *    - Sirve como prueba para verificar que tu `context` está correctamente construido.
 *
 * 6. **Actualiza tu motor Liquid si es necesario**
 *    - Esta plantilla usa `for` dentro de `for` (bucles anidados) y accede a propiedades profundamente anidadas.
 *    - Si tu motor Liquid no soporta esto aún, modifícalo hasta que la plantilla funcione correctamente.
 *    - Puedes empezar usando un objeto `context` con datos estáticos para validar que la plantilla funciona,
 *      y luego reemplazarlo por los datos extraídos dinámicamente desde la base de datos.
>>>>>>> Paola
 *
 * 🧪 Prueba:
 * - Inicia el servidor con:
 *   ```bash
 *   deno run --allow-all Ejercicios_etapa_2/typescript/server/controller.ts
 *   ```
 * - Asegúrate de que:
 *   - El HTML generado muestra productos y colecciones correctos
 *   - Cada colección contiene los productos apropiados
 *   - El filtro `money` sigue funcionando (lo agregaste en el módulo anterior)
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_28/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   ├── planter.ts             ← Proporcionado para crear la base de datos
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts   ← contiene todo el modelo y consultas
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── dist/
 * │               │   ├── assets/
 * │               │   │   └── theme.css
 * │               │   └── index.html
 *
 * 🧠 Recomendación:
 * No te compliques con joins complejos. Usa TypeScript para unir los datos después de consultarlos.
 *
 * 🎯 Resultado esperado:
 * - Los datos de productos y colecciones ahora provienen de SQLite
 * - El objeto `context` se construye dinámicamente desde la base de datos
 * - Consolidaste tu modelo en un solo módulo (`contextPlease.ts`), lo cual
 *   simplifica el patrón MVC que usarás de aquí en adelante.
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
