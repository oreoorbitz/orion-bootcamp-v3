/**
 * 🧩 MÓDULO 26: Enviar archivos individuales por HTTP y regenerar HTML desde el servidor
 *
 * 🧠 Concepto clave:
 * Simulamos cómo una herramienta como Shopify CLI detecta cambios en archivos y sincroniza
 * solo los que han sido modificados. Esto mejora la eficiencia y permite recargar dinámicamente el HTML.
 *
 * 🎯 Objetivo:
 * Detectar cambios en archivos del tema, enviar el archivo modificado al servidor vía HTTP,
 * y hacer que el servidor lo guarde y regenere el HTML.
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
 *    - Implementa `Deno.watchFs()` para observar:
 *      - `theme.liquid`
 *      - `content_for_index.liquid`
 *      - Todos los archivos dentro de `assets/`
 *
 *    - Cuando se detecte un cambio:
 *      - Usa `FormData` y adjunta el archivo modificado como un `Blob`.
 *      - Incluye también su ruta relativa original, usando `formData.append("path", "assets/theme.css")`, por ejemplo.
 *      - Envía la solicitud `POST` a `http://localhost:3000/theme-update`.
 *      - Imprime en consola la respuesta del servidor.
 *
 * 3. **En `controller.ts`:**
 *    - Asegúrate de que `controller.ts` se encuentre en `typescript/server/`.
 *    - Actualiza tu llamada a `iniciarServidor()` para aceptar un segundo argumento: un callback.
 *
 *    - El callback debe:
 *      - Recibir la ruta relativa y el contenido del archivo modificado.
 *      - Escribir el archivo en la ruta correspondiente dentro de `themes/dev/`.
 *      - Si el archivo es un `.liquid`, regenerar el HTML (`themes/dev/dist/index.html`).
 *      - Si el archivo es un `.css`, no es necesario regenerar, pero puede imprimirse en consola el cambio.
 *      - Inyectar `hotreload.ts` si se regenera HTML.
 *
 * 4. **En `slightlyLate.ts`:**
 *    - Crea una nueva ruta `POST /theme-update` utilizando el objeto `Request`.
 *
 *    - Dentro de esa ruta:
 *      - Usa `await request.formData()` para obtener:
 *        - El archivo modificado (`formData.get("file")`)
 *        - La ruta donde debe guardarse (`formData.get("path")`)
 *      - Convierte el archivo a `Uint8Array` y guárdalo en `themes/dev/` usando la ruta proporcionada.
 *      - Llama al callback del `controller.ts`, pasándole:
 *        - La ruta relativa
 *        - El contenido del archivo
 *      - Devuelve una respuesta textual confirmando la actualización.
 *
 * 🧪 Prueba:
 * - Abre una terminal y ejecuta:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - En otra terminal, ejecuta:
 *   ```bash
 *   deno run --allow-all typescript/ejercicio_26/main.ts
 *   ```
 * - Modifica `theme.liquid`, `content_for_index.liquid` o un archivo en `assets/`
 * - Observa cómo:
 *   - Se envía solo el archivo cambiado
 *   - Se guarda correctamente en el servidor
 *   - Se regenera el HTML solo si es necesario
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
 * Has implementado un flujo realista donde cada archivo se sincroniza por separado con el servidor.
 * Esto permitirá en el futuro integrar hot reload completo y filtros específicos según el archivo que cambie.
 */
