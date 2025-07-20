/**
 * 🧩 EJERCICIO 37: Soporte para `settings_schema.json` y `settings_data.json`
 *
 * 🧠 Contexto:
 * Shopify permite definir configuraciones globales para una tienda a través de los archivos `config/settings_schema.json`
 * y `config/settings_data.json`. Estas configuraciones están disponibles como el objeto global `settings` en Liquid.
 *
 * 🗂 A partir de este ejercicio:
 * - Cada tema debe tener una carpeta `config/`
 * - Dentro de esa carpeta se definen:
 *   - `settings_schema.json`: Describe los campos disponibles
 *   - `settings_data.json`: Define los valores actuales de esos campos
 *
 * 📤 Ambos archivos deben subirse al servidor igual que `sections/`, `snippets/` o `locales/`.
 *     El servidor los guardará en:
 *
 * ```
 * themes/dev/config/settings_schema.json
 * themes/dev/config/settings_data.json
 * ```
 *
 * ⚠️ No necesitas usar `settings_schema.json` para nada aún — solo incluirlo. Sirve como referencia para construir un editor en el futuro.
 *
 * 🎯 Objetivos:
 * - Leer `settings_data.json` desde tu servidor y convertirlo a un objeto JS
 * - Exponer ese objeto como `settings` en el contexto de tu motor Liquid
 *   - Esto permitirá escribir `{{ settings.copyright.text }}` en cualquier plantilla
 * - Asegurar que el objeto `shop` esté disponible como variable global en todas tus plantillas Liquid
 *
 * ✅ Instrucciones:
 *
 * 1. **Agrega una carpeta `config/` a tu tema**
 *
 *    Dentro de ella, copia los siguientes archivos desde `liquid_snippets/`:
 *
 *    - `37_settings_schema.json` → `config/settings_schema.json`
 *    - `37_settings_data.json` → `config/settings_data.json`
 *
 *    ✅ Sube estos archivos al servidor como parte del tema. El servidor los debe guardar en:
 *
 *    ```
 *    themes/dev/config/
 *    ```
 *
 * 2. **Actualiza `contextPlease.ts`**
 *
 *    - Lee el contenido de `settings_data.json` y conviértelo a objeto JS
 *    - No es necesario interpretar la schema aún
 *    - Agrega las siguientes propiedades al objeto `context` exportado:
 *
 *      - `settings`: el contenido del objeto `current` en `settings_data.json`
 *      - `shop`: un objeto con una propiedad `name` que tú definas (por ejemplo `"Mi tienda"`)
 *
 *    Puedes copiar directamente la estructura del archivo `37_settings_data.json` para poblar el objeto `settings`.
 *
 * 3. **Actualiza tu motor de plantillas**
 *
 *    - Asegúrate de que el objeto `settings` esté disponible como variable global en todas tus plantillas Liquid
 *    - Asegúrate de que el objeto `shop` también esté disponible como variable global
 *    - Cambia tu logica para processar el data para tus seciones en tu motor de plantillas para que use la informacion de seciones que va esta endentro de el object 'settings' que estas pasando a tu motor de plantillas
 *
 * 4. **Usa el layout provisto**
 *
 *    Copia el archivo `37_layout.liquid` desde `liquid_snippets/` y colócalo en tu carpeta `layout/` como `theme.liquid`.
 *
 * ✅ Resultado esperado:
 * - El `title` del HTML se muestra correctamente con el nombre de la tienda (`shop.name`)
 * - El pie de página muestra el texto definido en `settings.copyright.text`
 * - Ambos objetos están disponibles como variables globales
 */
