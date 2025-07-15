/**
 * 🧩 MÓDULO 32: Drops personalizados para `collections` y `products`
 *
 * 🧠 Contexto:
 * Shopify utiliza objetos llamados **Drops** para exponer datos globales a sus plantillas Liquid.
 * Un Drop es un tipo especial de objeto que:
 * - Expone datos por `handle`, como `collections['soft-shirts']`
 * - Encapsula su estructura interna para protegerla
 * - No puede iterarse ni accederse por índice, aunque parezca un arreglo u objeto
 *
 * Aunque Liquid no tiene un sistema de tipos estricto, Shopify implementó este patrón dentro de su motor
 * para ofrecer seguridad y control. No estamos hablando de un `type` de TypeScript, sino de una convención:
 * objetos que tienen un comportamiento especial que tu motor de plantillas debe respetar.
 *
 * Por ejemplo:
 * - `collections['some-handle']` debería devolver una colección si existe, o algo vacío si no existe
 * - No deberías poder hacer un `for` directamente sobre `collections`
 *
 * 🎯 Objetivos:
 * - Implementar soporte para un tipo especial de objeto llamado Drop en tu motor de Liquid
 * - Los Drops deben permitir acceso por clave (como un diccionario)
 * - No deben permitir iteración (`{% for ... in drop %}` debe fallar o ignorarse)
 * - No deben permitir acceso por índice (`drop[0]` no debe devolver nada útil)
 *
 * ✅ Instrucciones:
 *
 * 1. **Crea un Drop de productos y uno de colecciones**
 *
 *    - En tu `contextPlease.ts`, agrega una forma de identificar que las propiedades `collections` y `products`
 *      que estás exportando en el objeto `context` son Drops:
 *      - Un Drop de productos que exponga los productos por su `handle`
 *      - Un Drop de colecciones que exponga las colecciones por su `handle`
 *    - Ambos Drops deben funcionar como diccionarios, por ejemplo, en tu Liquid:
 *
 *      ```liquid
 *      {{ products['camisa-suave-a'].title }}
 *      {{ collections['soft-shirts'].title }}
 *      ```
 *
 *    - Cada colección debe incluir su arreglo `products` como propiedad normal (no necesita ser un Drop)
 *
 *    Ejemplo conceptual (no copies literalmente):
 *    ```ts
 *    const rawProducts = await db.select().from(products);
 *    const productos = new ProductsDrop(rawProducts);
 *
 *    const rawCollections = await db.query.collections.findMany({
 *      with: {
 *        productCollections: {
 *          with: { product: true }
 *        }
 *      }
 *    });
 *
 *    const colecciones = new CollectionsDrop(
 *      rawCollections.map(c => ({
 *        ...c,
 *        products: c.productCollections.map(pc => pc.product)
 *      }))
 *    );
 *
 *    return {
 *      products: productos,
 *      collections: colecciones
 *    };
 *    ```
 *
 * 2. **Actualiza tu motor de plantillas para soportar Drops**
 *
 *    - Un Drop es simplemente un objeto que implementa una convención especial en tu motor
 *    - Puedes identificar si un objeto es un Drop usando `.isDrop = true` o `instanceof`
 *    - En `renderizarVariables()` y `procesarBucles()`, evita iterar Drops o accederlos como si fueran arreglos
 *    - Asegúrate de que si se accede a una clave que no existe (`drop['no-existe']`), **el resultado sea un string vacío** cuando se renderiza en una plantilla
 *
 *    Esto asegura que Drops se comporten de forma segura y silenciosa, como lo hacen en Shopify.
 *
 * 3. **Prueba tu implementación usando `liquid_snippets/32_content_for_index.liquid`**
 *
 *    Copia el contenido de ese archivo a tu carpeta `templates/` o donde tu router lo espere.
 *    Este archivo contiene el siguiente Liquid, que debe renderizarse sin errores:
 *
 *    ```liquid
 *    {{ products['camisa-suave-a'].title }}
 *
 *    {{ collections['soft-shirts'].title }}
 *
 *    {% for producto in collections['soft-shirts'].products %}
 *      {{ producto.title }} - {{ producto.precio }}
 *    {% endfor %}
 *
 *    {{ products['no-existe'].title }} → (no error)
 *    {{ collections['fantasma'].products }} → (no error)
 *    ```
 *
 * 4. **Ejecuta `planter.ts` antes de comenzar**
 *
 *    El archivo de base de datos ha sido actualizado con más productos.
 *    Asegúrate de correr `planter.ts` para que tu base esté al día:
 *
 *    ```bash
 *    deno run --allow-read --allow-write --allow-net planter.ts
 *    ```
 *
 * ✅ Resultado esperado:
 * - `products['handle']` y `collections['handle']` devuelven datos útiles si existen
 * - Accesos inválidos retornan valores vacíos sin lanzar errores
 * - Tu motor reconoce que no debe iterar Drops o tratarlos como arreglos
 * - Las colecciones siguen teniendo acceso a sus productos normalmente
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
