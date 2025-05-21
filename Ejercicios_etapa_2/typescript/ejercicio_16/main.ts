/**
 * MÓDULO 16: SIMULACIÓN DE ENLACE UNIDIRECCIONAL (ONE-WAY DATA BINDING) EN TERMINAL
 *
 * 🧠 Concepto clave:
 * En frameworks modernos como Vue, React o Angular, los datos cambian y la vista se actualiza automáticamente.
 * A esto se le llama "enlace unidireccional" (one-way data binding).
 *
 * En este módulo vas a simular ese comportamiento desde la terminal. Tu programa:
 * - Detectará cambios en un archivo de datos
 * - Volverá a procesar la plantilla `.liquid`
 * - Mostrará el nuevo HTML renderizado directamente en la consola
 *
 * Este es el primer paso hacia un flujo de desarrollo automático (como un “live preview” básico).
 *
 * 🎯 Objetivo:
 * Crear un pequeño sistema que reacciona a cambios en archivos `.ts` o `.json` y actualiza el HTML renderizado en la terminal.
 *
 * ✅ Estructura esperada:
 * ```
 * Ejercicios_etapa_2/
 * ├── plantilla_motor/
 * │   └── mod.ts                   ← Tu motor unificado
 * ├── ejercicio_16/
 * │   ├── main.ts                  ← Script principal con el watcher
 * │   ├── data.ts                  ← Archivo editable que exporta el objeto `contexto`
 * │   └── template.liquid          ← Tu plantilla HTML en formato liquid
 * ```
 * Esta estructura puede cambiar dependiendo si estás usando un archivo central o una carpeta central, pero en caso de ser una carpeta
 * la única diferencia radica en que tienes tres archivos en lugar de uno dentro de plantilla_motor.
 *
 * ✅ Instrucciones:
 * 1. Crea un archivo `data.ts` con una exportación:
 *    ```ts
 *    export const contexto = { nombre: "Ana", edad: 30 };
 *    ```
 *
 * 2. En `main.ts`:
 *    - Usa `Deno.watchFs()` para observar cambios en `data.ts`
 *    - Usa `import("file://" + path + "?version=" + Date.now())` para forzar la recarga del módulo cuando cambia
 *    - Vuelve a cargar `template.liquid` con `Deno.readTextFile()`
 *    - Usa `renderizarArchivoLiquid` desde tu `mod.ts` (o desde el archivo correspondiente si tienes una carpeta central)
 *      para procesar la plantilla con los datos
 *    - Imprime el HTML resultante en consola. Opcional: usa `console.clear()` entre renders
 *
 * 3. Usa tu pipeline completo:
 *    - Reemplazo de variables
 *    - Condicionales
 *    - Bucles
 *    - Filtros
 *    - Asignaciones
 *    - Renderizado HTML (con escape de texto)
 *
 * ✅ Resultado esperado:
 * Cada vez que guardes `data.ts`, tu terminal se actualiza mostrando el nuevo resultado HTML renderizado.
 *
 * Ejemplo:
 * // template.liquid
 * "<h1>{{ nombre }}</h1><p>Tienes {{ edad }} años.</p>"
 *
 * // data.ts
 * export const contexto = { nombre: "Ana", edad: 30 };
 *
 * // salida en terminal:
 * <h1>Ana</h1>
 * <p>Tienes 30 años.</p>
 *
 * // Cambias edad a 31 en data.ts → la terminal se actualiza automáticamente:
 * <h1>Ana</h1>
 * <p>Tienes 31 años.</p>
 *
 * ✅ Consejo:
 * - Usa `console.log()` al inicio del render para indicar que se recompiló
 * - Si usas `.json` en vez de `.ts`, puedes leerlo directamente con `Deno.readTextFile()` y `JSON.parse()`
 * - Este módulo demuestra cómo un flujo *reactivo* puede lograrse sin un navegador ni framework
 */

//CORRER CON EN COMANDO     deno run --allow-read --allow-run main.ts
//imports
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";


const plantillaPath = "./template.liquid";
const dataPath = "./data.ts";

// 🕵️‍♀️ **Observar cambios en `data.ts`**
async function observarCambios() {
  for await (const evento of Deno.watchFs("./")) {
    if (evento.paths.some(path => path.endsWith("data.ts"))) {
      console.log("\n🔄 Cambio detectado en `data.ts`, recargando contexto...");
      await recargarYProcesar();
    }
  }
}

// 🔄 **Recargar `data.ts` y procesar la plantilla**
async function recargarYProcesar() {
  try {
    console.clear(); // Opcional, limpia la consola entre renders

    // 1️⃣ Recargar `data.ts` con una nueva versión en cada cambio
    const contextoImportado = await import(`file://${Deno.cwd()}/data.ts?version=${Date.now()}`);
    const contexto = contextoImportado.contexto; // Ahora sí accederá correctamente
    console.log(contextoImportado)
    console.log(contexto)
    // 2️⃣ Leer `template.liquid`
    const entradaLiquid = await Deno.readTextFile(plantillaPath);

    // 3️⃣ Procesar la plantilla con los datos actualizados
    const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
    const arbolDOM = htmlParser(plantillaRenderizada);
    const htmlFinal = renderDOM(arbolDOM);

    // 4️⃣ Mostrar el HTML actualizado en consola
    console.log("\n HTML generado:\n", htmlFinal);
  } catch (error) {
    console.error("\n Error al recargar:", error);
  }
}

//Ejecutamos el watcher
await recargarYProcesar(); // Render inicial
observarCambios(); // Monitorea cambios en `data.ts`
