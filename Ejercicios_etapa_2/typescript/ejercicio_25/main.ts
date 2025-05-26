/**
 * MÓDULO 25: CLI Mockify y conexión con servidor local
 *
 * 🧠 Concepto clave:
 * En entornos profesionales como Shopify, los desarrolladores usan una interfaz de línea de comandos (CLI)
 * para iniciar un servidor, observar archivos, generar plantillas, y ver una vista previa del sitio.
 *
 * En este módulo, vas a crear tu propia CLI llamada `Mockify` para simular este flujo de desarrollo:
 * - Validar la estructura de carpetas esperada
 * - Observar archivos importantes para cambios
 * - Recibir desde el servidor una URL local y mostrarla en consola
 * - Crear comunicación de dos vías entre CLI y servidor
 *
 * 🎯 Objetivo:
 * Implementar una CLI usable como:
 *
 * ```
 * deno run --allow-all ../mockify.ts theme dev
 * ```
 *
 * que:
 * - Valide que el directorio actual tiene la estructura esperada
 * - Se conecte a un servidor local que genere los archivos
 * - Escuche cambios en archivos dentro de `./assets` y `.liquid`
 * - Muestre una salida en consola similar a Shopify CLI:
 *
 * ```
 * ╭─ success ─────────────────────────────────────────────────────────────╮
 * │                                                                       │
 * │  Preview your theme (t)                                               │
 * │    • http://127.0.0.1:9292                                            │
 * ╰───────────────────────────────────────────────────────────────────────╯
 * ```
 *
 * 🧩 Estructura esperada:
 * En la carpeta actual donde se corre `Mockify`, debe existir:
 *
 * ```
 * .
 * ├── assets/
 * │   └── theme.css
 * ├── content_for_index.liquid
 * ├── theme.liquid
 * └── templates/
 *     ├── product.liquid
 *     └── collection.liquid
 * ```
 *
 * ✅ Instrucciones:
 *
 * 1. Crea un archivo `mockify.ts` en el directorio superior (`Ejercicios_etapa_2/typescript/`).
 *
 * 2. Implementa una función que valide que el directorio actual contenga:
 *    - Una carpeta `assets/`
 *    - Un archivo `content_for_index.liquid`
 *    - Un archivo `theme.liquid`
 *    - Una carpeta `templates/` con los archivos:
 *      - `product.liquid`
 *      - `collection.liquid`
 *
 * 3. Usa `Deno.watchFs()` para observar cambios en:
 *    - Archivos dentro de `assets/`
 *    - `content_for_index.liquid`
 *    - `theme.liquid`
 *    - Archivos dentro de `templates/`
 *
 * 4. Usa `Deno.args` para verificar si el comando recibido es:
 *
 * ```
 * theme dev
 * ```
 * y toma la carpeta actual como contexto.
 *
 * 5. Conéctate al servidor a través de WebSocket.
 *    - Cuando el servidor esté listo, debe enviarte una URL como:
 *      `{ type: "ready", url: "http://127.0.0.1:9292" }`
 *    - Muestra esa información con formato decorado en consola como el ejemplo superior.
 *
 * 6. Cada vez que un archivo observado cambie, envía un mensaje al servidor para volver a renderizar.
 *
 * 📁 Estructura sugerida:
 *
 * ```
 * /Ejercicios_etapa_2/
 * ├── mockify.ts          ← CLI que puedes correr desde un ejercicio con:
 * │                         `deno run --allow-all ../mockify.ts theme dev`
 * ├── ejercicio_25/
 * │   ├── assets/
 * │   │   └── theme.css
 * │   ├── content_for_index.liquid
 * │   ├── theme.liquid
 * │   └── templates/
 * │       ├── product.liquid
 * │       └── collection.liquid
 * ```
 *
 * 🧭 Importante:
 * Si prefieres correr el comando directamente como `Mockify theme dev`, puedes añadir el directorio
 * donde está `mockify.ts` a tu `PATH` del sistema. Esto depende de tu sistema operativo:
 *
 * - En Linux/Mac: edita tu `.bashrc`, `.zshrc`, o `.bash_profile`
 * - En Windows: usa la configuración del sistema para añadir el directorio al PATH
 *
 * Este paso es completamente opcional, pero facilita mucho el uso de tu CLI personalizada.
 *
 * 🎯 Consejo:
 * - Puedes usar `console.log` con estilos Unicode o ASCII para mostrar bloques decorados
 * - Define la interfaz de comunicación con el servidor:
 *    - El cliente (CLI) envía: `{ type: 'change', file: 'path/to/file' }`
 *    - El servidor responde: `{ type: 'ready', url: 'http://127.0.0.1:9292' }`
 *
 * 🔁 Recomendación:
 * Usa este módulo como punto de partida para un flujo de desarrollo completo donde la consola,
 * el servidor, y los archivos trabajan sincronizados.
 */
