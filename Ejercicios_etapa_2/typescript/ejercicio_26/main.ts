/**
 * 🧩 MÓDULO 26: Enviar temas por HTTP y regenerar HTML desde el servidor
 *
 * 🧠 Concepto clave:
 * En esta etapa, simulamos cómo una herramienta como Shopify CLI empaqueta y envía un tema al servidor,
 * donde se desempaqueta, se interpreta y se regenera el HTML en tiempo real.
 *
 * 🎯 Objetivo:
 * Lograr que `main.ts` empaquete y envíe tu tema al servidor mediante una solicitud HTTP.
 * El servidor recibirá el contenido, lo desempaquetará, lo copiará a la carpeta de trabajo
 * y regenerará automáticamente el archivo HTML.
 *
 * ✅ Instrucciones:
 *
 * 1. **Preparación del tema**
 *    - Copia tu tema a `typescript/ejercicio_26/`.
 *    - Asegúrate de incluir:
 *      - Un archivo `theme.liquid`
 *      - Un archivo `content_for_index.liquid`
 *      - Una carpeta `assets/`
 *
 * 2. **En `main.ts`:**
- *    - Instala y usa el módulo `zip` desde `https://deno.land/x/zip@v1.2.3/mod.ts`.
+ *    - Importa la función `compress` desde el módulo `zip`:
+ *      ```ts
+ *      import { compress } from "https://deno.land/x/zip@v1.2.3/mod.ts";
+ *      ```
+ *      Este módulo te permite crear archivos ZIP a partir de archivos y carpetas locales.
 *    - Recupera la lógica de observación de cambios que usaste en módulos anteriores.
 *    - Cuando se detecte un cambio en el tema:
 *      - Crea un archivo ZIP que incluya los archivos `theme.liquid`, `content_for_index.liquid` y la carpeta `assets/`.
 *      - Crea un `FormData` e inserta el archivo ZIP como un `Blob` bajo el campo `theme`.
 *      - Envía una solicitud HTTP tipo `POST` al servidor en la URL `http://localhost:3000/theme-update`.
 *      - Imprime la respuesta del servidor en la consola para confirmar la operación.
 *      - Elimina el archivo ZIP después de enviarlo.
 *
 * 3. **En `controller.ts`:**
 *    - Asegúrate de importar la función `decompress` del módulo `zip`.
 *    - Verifica que `controller.ts` se encuentre en `typescript/server/`.
 *    - Actualiza tu llamada a `iniciarServidor()` para que reciba un segundo argumento: una función de callback.
 *    - Implementa esa función para:
 *      - Eliminar el contenido actual de `themes/dev/`.
 *      - Regenerar el HTML final dentro de `themes/dev/dist/index.html`.
 *      - Inyectar el script de hot reload como se hacía en módulos anteriores.
 *
 * 4. **En `slightlyLate.ts`:**
 *    - Utiliza el módulo `multiparser` (`https://deno.land/x/multiparser@v2.0.1/mod.ts`) para procesar formularios HTTP.
 *    - Crea una nueva ruta `POST /theme-update`.
 *    - Dentro de esa ruta:
 *      - Extrae el archivo ZIP enviado bajo el campo `theme`.
 *      - Escribe el contenido de ese archivo en el disco como `temp_theme_upload.zip`.
 *      - Llama a la función de callback proporcionada por `controller.ts`, pasándole la ruta del ZIP.
 *      - Devuelve una respuesta HTTP textual indicando éxito o error.
 *
 * 🧪 Prueba:
 * - En una terminal, ejecuta el servidor con:
 *   `deno run --allow-all typescript/server/controller.ts`
 * - En otra terminal, ejecuta:
 *   `deno run --allow-all typescript/ejercicio_26/main.ts`
 * - El servidor debe:
 *   - Recibir y guardar el archivo ZIP
 *   - Reemplazar el contenido de `themes/dev/`
 *   - Regenerar el HTML en `themes/dev/dist/index.html`
 *   - Confirmar el resultado con un mensaje por consola
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_26/
 * │   │   ├── theme.liquid
 * │   │   ├── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── slightlyLate.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── theme.liquid
 * │               ├── content_for_index.liquid
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 *
 * 🎯 Resultado esperado:
 * Simulaste cómo una herramienta CLI puede observar archivos, empaquetarlos,
 * enviarlos al servidor, y regenerar el HTML automáticamente.
 *
 * En el siguiente módulo, mejoraremos este flujo para hacerlo aún más dinámico y reactivo.
 */
import { zip } from "jsr:@deno-library/compress";
import { debounce } from "jsr:@std/async/debounce";

export async function observarCambios() {
    const rutas = [
        "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/ejercicio_26/content_for_index.liquid",
        "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/ejercicio_26/theme.liquid",
        "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/ejercicio_26/assets"
    ];

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
        empaquetarYEnviarTemaConControl();
    }, 500); // Esperamos 500ms para evitar activaciones múltiples

    for await (const event of watcher) {
        procesarCambio(event);
    }
}

let bloqueado = false;

async function empaquetarYEnviarTemaConControl() {
    if (bloqueado) {
        console.log("⚠️ Procesamiento en curso, esperando...");
        return;
    }

    bloqueado = true;
    await empaquetarYEnviarTema(); // Llamamos la función original
    setTimeout(() => bloqueado = false, 1000); // Esperamos 1 segundo antes de permitir otra ejecución
}

async function empaquetarYEnviarTema() {
    console.log("📦 Empaquetando tema...");

    // 📂 Convertimos la ruta de `ejercicio_26/` en una ruta absoluta
    const rutaZipFolder = Deno.realPathSync("ejercicio_26");
    const archivoZip = `${rutaZipFolder}/temp_theme.zip`;

    try {
        await Deno.stat(rutaZipFolder);
    } catch {
        console.log("📂 La carpeta no existe, creándola...");
        await Deno.mkdir(rutaZipFolder, { recursive: true });
    }

    // 📦 Comprimir la carpeta completa con ruta corregida
    await zip.compress(rutaZipFolder, archivoZip);

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
    formData.append("archivo", new Blob([zipData]), "temp_theme.zip");

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


/* async function probarEnvioSimple() {
    console.log("📦 Enviando objeto JSON al servidor...");

    // 📝 Crear un objeto de prueba
    const datosDePrueba = {
        mensaje: "Hola servidor, probando lógica!",
        timestamp: new Date().toISOString(),
    };

    // 📂 Crear FormData y adjuntar JSON
    const formData = new FormData();
    formData.append("datos", new Blob([JSON.stringify(datosDePrueba)], { type: "application/json" }));

    // 🚀 Enviar solicitud POST
    const response = await fetch("http://localhost:3000/theme-update", {
        method: "POST",
        body: formData
    });

    console.log("📝 Respuesta del servidor:", await response.text());
} */
