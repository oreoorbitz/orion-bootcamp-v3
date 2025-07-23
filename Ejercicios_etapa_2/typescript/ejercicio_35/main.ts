/**
 * 🧩 EJERCICIO 35: Soporte para secciones con `{% section %}` y esquema (`{% schema %}`)
 *
 * 🧠 Contexto:
 * Shopify permite estructurar páginas usando *secciones*. Una sección es un archivo `.liquid` en la carpeta `sections/`
 * que puede incluir contenido dinámico y configuración editable a través de un bloque `{% schema %}`.
 *
 * Para mantenerlo simple por ahora:
 * - No vamos a usar un archivo externo `.json`
 * - En su lugar, vas a copiar un objeto JS con los datos de configuración de la sección desde un archivo provisto
 *
 * A futuro, ese objeto vendrá de un archivo `.json` generado por el usuario (como en Shopify).
 *
 * 📁 Las secciones viven en su propia carpeta:
 *
 * ```
 * /ejercicio_35/
 * ├── templates/
 * ├── snippets/
 * ├── sections/
 * │   └── featured_collection.liquid
 * ```
 *
 * 🎯 Objetivos:
 * - Implementar soporte para `{% section 'featured_collection' %}`
 * - Leer el archivo desde `sections/featured_collection.liquid`
 * - Procesar su contenido usando su propio contexto (como `render`)
 * - Soportar `{% schema %}` para extraer configuración de la sección
 * - Inyectar los valores en `section.settings`, que estará disponible en la plantilla
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `sections/` en tu tema**
 *
 *    Igual que con `snippets/`, tu tema ahora debe tener una carpeta llamada `sections/`.
 *    Asegúrate de que cuando subas tus archivos al servidor, cualquier archivo de sección
 *    sea guardado correctamente en:
 *
 *    ```
 *    themes/dev/sections/
 *    ```
 *
 * 2. **Agrega soporte para `{% section 'nombre' %}` en tu motor de plantillas**
 *
 *    - Debes reconocer expresiones como: `{% section 'featured_collection' %}`
 *    - Leer el archivo `featured_collection.liquid` de la carpeta `sections/`
 *    - Procesar su contenido con una estrategia similar a `render`, es decir:
 *      - Scope aislado (no tiene acceso a variables locales del template padre)
 *      - Debe tener acceso a los Drops globales (`collections`, `all_products`, etc.)
 *    - Si el archivo no existe, renderiza:
 *
 *      ```
 *      Liquid error: section 'featured_collection' not found
 *      ```
 *
 * 3. **Soporte para `{% schema %}`**
 *
 *    Dentro del archivo de sección, encontrarás un bloque `{% schema %}` al final.
 *    Este bloque contiene un JSON válido que describe los inputs configurables de la sección.
 *
 *    🧠 Importante: El bloque `{% schema %}` define únicamente la **estructura** de configuración — **no contiene los valores reales**.
 *
 *    En este ejercicio, los valores reales los vas a definir manualmente en `contextPlease.ts`.
 *
 *    - Copia el contenido del archivo `35_settings_data.js` (proporcionado en `liquid_snippets/`) dentro de `contextPlease.ts`.
 *    - Tu motor debe leer desde `context.settings.current.sections` para obtener los valores de configuración
 *      que se inyectarán como `section.settings`.
 *
 *    Por ejemplo:
 *    - Si el schema contiene `{ "id": "title" }`
 *    - Y el archivo tiene `settings.current.sections.featured_collection.settings.title = "Productos destacados"`
 *    - Entonces `section.settings.title` debe estar disponible dentro del template
 *
 * 4. **Probar con la sección `featured_collection`**
 *
 *    Copia los siguientes archivos desde `liquid_snippets/` a tu tema:
 *
 *    - `35_content_for_index.liquid` → `templates/`
 *    - `35_featured_collection.liquid` → `sections/`
 *    - `35_settings_data.js` → copia su contenido dentro de `contextPlease.ts`
 *
 * ✅ Resultado esperado:
 * - `{% section 'featured_collection' %}` incluye correctamente el contenido del archivo
 * - Se extrae el schema correctamente y se interpreta
 * - `section.settings` está disponible y tiene los valores correctos
 * - El motor renderiza con un scope aislado, como `render`
 * - El servidor guarda correctamente los archivos de sección
 * - Si no existe la sección, aparece: `Liquid error: featured_collection not found`
 */
