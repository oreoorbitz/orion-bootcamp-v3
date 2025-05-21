/**
 * MÓDULO 34: Sincronización Inicial del Tema y Separación de Datos del Servidor

 * 🧠 Concepto clave:
 * En Shopify, los archivos del tema existen localmente mientras que los datos de configuración (como `settings_data.json`)
 * viven en los servidores de Shopify. El CLI (`shopify theme dev --store ...`) sube la versión local a Shopify,
 * donde luego los editores visuales modifican la configuración desde la interfaz web.

 * Vamos a replicar este patrón:
 * - El estudiante tendrá una carpeta `config/` dentro del tema (como base local)
 * - Al iniciar el servidor, el módulo `Mockify` enviará esa configuración al servidor
 * - El servidor la copiará dentro de su espacio dedicado a la tienda (`server/[store]/config/`)
 * - A partir de ahí, el lado del servidor mantendrá una copia independiente, como lo haría Shopify

 * ✅ Objetivo:
 * - Separar el tema y los datos de tienda para simular la arquitectura real de Shopify
 * - Establecer una sincronización inicial del `config/` local al servidor
 * - Desacoplar futuras modificaciones para que solo ocurran del lado del servidor

 * 📁 Estructura esperada:
 * ```
 * .
 * ├── ejercicio_34/
 * │   ├── assets/
 * │   ├── config/
 * │   │   ├── settings_schema.json       ← Local base
 * │   │   └── settings_data.json         ← Local base
 * │   ├── sections/
 * │   ├── snippets/
 * │   ├── templates/
 * │   └── layouts/
 * │       └── theme.liquid
 * ├── server/
 * │   └── mystore.mymockify.com/
 * │       ├── db/
 * │       ├── config/
 * │       │   ├── settings_schema.json   ← Copia interna para edición
 * │       │   └── settings_data.json     ← Copia interna para edición
 * │       └── dist/
 * ├── Mapper.ts
 * └── Mockify.ts
 * ```

 * ✅ Instrucciones:

 * 1. **En la carpeta del tema (`ejercicio_34/`)**:
 *    - Crea una carpeta `config/` si aún no existe
 *    - Incluye los archivos:
 *      - `settings_schema.json`
 *      - `settings_data.json`
 *
 * 2. **En `Mockify.ts`**:
 *    - Verifica que `config/` exista y contenga los archivos requeridos
 *    - Lee su contenido y lo envía al módulo de servidor
 *    - Puedes hacer esto como parte del handshake WebSocket: `{ type: 'init', store, config }`

 * 3. **En el servidor (`slightlyLate`)**:
 *    - Al recibir el mensaje con `type: 'init'`, crea la carpeta `server/[store]/config/` si no existe
 *    - Copia los archivos recibidos desde `config/` del tema
 *    - A partir de este punto, cualquier modificación ocurre *solo del lado del servidor*

 * 🧠 Conceptualmente:
 * - Esto simula que el desarrollador subió su tema con `shopify theme dev`
 * - Y que a partir de ese momento, el comerciante empieza a modificar visualmente los valores

 * ✅ Consejo para futuras extensiones:
 * - Puedes luego crear una función `pullSettings()` que permita que el desarrollador *recupere* la configuración del servidor
 * - Esto simularía lo que haría un `shopify theme pull`

 * 🧩 Bonus:
 * - Asegúrate de que `Mapper.ts` ahora lea **desde la copia interna del servidor**
 *   (`server/[store]/config/`) para evitar usar datos desactualizados del lado del tema

 */
