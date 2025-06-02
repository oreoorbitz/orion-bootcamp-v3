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
 * 6. Cada vez que un archivo observado cambie, envía un mensaje al servidor como:
 *
 * ```ts
 * { type: 'change', file: 'path/a/archivo.liquid' }
 * ```
 *
 * para que el navegador se actualice.
 *
 * 📁 Estructura esperada:
 * En la carpeta donde se ejecuta `Mockify`, debe existir:
 *
 * ```
 * .
 * ├── assets/
 * ├── content_for_index.liquid
 * ├── theme.liquid
 * └── dist/
 * ```
 *
 * 🧠 Importante: ¿Quién hace qué?
 *
 * A partir de este módulo, usarás `mockify.ts` para observar archivos y comunicarte con el servidor.
 *
 * Pero la generación del HTML y la lógica de transformación siguen estando en tu archivo `main.ts`:
 *
 * - `Mockify` no ejecuta `main.ts`
 * - Tú debes seguir ejecutando `main.ts` por separado (por ejemplo con `deno run --allow-all main.ts`)
 * - En el siguiente módulo empezarás a mover más responsabilidades fuera de `main.ts`
 *
 * 🎯 En resumen:
 * - `Mockify` observa cambios y los notifica
 * - `main.ts` es el responsable de generar el HTML
 * - El servidor recarga el navegador cuando recibe los avisos
 *
 * Este patrón te ayuda a dividir responsabilidades de manera progresiva, como en un entorno de desarrollo profesional.
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
