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
 * 2. En `server/hotreload.ts`, puedes escribir un código similar a:
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
 * 3. Transpila este archivo usando el nuevo sistema de Deno:
 *
 * Deno ya no incluye `Deno.emit()` de forma estable. Ahora debes usar la librería externa `emit`:
 *
 * ```ts
 * import { transpile } from "https://deno.land/x/emit/mod.ts";
 *
 * const url = new URL("../server/hotreload.ts", import.meta.url);
 * const result = await transpile(url);
 *
 * const jsCode = result.get(url.href); // Esto es un string con el JS generado
 * ```
 *
 * Luego, **usa tu función `injector()` del Módulo 22 para inyectar el resultado JS** en tu HTML.
 *
 * ⚠️ Importante:
 * - Primero debes generar tu HTML desde Liquid
 * - Solo después, debes inyectar el script de hot reload
 *
 * ```ts
 * import { injector } from "../injector.ts";
 * import { transpile } from "https://deno.land/x/emit/mod.ts";
 *
 * await generarHTML(); // tu propia lógica de compilación de plantillas
 *
 * const url = new URL("../server/hotreload.ts", import.meta.url);
 * const result = await transpile(url);
 * const jsCode = result.get(url.href);
 *
 * if (jsCode) {
 *   await injector(jsCode, "index.html");
 * }
 * ```
 *
 * 4. En tu archivo `server/wsServer.ts`, crea un servidor WebSocket que mantenga la lista de conexiones abiertas
 * con un código similar a este:
 *
 * ```ts
 * import { serve } from "https://deno.land/std/http/server.ts";
 *
 * const clients = new Set<WebSocket>();
 *
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
 *    - Transpila el JS necesario
 *    - Usa `injector()` para insertarlo
 *    - Llama a `notificarReload()` para que el navegador recargue
 *    -IMPORTANTE: frontend.ts sólo se crea en esta carpeta, en los siguientes ejercicios no es necesario hacerlo.
 *
 * ✅ Resultado esperado:
 * - Abres `localhost:3000` y ves tu HTML generado desde Liquid
 * - Editas `templates/content_for_index.liquid` u otro archivo de plantilla
 * - Se vuelve a generar el HTML
 * - Se inyecta el script JS con tu función `injector()`
 * - El navegador recarga automáticamente gracias al WebSocket
 *
 * 🧩 Consejo:
 * - Asegúrate de mantener el orden correcto:
 *   1. Compilas las plantillas Liquid
 *   2. Transpilas `server/hotreload.ts`
 *   3. Inyectas el JS con `injector()`
 *   4. El navegador recarga por WebSocket
 *
 * 💡 ¿Qué estás aprendiendo aquí?
 * - A usar WebSockets en proyectos reales
 * - A observar archivos con Deno
 * - A trabajar con la nueva API `transpile()` de Deno
 * - A automatizar tu flujo de desarrollo con recarga en vivo
 * - A separar responsabilidades entre servidor (`server/`) y HTML generado
 */
