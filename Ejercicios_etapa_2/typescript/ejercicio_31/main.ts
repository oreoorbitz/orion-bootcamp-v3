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
 *    En `typescript/server/router.ts`, modifica la función `resolve(path: string)` para que detecte rutas dinámicas.
 *
 *    - Para rutas que coincidan con `/products/:handle`, debe devolver información que indique que se usará el template correspondiente y el objeto relacionado.
 *    - Para rutas que coincidan con `/collections/:handle`, lo mismo.
 *    - Para `/`, debe seguir devolviendo lo necesario para renderizar el template de inicio.
 *    - Si no hay coincidencia, debe devolver `undefined`.
 *
 *    Puedes obtener los datos desde `context.products` y `context.collections`, o importarlos desde `seedData.ts`.
 *
 *    El objeto de retorno debe incluir tanto el nombre del template como el objeto que será parte del contexto para la renderización.
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
 *    Cuando llames a `resolve(path)`, asegúrate de que:
 *    - Se determine el nombre del template correcto.
 *    - Se combine el contexto global con el objeto específico si corresponde.
 *
 *    Si `resolve()` devuelve `undefined`, asegúrate de usar la plantilla `404`.
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
