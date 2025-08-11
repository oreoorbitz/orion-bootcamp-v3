/**
 * 🧩 EJERCICIO 33: Soporte para `{% include %}` al estilo Shopify
 *
 * 🧠 Contexto:
 * Shopify permite usar `{% include %}` en sus plantillas Liquid para reutilizar fragmentos de código.
 * Un `include` toma el nombre de un archivo `.liquid` que vive en la carpeta `snippets/`, lo lee, lo interpreta
 * como parte del archivo actual y lo renderiza usando el **mismo contexto global** que el archivo original.
 *
 * Es decir, no tiene un scope local: puede acceder a todas las variables del archivo donde fue invocado.
 *
 * 📁 A partir de este módulo, todos tus temas deberán tener una carpeta `snippets/` junto a `templates/` y `sections/`.
 *
 * 🎯 Objetivos:
 * - Crear soporte para la expresión `{% include "nombre-del-snippet" %}`
 * - Asegurar que se lea desde un archivo real dentro de la carpeta `snippets/`
 * - Procesar su contenido como parte del archivo original, usando el **contexto global**
 * - Asegurar que los archivos de snippet se guarden correctamente en el servidor
 *
 * ✅ Instrucciones:
 *
 * 1. **Crea una carpeta `snippets/` dentro de tu tema**
 *
 *    A partir de este ejercicio, todos tus temas deben incluir una carpeta llamada `snippets/`.
 *    Ahí es donde vas a colocar todos los fragmentos reutilizables en formato `.liquid`.
 *
 *    Por ejemplo:
 *    ```
 *    /ejercicio_33/
 *    ├── templates/
 *    ├── snippets/
 *    │   └── mensaje.liquid
 *    ```
 *
 *    Puedes usar `liquid_snippets/33_mensaje.liquid` como ejemplo para tu primer snippet.
 *
 * 2. **Asegúrate de que el servidor reciba y guarde los archivos de snippet correctamente**
 *
 *    Ya implementaste lógica para enviar archivos `.liquid` al servidor.
 *    Ahora, asegúrate de que si un archivo recibido corresponde a un snippet, el servidor lo guarde en la carpeta:
 *
 *    ```
 *    themes/dev/snippets/
 *    ```
 *
 *    No es necesario que el cliente tenga una estructura fija en el zip.
 *    El servidor debe poder identificar que un archivo es un snippet (por su ruta o contenido) y ubicarlo correctamente.
 *
 * 3. **Agrega soporte para `{% include %}` en tu motor de plantillas**
 *
 *    - Tu motor debe reconocer y procesar expresiones como: `{% include "mensaje" %}`
 *    - Debes:
 *      1. Buscar el archivo `mensaje.liquid` dentro del folder `snippets/`
 *      2. Leer su contenido como texto
 *      3. Procesar ese contenido con la misma función que usas para cualquier plantilla
 *      4. Usar el **mismo contexto global** que tiene la plantilla original donde apareció el `include`
 *    - Si el archivo no existe, debes renderizar el texto:
 *
 *      ```
 *      Liquid error: mensaje not found
 *      ```
 *
 *    🧠 Consejo: Usa `path.join(snippetsDir, nombre + ".liquid")` para encontrar el archivo.
 *
 * 4. **Prueba tu implementación usando la plantilla `33_content_for_index.liquid`**
 *
 *    Este archivo usa `include` para insertar un snippet:
 *
 *    ```liquid
 *    <h1>Ejemplo de include</h1>
 *    {% include "mensaje" %}
 *    ```
 *
 *    Asegúrate de copiar:
 *    - `33_content_for_index.liquid` dentro de tu carpeta `templates/`
 *    - `33_mensaje.liquid` dentro de tu carpeta `snippets/`
 *
 * 5. **Vuelve a correr `planter.ts` si necesitas regenerar los datos**
 *
 *    Este ejercicio no modifica la base de datos, pero si necesitas resetear tu entorno puedes ejecutar:
 *
 *    ```bash
 *    deno run --allow-read --allow-write --allow-net planter.ts
 *    ```
 *
 * ✅ Resultado esperado:
 * - `{% include "mensaje" %}` inserta correctamente el contenido del snippet
 * - El snippet se procesa como parte del archivo original, usando el mismo contexto
 * - Si el snippet no existe, se renderiza el mensaje `"Liquid error: mensaje not found"`
 * - El servidor guarda correctamente los archivos de snippet en la carpeta `themes/dev/snippets/`
 */
