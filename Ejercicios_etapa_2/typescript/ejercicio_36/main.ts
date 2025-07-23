/**
 * 🧩 EJERCICIO 36: Soporte para filtro `translate` (`| translate` o `| t`)
 *
 * 🧠 Contexto:
 * Shopify permite traducir strings de forma dinámica usando archivos `.json` de traducción por idioma.
 * Cada tienda tiene un idioma activo, y se accede a los textos usando un filtro como:
 *
 * ```liquid
 * {{ 'actions.view' | translate }}
 * {{ 'actions.view' | t }}
 * ```
 *
 * 🗂 A partir de este ejercicio:
 * - Cada tema debe tener una carpeta `locales/`
 * - Los archivos `.json` dentro de esa carpeta deben subirse al servidor, igual que haces con `sections/` o `snippets/`
 * - El servidor debe guardarlos en: `themes/dev/locales/en.json`, `themes/dev/locales/es.json`, etc.
 *
 * 📦 Además, tu `contextPlease.ts` debe incluir un objeto `Mockify` dentro del `context`, con una propiedad `locale`.
 * - Por ejemplo: `{ Mockify: { locale: "en" } }`
 * - Esta estructura crecerá en el futuro para simular el comportamiento de Shopify.
 *
 * 🎯 Objetivos:
 * - Crear un filtro llamado `translate`, con alias `t`
 * - Leer el archivo de traducción correspondiente al valor de `Mockify.locale`
 * - Usar el string de entrada como un path de acceso (`actions.view` busca en `{ actions: { view: ... } }`)
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `locales/` en tu tema**
 *
 *    Por ejemplo:
 *    ```
 *    /ejercicio_36/
 *    ├── locales/
 *    │   ├── en.json
 *    │   └── es.json
 *    ```
 *
 *    ✅ Sube estos archivos al servidor. El servidor debe guardarlos en:
 *    ```
 *    themes/dev/locales/
 *    ```
 *
 *    El servidor debe poder identificar que estos archivos corresponden a traducciones.
 *
 * 2. **Agrega `Mockify.locale` y la sección al contexto**
 *
 *    Abre `contextPlease.ts` y actualiza tu `context` para que incluya lo siguiente:
 *
 *    ```ts
 *    export const context = {
 *      ... otro codigo
 *      Mockify: {
 *        locale: "en"
 *      }
 *      ... otro codigo
 *    };
 *    ```
 *
 *
 * 3. **Agrega el filtro `translate` en tu motor**
 *
 *    - Tu motor debe registrar un filtro llamado `translate`, con un alias `t`.
 *    - El filtro debe:
 *      1. Leer el valor de `Mockify.locale` desde el contexto
 *      2. Buscar y cargar el archivo correspondiente (`locales/en.json`, por ejemplo)
 *      3. Interpretar el string de entrada como una ruta (`actions.view`)
 *      4. Devolver el valor traducido
 *    - Si el archivo no existe o el path no está definido, puedes devolver la misma clave de entrada
 *
 * 4. **Agrega estilos base para el contenido**
 *
 *    Copia el archivo `36_theme.css` y asegúrate de que esté disponible en tu tema.
 *    Puedes colocarlo en una carpeta `assets/` y enlazarlo desde tu layout global.
 *
 * 🧪 Prueba tu implementación con los siguientes archivos:
 *
 * - `36_content_for_index.liquid` en `templates/`
 * - `36_featured_collection.liquid` en `sections/`
 * - `36_product_card.liquid` en `snippets/`
 * - `36_section_data_featured_collection.js` para el contexto
 * - `36_en.json` y `36_es.json` en `locales/`
 * - `36_theme.css` en `assets/`
 *
 * ✅ Resultado esperado:
 * - El botón al final muestra el texto traducido según el valor de `Mockify.locale`
 * - Si cambias `locale` a `'es'`, ves el texto en español sin cambiar ninguna otra línea de código
 * - El resto del contenido (secciones, snippets, loops, Drops) sigue funcionando correctamente
 */
