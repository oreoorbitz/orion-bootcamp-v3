/**
 * MÓDULO 33: layouts/, settings_data.json y registro de tienda
 *
 * 🧠 Concepto clave:
 * En Shopify, el archivo principal `theme.liquid` se encuentra en la carpeta `layouts/` y actúa como punto de entrada
 * para el resto de las plantillas. A su vez, Shopify usa un sistema de registro de tienda (por dominio)
 * que permite mantener configuraciones separadas por tienda.
 *
 * Este módulo actualiza tu entorno para simular ese comportamiento:
 *
 * - Moverás `theme.liquid` a una carpeta `layouts/`
 * - Eliminarás `content_for_index.liquid` y almacenarás su contenido directamente en `settings_data.json`
 * - Simularás un entorno multitienda usando un archivo `.storesettings.json`
 * - Harás disponible un objeto global `Shop` en Liquid que contiene información de la tienda
 *
 * ✅ Objetivo:
 * - Organizar el layout base de tu sitio como en Shopify
 * - Implementar un sistema de registro de tienda con dominio `.mymockify.com`
 * - Hacer que el objeto `Shop` esté disponible durante el render
 *
 * 🧩 Estructura esperada:
 * ```
 * .
 * ├── layouts/
 * │   └── theme.liquid               ← Aquí va el layout base con {% render 'header' %}, {{ content_for_layout }}, etc.
 * ├── sections/
 * ├── snippets/
 * ├── templates/
 * │   ├── product.liquid
 * │   └── collection.liquid
 * ├── config/
 * │   ├── settings_schema.json
 * │   └── settings_data.json        ← Ahora contendrá también el layout principal
 * ├── assets/
 * ├── dist/
 * ├── Mapper.ts
 * └── .storesettings.json           ← Se genera automáticamente desde Mockify
 * ```

 * ✅ Instrucciones:

 * 1. **Mover el layout principal**:
 *    - Mueve `theme.liquid` a una carpeta nueva llamada `layouts/`
 *    - En lugar de usar `content_for_index.liquid`, define un espacio como `{{ content_for_layout }}` dentro del layout

 * 2. **Actualizar `settings_data.json`**:
 *    - En tu `Mapper.ts`, guarda el HTML que antes estaba en `content_for_index.liquid`
 *      como un nuevo valor llamado `content_for_layout` dentro de `settings_data.json`

 * 3. **Registrar la tienda**:
 *    - Ejecuta el CLI con:
 *      ```
 *      deno run --allow-all ../Mockify.ts theme dev --store johnsstore.mymockify.com
 *      ```
 *    - Esto creará un archivo `.storesettings.json` en el directorio actual con:
 *      ```json
 *      {
 *        "store": "johnsstore.mymockify.com"
 *      }
 *      ```
 *    - La próxima vez que corras `Mockify`, no será necesario volver a pasar `--store`

 * 4. **Hacer disponible el objeto `Shop`**:
 *    - En el motor Liquid, asegúrate de inyectar un objeto global llamado `Shop` con:
 *      ```ts
 *      {
 *        url: "johnsstore.mymockify.com"
 *      }
 *      ```
 *    - Este objeto debe estar disponible en cualquier plantilla o sección

 * ✅ Mockify debe:
 * - Validar que exista la carpeta `layouts/` y el archivo `theme.liquid`
 * - Verificar la existencia del archivo `.storesettings.json` o generarlo con el flag `--store`
 * - Inyectar esa información en el proceso de render

 * ✅ Mapper debe:
 * - Cargar `theme.liquid`, detectar `{{ content_for_layout }}`, y sustituirlo con la salida renderizada desde `content_for_layout` en `settings_data.json`

 * 💡 Consejo:
 * Este patrón simula cómo Shopify maneja diferentes tiendas con configuraciones separadas. Al tener `.storesettings.json`,
 * puedes más adelante soportar múltiples tiendas y entornos de desarrollo sin repetir estructura.

 * Próximo paso: implementar edición y guardado visual de estas configuraciones (parte 3 del curso).
 */
