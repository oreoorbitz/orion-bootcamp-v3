/**
 * 🧩 MÓDULO 26: Enviar archivos individuales por HTTP y recargar HTML o CSS automáticamente
 *
 * 🧠 Concepto clave:
 * A partir de este módulo, solo enviaremos al servidor **el archivo modificado**, en lugar de comprimir todo el tema.
 * Además, el servidor decidirá si debe regenerar el HTML completo o simplemente recargar los estilos.
 *
 * 🎯 Objetivo:
 * - Observar archivos del tema
 * - Enviar solo el archivo que cambió
 * - Reemplazar el archivo en el servidor
 * - Regenerar HTML solo si hace falta
 * - Notificar al navegador por WebSocket para hacer recarga automática
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu tema**
 *    - Asegúrate de que `typescript/ejercicio_26/` contenga:
 *      - `theme.liquid`
 *      - `content_for_index.liquid`
 *      - Carpeta `assets/` con un archivo `theme.css`
 *
 * 2. **En `main.ts`**
 *    - Usa `Deno.watchFs()` para observar cambios en:
 *      - `theme.liquid`
 *      - `content_for_index.liquid`
 *      - Archivos dentro de `assets/`
 *
 *    - Cuando detectes un cambio:
 *      - Lee el contenido del archivo modificado
 *      - Usa `FormData` para enviar:
 *        - El contenido del archivo como `Blob`
 *        - La ruta relativa del archivo como campo `"path"`
 *      - Envía una solicitud `POST` a `http://localhost:3000/theme-update`
 *      - Imprime en consola la respuesta del servidor
 *
 * 3. **En `controller.ts`**
 *    - Asegúrate de que `controller.ts` esté en `typescript/server/`
 *    - Llama a `iniciarServidor(3000, callback)` pasando un segundo argumento: una función callback
 *    - nota: puedes llamar tu funcion de 'callback' como quieras
 *
 *    - El callback debe recibir:
 *      - La ruta del archivo (`path`)
 *      - Su contenido como `Uint8Array`
 *
 *    - La función debe:
 *      - Escribir el archivo en `themes/dev/{path}`
 *      - Si el archivo termina en `.liquid`, regenerar `themes/dev/dist/index.html` y usar `injector()` para insertar `hotreload.ts`
 *      - Si el archivo termina en `.css`, no regenerar el HTML
 *
 *    - En todos los casos:
 *      - Importa `notificarClientes` desde `wsServer.ts`
 *      - Envía una señal WebSocket:
 *        - `{ type: "reload-css" }` si es `.css`
 *        - `{ type: "reload" }` si es cualquier otro archivo
 *
 * 4. **En `slightlyLate.ts`**
 *    - Crea una ruta `POST /theme-update`
 *    - Dentro de esa ruta:
 *      - Llama a `await request.formData()` para extraer:
 *        - `"path"` (la ruta relativa)
 *        - `"file"` (el archivo como `Blob`)
 *      - Convierte el `Blob` en `Uint8Array`
 *      - Llama al callback recibido desde `controller.ts` pasando `path` y el contenido
 *      - Devuelve una respuesta textual confirmando que se procesó exitosamente
 *
 * 5. **Verifica tu configuración de hot reload**
 *    - Asegúrate de tener estos módulos dentro de `server/`:
 *      - `hotreload.ts`: el script que se inyecta en el HTML
 *      - `wsServer.ts`: contiene la función `notificarClientes()` y gestiona los WebSockets
 *
 *    - Ya debes haber implementado en `hotreload.ts` lo siguiente:
 *      - Si recibe `{ type: "reload" }`, se recarga toda la página (`window.location.reload()`)
 *      - Si recibe `{ type: "reload-css" }`, actualiza el `href` de `<link rel="stylesheet">` usando una marca de tiempo (`Date.now()`)
 *
 * 🧪 Prueba:
 * - Ejecuta el servidor con:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - Ejecuta el cliente:
 *   ```bash
 *   deno run --allow-all typescript/ejercicio_26/main.ts
 *   ```
 * - Abre tu navegador en `localhost:3000`
 * - Edita:
 *   - `theme.liquid` → debe regenerar `index.html` y recargar la página
 *   - `theme.css` → debe actualizarse el estilo sin recargar la página
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
 * │       ├── wsServer.ts
 * │       ├── hotreload.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── theme.liquid
 * │               ├── content_for_index.liquid
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 *
 * 🎯 Resultado esperado:
 * - Detectas qué archivo cambió
 * - Solo envías ese archivo al servidor
 * - Se actualiza la carpeta del tema
 * - Se recarga el navegador automáticamente según el tipo de archivo
 * - Mantienes el sistema modular y profesional como en entornos reales
 */
