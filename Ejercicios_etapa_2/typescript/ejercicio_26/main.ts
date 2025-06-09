/**
 * 🧩 MÓDULO 26: Enviar archivos individuales por HTTP y recargar HTML o CSS automáticamente
 *
 * 🧠 Concepto clave:
 * En este módulo, vas a comenzar a enviar archivos reales desde el navegador al servidor. 
 * Cuando un archivo cambie, se comprimirá individualmente, se enviará por HTTP, y el servidor decidirá si 
 * necesita regenerar el HTML o simplemente actualizar los estilos.
 *
 * 🎯 Objetivo:
 * - Observar archivos en `layout/`, `templates/` y `assets/`
 * - Comprimir solo el archivo que cambió
 * - Enviarlo al servidor como ZIP junto con su nombre y carpeta
 * - El servidor lo descomprime en la carpeta correspondiente
 * - Si es `.liquid`, se regenera `index.html` y se inyecta el script de hot reload
 * - Si es `.css`, se actualiza sin recargar la página
 *
 * ✅ Instrucciones:
 *
 * 1. **Reestructura tu tema**
 *    A partir de ahora, tu carpeta de ejercicio (`typescript/ejercicio_26/`) debe contener:
 *    - Una carpeta `layout/` con `theme.liquid`
 *    - Una carpeta `templates/` con `content_for_index.liquid`
 *    - Una carpeta `assets/` con `theme.css` (u otros recursos)
 *
 *    Si tienes archivos sueltos, muévelos a estas carpetas.
 *
 * 2. **En `main.ts`**
 *    - Observa cambios con `Deno.watchFs()` en:
 *      - `layout/`
 *      - `templates/`
 *      - `assets/`
 *
 *    - Cuando detectes un cambio:
 *      - Comprime **solo el archivo modificado** usando `zip` desde:
 *        ```ts
 *        import { zip } from "jsr:@deno-library/compress";
 *        ```
 *      - Crea un `FormData` y adjunta:
 *        - El archivo ZIP
 *        - El nombre del archivo (ej. `theme.liquid`) 
 *        - El nombre de la carpeta (`layout`, `templates`, `assets`)
 *      - Envía la solicitud `POST` a `http://localhost:3000/theme-update`
 *      - Imprime la respuesta del servidor
 *
 * 3. **En `controller.ts`**
 *    - Asegúrate de que `controller.ts` esté en `typescript/server/`
 *    - Llama a `iniciarServidor(3000, callback)` pasando una función `callback` como segundo argumento
 *
 *    - Dentro de tu `callback`, llama a tu funcion para para regenerar el HTML desde los archivos de liquid
 *
 * 4. **En `slightlyLate.ts`**
 *    - Crea la ruta `POST /theme-update`
 *    - Dentro de ella:
 *      - Usa `await req.formData()` para extraer:
 *        - el ZIP enviado
 *        - el nombre del archivo original
 *        - el nombre de la carpeta destino
 *      - Descomprime el ZIP recibido usando `zip.uncompress()` desde el mismo módulo que usaste para comprimir
 *      - Escribe el archivo descomprimido en la carpeta correspondiente
 *      - Llama el callback para generar el HTML desde los archivos liquid generados en el servidor
 *
 * 5. **Inyecta el script de hot reload**
 *    - En tu función de generación de HTML, usa `injector()` para inyectar el script de `hotreload.ts` en el HTML generado.
 *
 * 🧪 Prueba:
 * - Ejecuta el servidor con:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - En otra terminal, ejecuta el cliente con:
 *   ```bash
 *   deno run --allow-all typescript/ejercicio_26/main.ts
 *   ```
 * - Abre `localhost:3000` en el navegador
 * - Cambia:
 *   - `layout/theme.liquid` → debe regenerar `index.html` y recargar la página
 *   - `assets/theme.css` → debe recargar solo los estilos sin recargar la página
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_26/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── slightlyLate.ts
 * │       ├── hotreload.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 *
 * 🎯 Resultado esperado:
 * - Detectas qué archivo cambió
 * - Comprimís y enviás solo ese archivo al servidor
 * - El servidor lo coloca en la carpeta adecuada y regenera si es necesario
 * - El navegador se actualiza automáticamente según el tipo de archivo
 * - Mantenés una estructura profesional, moderna y escalable
 */
