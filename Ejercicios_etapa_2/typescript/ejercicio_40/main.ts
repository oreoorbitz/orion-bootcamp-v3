/**
 * 🧩 EJERCICIO 40: Condicionales con comparaciones y `else` en Liquid
 *
 * 🧠 Contexto:
 * Hasta ahora tu motor Liquid evaluaba condicionales simples (p. ej., `{% if admin %}`).
 * A partir de este ejercicio debes:
 * 1) Soportar expresiones de comparación dentro de `{% if %}`
 * 2) Soportar el bloque `{% else %}` (sin `elsif` por ahora)
 *
 * 🎯 Objetivos:
 * - Aceptar operadores: `==`, `!=`, `>`, `>=`, `<`, `<=`
 * - Evaluar comparaciones en `{% if ... %}` y permitir `{% else %}` → `{% endif %}`
 * - Operar con números, strings y booleanos (además de truthiness ya soportado)
 *
 * ✅ Reglas de evaluación:
 *
 * 1) Resolución de operandos
 *    - Si un operando es un identificador (p. ej., `x`), resuélvelo desde el contexto actual.
 *    - Literales admitidos: números (`3`, `3.5`), strings (`"abc"`), booleanos (`true`, `false`).
 *
 * 2) Coerción de tipos
 *    - Si **ambos** operandos son numéricos (o strings que representan números), compara numéricamente.
 *    - En otros casos, compara como **strings** para `>`, `>=`, `<`, `<=`.
 *    - Para `==` y `!=`: numérica si ambos son numéricos; en otro caso, igualdad de strings.
 *
 * 3) Truthiness (cuando no hay operador, p. ej. `{% if x %}`)
 *    - `false`, `null`/`undefined`, string vacío, `0` numérico → falsy.
 *    - Cualquier otro valor → truthy.
 *
 * 4) Sintaxis soportada
 *    - `{% if <expr> %} ... {% endif %}`
 *    - `{% if <expr> %} ... {% else %} ... {% endif %}`
 *    - Una sola comparación por condición (sin `and` / `or` en este ejercicio).
 *
 * 5) Robustez
 *    - Si la expresión no se puede evaluar, considera la condición como `false` y continúa el render.
 *
 * 🛠️ Implementación sugerida:
 * - Extrae el contenido entre `{% if` y `%}`; tokeniza en `left`, `operator`, `right`.
 * - Detecta el operador entre: `==`, `!=`, `>`, `>=`, `<`, `<=`. Si no hay, evalúa truthiness de `left`.
 * - Resuelve variables y literales; aplica coerción; ejecuta comparación.
 * - En el parser de bloques, reconoce opcionalmente una rama `{% else %}` antes de `{% endif %}`.
 *
 * 🧪 Pruebas:
 * - Copia `40_conditionals_test.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 * - Sirve esa ruta (por ejemplo, `/conditionals-test`) y verifica:
 *   - `if x > 2`, `if x == "3"`, `if "apple" < "banana"` renderizan como se espera.
 *   - El bloque `{% else %}` aparece cuando la condición es falsa.
 *
 * ✅ Resultado esperado:
 * - Tu motor soporta comparaciones con `==`, `!=`, `>`, `>=`, `<`, `<=` en `{% if %}`.
 * - `{% else %}` funciona correctamente y cierra con `{% endif %}`.
 * - Los casos de fallo se renderizan de forma segura (la condición se considera `false`).
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
        "locales",
        "config"
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
