/**
 * MÓDULO 23: SISTEMA DE HOT RELOAD CON WEBSOCKETS

 * 🧠 Concepto clave:
 * Hasta ahora, has construido un flujo unidireccional: los datos se transforman en HTML, y luego el navegador muestra el resultado.
 * Pero en la mayoría de herramientas modernas (como Vite, Next.js o Astro), existe algo llamado **Hot Reload**.

 * El Hot Reload se basa en una idea simple:
 * - Cuando modificas un archivo (plantilla, datos, CSS, etc.), no tienes que recargar manualmente la página.
 * - En cambio, el navegador **escucha** a tu servidor usando un canal WebSocket y espera instrucciones.
 * - Cuando hay un cambio, el servidor **emite un mensaje** por WebSocket, y el navegador actualiza el contenido automáticamente.

 * Esta es la base de un sistema de **two-way data binding** moderno:
 * - El backend puede enviar instrucciones al frontend (vía WebSocket)
 * - El frontend puede recibirlas y modificar lo que el usuario ve sin recargar

 *
 * 🎯 Objetivo:
 * Establecer una conexión WebSocket entre el navegador y tu servidor para implementar Hot Reload básico.

 *
 * ✅ Instrucciones:

 * 1. Agrega a tu archivo `main.ts` (o el que genera el HTML) el siguiente flujo:
 *    - Transpila un archivo `hotreload.ts` que abrirá un WebSocket desde el navegador
 *    - Inyecta el contenido de `hotreload.js` al HTML como `<script>` inline (como hiciste en el módulo anterior)

 * Contenido sugerido para `hotreload.ts`:
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
 * 2. Crea un servidor WebSocket en otro archivo (por ejemplo `wsServer.ts`) usando Deno:
 * ```ts
 * import { serve } from "https://deno.land/std/http/server.ts";
 * import { acceptWebSocket } from "https://deno.land/std/ws/mod.ts";

 * const clients: WebSocket[] = [];

 * serve(async (req) => {
 *   const { socket, response } = Deno.upgradeWebSocket(req);
 *   socket.onopen = () => clients.push(socket);
 *   req.respondWith(response);
 * }, { port: 3001 });

 * export function notificarReload() {
 *   for (const client of clients) {
 *     client.send(JSON.stringify({ type: "reload" }));
 *   }
 * }
 * ```

 *
 * 3. Modifica tu sistema de generación de archivos (`main.ts`) para que cada vez que generes nuevo HTML o CSS:
 *    - llames a `notificarReload()` del servidor WebSocket (puedes importarlo o hacer una llamada `fetch`)

 *
 * ✅ Resultado esperado:
 * - Tu HTML generado tendrá un script inline que se conecta al WebSocket
 * - Si actualizas datos, plantillas o el código TypeScript y regeneras el HTML,
 *   el navegador se actualiza automáticamente sin recargar manualmente

 *
 * 🧪 Consejo:
 * - Usa `Deno.watchFs()` para observar cambios en tus archivos y disparar recompilaciones + reload
 * - En el futuro podrías mejorar este sistema para hacer solo "partial reload" de secciones específicas

 *
 * 🧠 ¿Qué estás aprendiendo aquí?
 * - Qué es un WebSocket: un canal de comunicación bidireccional en tiempo real
 * - Cómo se conecta el navegador a un WebSocket
 * - Cómo un servidor puede enviar instrucciones al cliente
 * - Cómo simular un sistema de desarrollo moderno sin librerías externas

 */
