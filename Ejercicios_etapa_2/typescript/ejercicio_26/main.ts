/**
 * 🧩 MÓDULO 26: Enviar temas por HTTP y regenerar HTML desde el servidor
 *
 * 🧠 Concepto clave:
 * En esta etapa, simulamos cómo una herramienta como Shopify CLI empaqueta y envía un tema al servidor,
 * donde se desempaqueta, se interpreta y se regenera el HTML en tiempo real.
 *
 * 🎯 Objetivo:
 * Lograr que `main.ts` empaquete y envíe tu tema al servidor mediante una solicitud HTTP.
 * El servidor recibirá el contenido, lo desempaquetará, lo copiará a la carpeta de trabajo
 * y regenerará automáticamente el archivo HTML.
 *
 * ✅ Instrucciones:
 *
 * 1. **Preparación del tema**
 *    - Copia tu tema a `typescript/ejercicio_26/`.
 *    - Asegúrate de incluir:
 *      - Un archivo `theme.liquid`
 *      - Un archivo `content_for_index.liquid`
 *      - Una carpeta `assets/`
 *
 * 2. **En `main.ts`:**
 *    - Instala y usa el módulo `zip` desde `https://deno.land/x/zip@v1.2.3/mod.ts`.
 *    - Recupera la lógica de observación de cambios que usaste en módulos anteriores.
 *    - Cuando se detecte un cambio en el tema:
 *      - Crea un archivo ZIP que incluya los archivos `theme.liquid`, `content_for_index.liquid` y la carpeta `assets/`.
 *      - Crea un `FormData` e inserta el archivo ZIP como un `Blob` bajo el campo `theme`.
 *      - Envía una solicitud HTTP tipo `POST` al servidor en la URL `http://localhost:3000/theme-update`.
 *      - Imprime la respuesta del servidor en la consola para confirmar la operación.
 *      - Elimina el archivo ZIP después de enviarlo.
 *
 * 3. **En `controller.ts`:**
 *    - Asegúrate de importar la función `decompress` del módulo `zip`.
 *    - Verifica que `controller.ts` se encuentre en `typescript/server/`.
 *    - Actualiza tu llamada a `iniciarServidor()` para que reciba un segundo argumento: una función de callback.
 *    - Implementa esa función para:
 *      - Eliminar el contenido actual de `themes/dev/`.
 *      - Descomprimir el ZIP recibido en la carpeta `themes/dev/`.
 *      - Regenerar el HTML final dentro de `themes/dev/dist/index.html`.
 *      - Inyectar el script de hot reload como se hacía en módulos anteriores.
 *
 * 4. **En `slightlyLate.ts`:**
 *    - Utiliza el módulo `multiparser` (`https://deno.land/x/multiparser@v2.0.1/mod.ts`) para procesar formularios HTTP.
 *    - Crea una nueva ruta `POST /theme-update`.
 *    - Dentro de esa ruta:
 *      - Extrae el archivo ZIP enviado bajo el campo `theme`.
 *      - Escribe el contenido de ese archivo en el disco como `temp_theme_upload.zip`.
 *      - Llama a la función de callback proporcionada por `controller.ts`, pasándole la ruta del ZIP.
 *      - Devuelve una respuesta HTTP textual indicando éxito o error.
 *
 * 🧪 Prueba:
 * - En una terminal, ejecuta el servidor con:
 *   `deno run --allow-all typescript/server/controller.ts`
 * - En otra terminal, ejecuta:
 *   `deno run --allow-all typescript/ejercicio_26/main.ts`
 * - El servidor debe:
 *   - Recibir y guardar el archivo ZIP
 *   - Reemplazar el contenido de `themes/dev/`
 *   - Regenerar el HTML en `themes/dev/dist/index.html`
 *   - Confirmar el resultado con un mensaje por consola
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_26/
 * │   │   ├── theme.liquid
 * │   │   ├── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── slightlyLate.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── theme.liquid
 * │               ├── content_for_index.liquid
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 *
 * 🎯 Resultado esperado:
 * Simulaste cómo una herramienta CLI puede observar archivos, empaquetarlos,
 * enviarlos al servidor, y regenerar el HTML automáticamente.
 *
 * En el siguiente módulo, mejoraremos este flujo para hacerlo aún más dinámico y reactivo.
 */
