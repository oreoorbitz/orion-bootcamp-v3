/**
 * MÓDULO 23: HOT RELOAD CON WEBSOCKETS (HTML + JS)

 * 🧠 Concepto clave:
 * En entornos modernos como Vite, es común que la vista del navegador se actualice automáticamente
 * cuando se editan archivos del proyecto. Esta funcionalidad se llama **hot reload**.

 * Para lograr esto, usaremos **WebSockets**, una forma de comunicación en tiempo real entre el servidor
 * y el navegador. Así, cuando cambies un archivo, el servidor puede enviar una señal y el navegador
 * recargará automáticamente.

 * A partir de este módulo, todos tus ejercicios deben incluir una carpeta `assets/`:
 * - Todos los archivos `.ts` y `.js` que sean parte del frontend deben ir dentro de `assets/`.
 * - Solo los cambios en esa carpeta activarán el hot reload en el navegador.
 * - Los archivos como `hotreload.ts` también deben ir en `assets/`, pero puedes ignorarlos durante la compilación final.

 *
 * 🎯 Objetivo:
 * Crear un sistema de hot reload que:
 * - Observe cambios en `assets/`
 * - Envíe una señal por WebSocket
 * - El navegador recargue automáticamente

 *
 * ✅ Instrucciones:

 * 1. Crea un archivo `assets/hotreload.ts`. Este archivo se inyectará como `<script>` en tus HTML.
 *    Su contenido debe conectarse al servidor WebSocket:

 * ```ts
 * const socket = new WebSocket("ws://localhost:3001");

 * socket.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   if (data.type === "reload") {
 *     window.location.reload();
 *   }
 * };
 * ```

 * 2. Transpílalo a JavaScript como lo hiciste en módulos anteriores.
 *    Puedes guardarlo como `assets/hotreload.js` o inlinearlo directamente con tu helper.

 * 3. Inyecta este script al final del `<body>` usando tu función que agrega scripts inline.

 *
 * 4. En tu archivo `wsServer.ts`, crea un servidor WebSocket que guarde una lista de conexiones abiertas:

 * ```ts
 * import { serve } from "https://deno.land/std/http/server.ts";

 * const clients = new Set<WebSocket>();

 * Deno.serve({ port: 3001 }, (req) => {
 *   const { socket, response } = Deno.upgradeWebSocket(req);
 *   socket.onopen = () => clients.add(socket);
 *   socket.onclose = () => clients.delete(socket);
 *   return response;
 * });

 * export function notificarReload() {
 *   for (const client of clients) {
 *     client.send(JSON.stringify({ type: "reload" }));
 *   }
 * }
 * ```

 * 5. En tu archivo `main.ts`, usa `Deno.watchFs()` para observar **solamente** la carpeta `assets/`.
 *    Cada vez que un archivo se edite dentro de esa carpeta:
 *    - Recompila el HTML o JS si es necesario
 *    - Llama a `notificarReload()` para avisar al navegador

 *
 * ✅ Resultado esperado:
 * - Abres `localhost:3000` y ves tu HTML
 * - Editas `assets/main.ts` → se convierte a JS → se inyecta en el HTML → el navegador recarga automáticamente

 *
 * 🧩 Consejo:
 * - Recuerda que no todos los archivos `.ts` deben estar en `assets/`. Solo los que van a ser usados en el navegador.
 * - Evita que archivos como `server.ts`, `main.ts`, o `wsServer.ts` estén en esa carpeta.

 *
 * 💡 ¿Qué estás aprendiendo aquí?
 * - A usar WebSockets en proyectos reales
 * - A observar archivos con Deno
 * - A conectar cambios en archivos con recarga automática
 * - A separar el entorno de desarrollo (assets) del entorno de servidor

 */
