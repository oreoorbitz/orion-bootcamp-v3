/**
 * MÓDULO 25: CLI Mockify y conexión con servidor local
 *
 * 🧠 Concepto clave:
 * En entornos profesionales como Shopify, los desarrolladores usan una interfaz de línea de comandos (CLI)
 * para iniciar un servidor, observar archivos, generar plantillas y ver una vista previa del sitio.
 *
 * En este módulo, vas a crear tu propia CLI llamada `Mockify` para simular parte de ese flujo:
 * - Validar la estructura de carpetas esperada
 * - Observar archivos importantes para cambios
 * - Comunicarse con un servidor WebSocket para notificar cambios
 * - Ejecutar `main.ts` automáticamente cada vez que se detecten cambios
 *
 * 🎯 Objetivo:
 * Implementar una CLI usable como:
 *
 * ```
 * deno run --allow-all ../mockify.ts theme dev
 * ```
 *
 * que:
 * - Valide que el directorio actual tenga la estructura esperada
 * - Observe cambios en archivos `.liquid` o dentro de `assets/`
 * - Envíe notificaciones al servidor WebSocket
 * - Ejecute `main.ts` automáticamente para regenerar el HTML
 * - Reciba una URL para previsualizar la tienda y la muestre en consola
 *
 * ✅ Instrucciones:
 *
 * 1. Crea un archivo `mockify.ts` en el directorio superior (`Ejercicios_etapa_2/`).
 *
 * 2. Implementa una función que valide que el directorio actual tenga:
 *    - Una carpeta `assets/`
 *    - Un archivo `content_for_index.liquid`
 *    - Un archivo `theme.liquid`
 *    - Un archivo `main.ts`
 *
 * 3. Usa `Deno.watchFs()` para escuchar cambios en:
 *    - Todos los archivos dentro de `assets/`
 *    - `content_for_index.liquid`
 *    - `theme.liquid`
 *
 * 4. Usa `Deno.args` para verificar si el comando recibido es:
 *
 * ```
 * theme dev
 * ```
 *
 * y toma la carpeta actual como contexto.
 *
 * 5. Conéctate al servidor a través de WebSocket.
 *    - Cuando el servidor esté listo, debe enviarte un mensaje como:
 *      `{ type: "ready", url: "http://127.0.0.1:9292" }`
 *    - Muestra esa URL con un formato decorado como:
 *
 * ```
 * ╭─ success ─────────────────────────────────────────────╮
 * │                                                      │
 * │  Preview your theme (t)                              │
 * │    • http://127.0.0.1:9292                           │
 * ╰──────────────────────────────────────────────────────╯
 * ```
 *
 * 6. Cada vez que un archivo observado cambie:
 *    - Si es un archivo `.css`, envía al servidor:
 *
 * ```ts
 * { type: "reload-css" }
 * ```
 *
 *    - Si es un archivo `.liquid`, ejecuta automáticamente `main.ts` usando una ruta absoluta:
 *
 * ```ts
 * const rutaMain = new URL("./main.ts", `file://${Deno.cwd()}/`).href;
 * const comando = new Deno.Command("deno", {
 *   args: ["run", "--allow-all", rutaMain],
 * });
 * await comando.output();
 * ```
 *
 *    - Luego, envía al servidor:
 *
 * ```ts
 * { type: "reload" }
 * ```
 *
 * para que el navegador recargue.
 *
 * 🧠 Nota:
 * `Mockify` ejecuta `main.ts` como un proceso aparte con Deno. No necesitas importarlo ni modificar rutas.
 * Al usar `new URL(..., import.meta.url).href` o `file://${Deno.cwd()}`, obtienes una ruta absoluta robusta.
 *
 * 📁 Estructura esperada:
 * En la carpeta donde se ejecuta `Mockify`, debe existir:
 *
 * ```
 * .
 * ├── assets/
 * ├── content_for_index.liquid
 * ├── theme.liquid
 * ├── main.ts
 * └── dist/
 * ```
 *
 * 🧠 ¿Quién hace qué?
 *
 * A partir de este módulo:
 *
 * - `Mockify` se encarga de observar archivos, ejecutar `main.ts` y comunicarse con el servidor.
 * - `main.ts` sigue siendo responsable de generar el HTML e inyectar el script de recarga.
 *
 * En módulos futuros, `main.ts` irá perdiendo responsabilidades hasta desaparecer,
 * y el servidor o el CLI se harán cargo por completo.
 *
 * 🧭 Consejo:
 * Si quieres correr el comando como `Mockify theme dev` directamente,
 * puedes añadir el directorio donde está `mockify.ts` a tu `PATH` del sistema.
 *
 * Esto es opcional pero útil para imitar el flujo de trabajo de herramientas reales.
 *
 * 🔁 Recomendación:
 * Usa este módulo como base para un entorno de desarrollo donde consola, servidor,
 * navegador y archivos estén conectados y reaccionen en tiempo real.
 */
