/**
 * 🧩 MÓDULO 31: Rutas dinámicas `/products/:handle` y `/collections/:handle`
 *
 * 🧠 Concepto clave:
 * En este módulo agregarás soporte para rutas dinámicas basadas en el `handle` de productos y colecciones.
 * Esto refleja cómo Shopify renderiza páginas como `/products/camisa-suave-a` o `/collections/sale`.
 *
 * 🎯 Objetivo:
 * - Agregar soporte para rutas como `/products/:handle` y `/collections/:handle`
 * - Crear las plantillas `product.liquid` y `collection.liquid`
 * - Resolver qué plantilla usar y qué objeto pasar como contexto
 * - Renderizar ese objeto en la plantilla correspondiente
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *
 *    Copia tu tema a `typescript/ejercicio_31/` desde el ejercicio anterior (`ejercicio_30`).
 *    Asegúrate de incluir:
 *    - `layout/`
 *    - `templates/`
 *    - `assets/`
 *    - `main.ts`
 *
 *    Asegúrate también de copiar el archivo `router.ts` del módulo anterior.
 *
 * 2. **Actualiza `router.ts` para soportar handles**
 *
 *    - Modifica tu función `resolve(path: string)` para que devuelva:
 *      - `{ template: "product", data: { product } }` cuando el path coincida con un producto
 *      - `{ template: "collection", data: { collection } }` cuando el path coincida con una colección
 *      - `{ template: "content_for_index" }` para `/`
 *      - `undefined` si no hay coincidencias
 *
 *    Puedes usar los datos desde `context.products` y `context.collections`.
 *
 *    > 📌 No te olvides de importar `products` y `collections` dentro de `router.ts`
 *
 *    Ejemplo de retorno esperado:
 *    ```ts
 *    return { template: "product", data: { product: encontrado } };
 *    ```
 *
 * 3. **Agrega las nuevas plantillas `product.liquid` y `collection.liquid`**
 *
 *    En la carpeta `templates/`, crea los archivos:
 *    ```
 *    templates/product.liquid     ← ✅ nuevo archivo
 *    templates/collection.liquid  ← ✅ nuevo archivo
 *    ```
 *    Copia el contenido desde los siguientes snippets:
 *
 *    **🧩 liquid_snippets/31_product.liquid**
 *    ```liquid
 *    <h1>{{ product.title }}</h1>
 *    <p>ID: {{ product.id }}</p>
 *    <p>Handle: {{ product.handle }}</p>
 *    <p>Precio: ${{ product.precio | money }}</p>
 *    ```
 *
 *    **🧩 liquid_snippets/31_collection.liquid**
 *    ```liquid
 *    <h1>{{ collection.title }}</h1>
 *    <p>ID: {{ collection.id }}</p>
 *    <p>Handle: {{ collection.handle }}</p>
 *    ```
 *
 * 4. **Actualiza `content_for_index.liquid`**
 *
 *    En vez de listar todos los datos de productos y colecciones directamente, ahora enlaza a sus páginas individuales.
 *    Reemplaza el contenido actual con el siguiente snippet:
 *
 *    **🧩 liquid_snippets/31_content_for_index.liquid**
 *    ```liquid
 *    <h1>Bienvenido a nuestra tienda</h1>
 *
 *    <h2>Colecciones</h2>
 *    <ul>
 *      {% for collection in collections %}
 *        <li>
 *          <a href="/collections/{{ collection.handle }}">{{ collection.title }}</a>
 *        </li>
 *      {% endfor %}
 *    </ul>
 *
 *    <h2>Productos</h2>
 *    <ul>
 *      {% for producto in products %}
 *        <li>
 *          <a href="/products/{{ producto.handle }}">{{ producto.title }}</a>
 *        </li>
 *      {% endfor %}
 *    </ul>
 *    ```
 *
 * 5. **Actualiza tu `controller.ts`**
 *
 *    - Llama a `router.resolve(path)` para determinar:
 *      - El nombre de la plantilla (`template`)
 *      - El contexto específico para esa ruta (`data`)
 *
 *    - Si `resolve(path)` devuelve `undefined`, usa la plantilla `"404"` y renderiza con contexto global
 *
 *    - Funde el resultado de `resolve(path)` con el contexto global (`context`) al renderizar:
 *    ```ts
 *    const contextFinal = {
 *      ...context,
 *      ...data
 *    };
 *    ```
 *
 * 6. **Actualiza tu `iniciarServidor()` en `slightlyLate.ts`**
 *
 *    - Asegúrate de que el servidor pueda servir archivos generados para rutas como:
 *      - `/products/camisa-suave-a → dist/products/camisa-suave-a.html`
 *      - `/collections/sale` → dist/collections/sale.html`
 *      - `/no-existe` → `404.html` con status 404
 *
 *    - Puedes usar `.replace()` sobre `pathname` para construir el nombre del archivo `.html`
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_31/
 * │   │   ├── layout/
 * │   │   ├── templates/
 * │   │   │   ├── content_for_index.liquid
 * │   │   │   ├── product.liquid         ← ✅ nuevo archivo
 * │   │   │   ├── collection.liquid      ← ✅ nuevo archivo
 * │   │   │   └── 404.liquid
 * │   │   ├── assets/
 * │   │   ├── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── router.ts
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── dist/
 * │               │   ├── content_for_index.html
 * │               │   ├── products/camisa-suave-a.html ← ✅ generado dinámicamente
 * │               │   ├── collections/sale.html         ← ✅ generado dinámicamente
 * │               │   ├── 404.html
 * │               │   └── assets/
 * │               │       └── theme.css
 *
 * 🎯 Resultado esperado:
 * - Tu router ahora resuelve handles dinámicos para productos y colecciones
 * - Se renderizan correctamente los archivos `product.liquid` y `collection.liquid`
 * - El contexto que llega a cada template contiene el objeto correcto (`product` o `collection`)
 * - Los archivos `.html` generados incluyen las rutas dinámicas
 * - Tu servidor sirve las páginas correctas, o `404.html` cuando no encuentra una coincidencia
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
