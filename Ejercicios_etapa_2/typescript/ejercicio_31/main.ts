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
 * 2. **Actualiza `router.ts` para soportar handles**
 *
 *    En `typescript/server/router.ts`, modifica la función `resolve(path: string, context: any)` para que detecte rutas dinámicas.
 *
 *    - Para rutas que coincidan con `/products/:handle`, debe devolver información que indique que se usará el template `product` y el objeto correspondiente del contexto.
 *    - Para rutas que coincidan con `/collections/:handle`, debe devolver el template `collection` junto con su objeto.
 *    - Para `/`, debe seguir devolviendo lo necesario para renderizar el template de inicio.
 *    - Si no hay coincidencia, debe devolver `undefined`.
 *
 *    ✅ Utiliza los datos que provienen del objeto `context`, generado por `contextPlease.ts`. Este archivo ya se encarga de consultar la base de datos SQLite y devolver un objeto con las propiedades `products`, `collections`, y `productCollections`, entre otras.
 *
 *    El objeto que devuelve `resolve(path, context)` debe tener al menos estas propiedades:
 *    ```ts
 *    {
 *      template: "product" | "collection" | "content_for_index",
 *      object?: any // objeto relevante que se pasa al template
 *    }
 *    ```
 *
 * 3. **Agrega las nuevas plantillas `product.liquid` y `collection.liquid`**
 *
 *    En la carpeta `templates/`, crea:
 *    ```
 *    templates/product.liquid         ← ✅ nuevo archivo
 *    templates/collection.liquid      ← ✅ nuevo archivo
 *    ```
 *    Copia el contenido desde los archivos:
 *    - `typescript/liquid_snippets/31_product.liquid`
 *    - `typescript/liquid_snippets/31_collection.liquid`
 *
 * 4. **Actualiza `content_for_index.liquid`**
 *
 *    En lugar de mostrar todos los detalles de productos y colecciones, ahora enlaza a sus páginas individuales.
 *    Reemplaza el contenido actual con el de:
 *    - `typescript/liquid_snippets/31_content_for_index.liquid`
 *
 * 5. **Actualiza tu lógica de renderizado**
 *
 *    Cuando llames a `resolve(path, context)`:
 *    - Determina el nombre del template adecuado desde la respuesta del router.
 *    - Combina el contexto global con el objeto específico (`product` o `collection`) si está presente.
 *    - Si `resolve()` devuelve `undefined`, renderiza `404.liquid` usando `layout/theme.liquid` e insértalo como `content_for_layout`.
 *
 * 6. **Organiza tu salida en carpetas por tipo**
 *
 *    Hasta ahora, los archivos `.html` se han generado directamente en `dist/`, pero a partir de este módulo:
 *
 *    - Las páginas de producto deben escribirse dentro de `dist/products/`.
 *    - Las páginas de colección dentro de `dist/collections/`.
 *
 *    Actualiza la lógica de generación de archivos HTML para que:
 *    - Detecte cuándo se está renderizando una plantilla como `product.liquid` o `collection.liquid`
 *    - Genere el archivo `.html` en la subcarpeta correspondiente dentro de `dist/`
 * 
 * 7. **Verifica que el servidor sirva correctamente las rutas**
 *
 *    Asegúrate de que el servidor pueda servir páginas como:
 *    - `/products/camisa-suave-a` → `dist/products/camisa-suave-a.html`
 *    - `/collections/sale` → `dist/collections/sale.html`
 *    - Páginas no encontradas deben devolver `404.html` con status `404`
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
 * │               │   ├── products/camisa-suave-a.html         ← ✅ generado dinámicamente
 * │               │   ├── collections/sale.html                 ← ✅ generado dinámicamente
 * │               │   ├── 404.html
 * │               │   └── assets/
 * │               │       └── theme.css
 *
 * 🎯 Resultado esperado:
 * - Tu router ahora resuelve handles dinámicos para productos y colecciones
 * - Se renderizan correctamente los archivos `product.liquid` y `collection.liquid`
 * - El contexto que llega a cada template contiene el objeto correspondiente (`product` o `collection`)
 * - Los archivos `.html` generados respetan la estructura de carpetas
 * - Tu servidor sirve correctamente las páginas o `404.html` cuando no encuentra coincidencias
 */
