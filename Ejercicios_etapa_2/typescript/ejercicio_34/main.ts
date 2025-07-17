/**
 * 🧩 EJERCICIO 34: Soporte para `{% render %}` con scope aislado
 *
 * 🧠 Contexto:
 * Shopify ofrece dos formas de insertar snippets: `{% include %}` y `{% render %}`.
 * Ya implementaste `{% include %}`, que reusa el **mismo contexto global** del archivo actual.
 *
 * Ahora vas a implementar `{% render %}`, que permite pasar un **scope local** a un snippet.
 *
 * La diferencia principal es que en `{% render %}`:
 * - Solo se puede acceder a:
 *   - Las variables pasadas explícitamente (por clave)
 *   - Los *drops* y contexto global (como `collections`, `all_products`, etc.)
 * - **NO** se accede a variables locales definidas con `assign` en el archivo que invoca el `render`
 *
 * 🧪 Ejemplo:
 * ```liquid
 * {% assign saludo = "hola" %}
 * {% render 'mensaje', texto: "bienvenidos" %}
 * ```
 * Si el snippet `mensaje.liquid` contiene `{{ saludo }}`, **no** verá esa variable.
 * Pero sí verá `{{ texto }}` (porque fue pasada) y `{{ collections }}` (porque es global).
 *
 * 🎯 Objetivos:
 * - Implementar soporte para `{% render 'nombre', clave: valor %}`
 * - Buscar el snippet en la carpeta `snippets/`
 * - Evaluar su contenido usando:
 *   - Un scope local que **solo incluye las variables pasadas**
 *   - Además del contexto global (drops como `collections`)
 *
 * ✅ Instrucciones:
 *
 * 1. **Asegúrate de tener la carpeta `snippets/`**
 *
 *    Igual que en el ejercicio anterior, tu tema debe incluir esta estructura:
 *
 *    ```
 *    /ejercicio_34/
 *    ├── templates/
 *    ├── snippets/
 *    │   └── mensaje.liquid
 *    ```
 *
 *    Puedes usar el archivo `liquid_snippets/34_mensaje.liquid` como ejemplo.
 *
 * 2. **Agrega soporte para `{% render %}` en tu motor de plantillas**
 *
 *    - Reconoce expresiones como: `{% render 'mensaje', texto: "algo" %}`
 *    - Debes:
 *      1. Buscar `mensaje.liquid` en la carpeta `snippets/`
 *      2. Crear un nuevo scope que:
 *         - Incluya solo las variables pasadas (`texto`, en el ejemplo)
 *         - Tenga acceso a los drops del contexto global (como `collections`)
 *      3. Evaluar el contenido del snippet con ese nuevo scope
 *    - Si el archivo no existe, devuelve el texto:
 *
 *      ```
 *      Liquid error: mensaje not found
 *      ```
 *
 *    🧠 Consejo: Puedes clonar el contexto global y añadirle únicamente las variables pasadas.
 *
 * 3. **Prueba tu implementación con el siguiente archivo**
 *
 *    Copia:
 *    - `34_content_for_index.liquid` dentro de tu carpeta `templates/`
 *    - `34_mensaje.liquid` dentro de tu carpeta `snippets/`
 *
 *    Este ejemplo incluye:
 *    - Un `assign` de nivel superior (no debe verse en el render)
 *    - Un `include` que sí puede verlo
 *    - Un `render` que solo debe ver la variable pasada
 *
 * 4. **Resultado esperado**
 * - El contenido del render aparece correctamente
 * - La variable pasada explícitamente aparece
 * - Las variables globales como `collections` también están disponibles
 * - Variables locales no se filtran hacia el snippet
 * - Si el snippet no existe, aparece el mensaje `Liquid error: nombre not found`
 */
