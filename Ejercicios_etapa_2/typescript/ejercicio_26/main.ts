/**
 * MÓDULO 26: Enviar temas por HTTP y regenerar HTML desde el servidor
 *
 * 🧠 Concepto clave:
 * En esta etapa, simulamos cómo un entorno como Shopify CLI envía el contenido de un tema al servidor.
 * Vamos a comprimir los archivos del tema localmente, enviarlos vía HTTP, y regenerar el HTML del lado del servidor.
 *
 * 🎯 Objetivo:
 * Permitir que `main.ts` empaquete y envíe tu tema completo al servidor.
 * El servidor actualizará los archivos recibidos y regenerará el HTML automáticamente.
 *
 * ✅ Instrucciones:
 *
 * 1. **Copia tu tema a `typescript/ejercicio_26/`**
 *    Asegúrate de que el tema contenga:
 *    - `theme.liquid`
 *    - `content_for_index.liquid`
 *    - Una carpeta `assets/`
 *
 * 2. **En `main.ts`:**
 *    - Importa el módulo `zip`:  
 *      ```ts
 *      import { zip } from "https://deno.land/x/zip@v1.2.3/mod.ts";
 *      ```
 *
 *    - Extrae la funcionalidad de observar cambios que usaste en módulos anteriores y colócala en `main.ts`.
 *    - Cada vez que detectes un cambio:
 *      - Empaqueta `theme.liquid`, `content_for_index.liquid` y `assets/` en un archivo ZIP (`temp_theme.zip`)
 *      - Crea un `FormData` y adjunta el ZIP usando un `Blob`
 *      - Envia una solicitud `POST` a `http://localhost:3000/theme-update`
 *      - Imprime en la consola la respuesta del servidor usando `console.log(await response.text())`
 *      - Borra el archivo ZIP después del envío
 *
 * 3. **En `controller.ts`:**
 *    - Importa:
 *      ```ts
 *      import { unzip } from "https://deno.land/x/zip@v1.2.3/mod.ts";
 *      ```
 *    - Asegúrate de que esté ubicado en:
 *      ```
 *      typescript/server/controller.ts
 *      ```
 *    - Actualiza tu llamada a `iniciarServidor`:
 *      ```ts
 *      iniciarServidor(3000, onThemeUpdate);
 *      ```
 *    - Define la función `onThemeUpdate` que:
 *      - Borra el contenido existente en `themes/dev/`
 *      - Desempaqueta el ZIP recibido en `themes/dev/`
 *      - Genera el HTML en `themes/dev/dist/index.html`
 *      - Inyecta `hotreload.ts` al archivo HTML como antes
 *
 * 4. **En `slightlyLate.ts`:**
 *    - Importa:
 *      ```ts
 *      import { MultipartReader } from "https://deno.land/std@0.202.0/mime/multipart.ts";
 *      ```
 *    - Agrega una ruta POST `/theme-update`
 *    - Usa `MultipartReader` para procesar el archivo ZIP recibido
 *    - Llama al callback que recibiste como segundo argumento al iniciar el servidor
 *
 * 🧪 Prueba:
 * - Inicia el servidor con:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - Luego, en otra terminal, ejecuta:
 *   ```bash
 *   deno run --allow-all typescript/ejercicio_26/main.ts
 *   ```
 * - El servidor debe:
 *   - Recibir el archivo ZIP
 *   - Reemplazar el contenido de `themes/dev/`
 *   - Generar el HTML actualizado en `themes/dev/dist/index.html`
 *   - Imprimir "actualización recibida" u otro mensaje de confirmación
 *
 * 📁 Estructura esperada:
 * ```
 * Ejercicios_etapa_2/
 * ├── ejercicio_26/
 * │   ├── theme.liquid
 * │   ├── content_for_index.liquid
 * │   ├── assets/
 * │   └── main.ts        ← empaqueta, observa, y envía el tema al servidor
 * └── typescript/
 *     └── server/
 *         ├── controller.ts          ← lógica del render y callback de actualización
 *         ├── slightlyLate.ts        ← expone `/theme-update` y usa MultipartReader
 *         └── themes/
 *             └── dev/
 *                 ├── theme.liquid
 *                 ├── content_for_index.liquid
 *                 ├── assets/
 *                 └── dist/
 *                     └── index.html
 * ```
 *
 * 🎯 Resultado esperado:
 * Has simulado cómo una herramienta como Shopify CLI comprime, envía, y actualiza un tema en el servidor.
 * Además, integraste un mecanismo completo de regeneración de HTML sin usar WebSocket.
 * La comunicación inicial por HTTP es una base esencial para construir el CLI más avanzado en el próximo módulo.
 */
