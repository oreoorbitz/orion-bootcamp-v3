/**
 * 🧩 MÓDULO 26: Enviar archivos individuales por HTTP y recargar HTML o CSS automáticamente
 *
 * 🧠 Concepto clave:
 * En este módulo, vas a comenzar a enviar archivos reales desde el navegador al servidor.
 * Cuando un archivo cambie, se comprimirá individualmente, se enviará por HTTP, y el servidor decidirá si
 * necesita regenerar el HTML o simplemente actualizar los estilos.
 *
 * 🎯 Objetivo:
 * - Observar archivos en `layout/`, `templates/` y `assets/`
 * - Comprimir solo el archivo que cambió
 * - Enviarlo al servidor como ZIP junto con su nombre y carpeta
 * - El servidor lo descomprime en la carpeta correspondiente
 * - Si es `.liquid`, se regenera `index.html` y se inyecta el script de hot reload
 * - Si es `.css`, se actualiza sin recargar la página
 *
 * ✅ Instrucciones:
 *
 * 1. **Reestructura tu tema**
 *    A partir de ahora, tu carpeta de ejercicio (`typescript/ejercicio_26/`) debe contener:
 *    - Una carpeta `layout/` con `theme.liquid`
 *    - Una carpeta `templates/` con `content_for_index.liquid`
 *    - Una carpeta `assets/` con `theme.css` (u otros recursos)
 *
 *    Si tienes archivos sueltos, muévelos a estas carpetas.
 *
 * 2. **En `main.ts`**
 *    - Observa cambios con `Deno.watchFs()` en:
 *      - `layout/`
 *      - `templates/`
 *      - `assets/`
 *
 *    - Cuando detectes un cambio:
 *      - Comprime **solo el archivo modificado** usando `zip` desde:
 *        ```ts
 *        import { zip } from "jsr:@deno-library/compress";
 *        ```
 *      - Crea un `FormData` y adjunta:
 *        - El archivo ZIP
 *        - El nombre del archivo (ej. `theme.liquid`)
 *        - El nombre de la carpeta (`layout`, `templates`, `assets`)
 *      - Envía la solicitud `POST` a `http://localhost:3000/theme-update`
 *      - Imprime la respuesta del servidor
 *
 * 3. **En `controller.ts`**
 *    - Asegúrate de que `controller.ts` esté en `typescript/server/`
 *    - Llama a `iniciarServidor(3000, callback)` pasando una función `callback` como segundo argumento
 *
 *    - Dentro de tu `callback`, llama a tu funcion para para regenerar el HTML desde los archivos de liquid
 *
 * 4. **En `slightlyLate.ts`**
 *    - Crea la ruta `POST /theme-update`
 *    - Dentro de ella:
 *      - Usa `await req.formData()` para extraer:
 *        - el ZIP enviado
 *        - el nombre del archivo original
 *        - el nombre de la carpeta destino
 *      - Descomprime el ZIP recibido usando `zip.uncompress()` desde el mismo módulo que usaste para comprimir
 *      - Escribe el archivo descomprimido en la carpeta correspondiente
 *      - Llama el callback para generar el HTML desde los archivos liquid generados en el servidor
 *
 * 5. **Inyecta el script de hot reload**
 *    - En tu función de generación de HTML, usa `injector()` para inyectar el script de `hotreload.ts` en el HTML generado.
 *
 * 🧪 Prueba:
 * - Ejecuta el servidor con:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - En otra terminal, ejecuta el cliente con:
 *   ```bash
 *   deno run --allow-all typescript/ejercicio_26/main.ts
 *   ```
 * - Abre `localhost:3000` en el navegador
 * - Cambia:
 *   - `layout/theme.liquid` → debe regenerar `index.html` y recargar la página
 *   - `assets/theme.css` → debe recargar solo los estilos sin recargar la página
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_26/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── slightlyLate.ts
 * │       ├── hotreload.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 *
 * 🎯 Resultado esperado:
 * - Detectas qué archivo cambió
 * - Comprimís y enviás solo ese archivo al servidor
 * - El servidor lo coloca en la carpeta adecuada y regenera si es necesario
 * - El navegador se actualiza automáticamente según el tipo de archivo
 * - Mantenés una estructura profesional, moderna y escalable
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
