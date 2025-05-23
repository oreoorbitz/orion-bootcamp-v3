/**
 * MÓDULO 23: HOT RELOAD CON WEBSOCKETS (HTML + JS)
 *
 * 🧠 Concepto clave:
 * En entornos modernos como Vite, es común que la vista del navegador se actualice automáticamente
 * cuando se editan archivos del proyecto. Esta funcionalidad se llama **hot reload**.
 *
 * Para lograr esto, usaremos **WebSockets**, una forma de comunicación en tiempo real entre el servidor
 * y el navegador. Así, cuando cambies un archivo, el servidor puede enviar una señal y el navegador
 * recargará automáticamente.
 *
 * 🎯 Objetivo:
 * Crear un sistema de hot reload que:
 * - Observe cambios en archivos relevantes (ej. frontend)
 * - Envíe una señal por WebSocket
 * - El navegador recargue automáticamente
 *
 * ✅ Instrucciones:
 *
 * 1. Crea una carpeta `server/` si aún no existe.
 *    - Mueve `slightlyLate.ts` a `server/slightlyLate.ts`
 *    - Crea un nuevo archivo: `server/hotreload.ts`. Este archivo será inyectado en el HTML final como `<script>`
 *
 * 2. En `server/hotreload.ts`, escribe el siguiente código:
 *
 * ```ts
 * const socket = new WebSocket("ws://localhost:3001");

 * socket.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   if (data.type === "reload") {
 *     window.location.reload();
 *   }
 * };
 * ```
 *
 * 3. Transpila este archivo y **usa tu función `injector` (del Módulo 22) para inyectarlo** en tu HTML final.
 *
 * ⚠️ Importante:
 * - Asegúrate de **primero generar tu HTML desde tus plantillas Liquid**
 * - Luego, **inyecta el script de hot reload usando `injector()`** después de esa generación
 *
 * ```ts
 * import { injector } from "../injector.ts";
 * ... To resto de logica para generar HTML desde liquid
 * await injector("server/hotreload.ts", "dist/index.html");
 * ```
 *
 * 4. En tu archivo `wsServer.ts`, crea un servidor WebSocket que mantenga la lista de conexiones abiertas:
 *
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
 *
 * 5. En tu archivo `main.ts`, usa `Deno.watchFs()` para observar los archivos que cambian.
 *    Cada vez que se edite un archivo que impacte tu frontend:
 *    - Vuelve a generar el HTML desde tus plantillas
 *    - Usa `injector()` para inyectar el JS
 *    - Llama a `notificarReload()` para que el navegador recargue
 *
 * ✅ Resultado esperado:
 * - Abres `localhost:3000` y ves tu HTML generado desde Liquid
 * - Editas `templates/content_for_index.liquid` o otro archivo de plantilla
 * - Se vuelve a generar el HTML
 * - Se inyecta el script JS con tu función `injector()`
 * - El navegador recarga automáticamente gracias al WebSocket
 *
 * 🧩 Consejo:
 * - Asegúrate de mantener el orden correcto:
 *   1. Compilas las plantillas Liquid
 *   2. Inyectas el script con `injector()`
 *   3. El navegador recarga por WebSocket
 *
 * 💡 ¿Qué estás aprendiendo aquí?
 * - A usar WebSockets en proyectos reales
 * - A observar archivos con Deno
 * - A automatizar tu flujo de desarrollo con recarga en vivo
 * - A separar responsabilidades entre servidor (`server/`) y HTML generado
 */
