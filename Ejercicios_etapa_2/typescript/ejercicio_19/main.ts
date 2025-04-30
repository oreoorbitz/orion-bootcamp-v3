/**
 * MÓDULO 19: IMPLEMENTAR HOT RELOAD PARA EL SERVIDOR LOCAL USANDO WEBSOCKETS
 *
 * 🧠 Concepto clave:
 * Cuando estás desarrollando un sitio web, es molesto tener que refrescar manualmente el navegador cada vez que cambias un dato o plantilla.
 * Para mejorar la experiencia de desarrollo, se usa una técnica llamada **hot reload**:
 * - El sistema detecta que un archivo cambió
 * - Regenera automáticamente el HTML
 * - Recarga el navegador sin que el usuario haga nada
 *
 * Para lograr esto, usaremos **WebSockets**.
 *
 * 🚨 ¿Qué es un WebSocket?
 * - Es una conexión bidireccional y persistente entre el navegador y el servidor.
 * - A diferencia del protocolo HTTP, donde el cliente hace peticiones y el servidor responde,
 *   con WebSockets el servidor puede **enviar mensajes en cualquier momento** al cliente.
 * - Esto lo hace ideal para **notificaciones en tiempo real**, como el hot reload.
 *
 * 📘 API de WebSocket en JavaScript (lado del navegador):
 * ```js
 * const ws = new WebSocket("ws://localhost:3000/ws");
 * ws.onmessage = (event) => {
 *   if (event.data === "reload") {
 *     window.location.reload();
 *   }
 * };
 * ```
 * En este código, el navegador se conecta a `/ws` y espera mensajes del servidor.
 * Cuando recibe `"reload"`, recarga la página automáticamente.
 *
 * 🎯 Objetivo:
 * 1. Incluir un `<script>` en tu HTML con un cliente WebSocket como el de arriba
 * 2. Modificar tu servidor local (`server.ts`) para aceptar conexiones WebSocket
 * 3. Crear un archivo `watcher.ts` que detecta cambios y notifica al navegador por WebSocket
 *
 * 📦 Estructura sugerida:
 * ```
 * /scripts/
 * /dist/
 * /theme.html
 * /data.ts
 * main.ts         ← genera HTML
 * server.ts       ← servidor + WebSocket
 * watcher.ts      ← vigila cambios y manda "reload"
 * ```
 *
 * ✅ Paso 1: Inyecta el script de WebSocket en tu HTML generado
 * Al final de tu `<body>`, agrega:
 * ```html
 * <script>
 *   const ws = new WebSocket("ws://" + location.host + "/ws");
 *   ws.onmessage = (event) => {
 *     if (event.data === "reload") {
 *       window.location.reload();
 *     }
 *   };
 * </script>
 * ```
 * Esto mantiene una conexión abierta con el servidor, lista para recibir notificaciones.
 *
 * ✅ Paso 2: Implementa WebSocket en el servidor (`server.ts`)
 * Usa `Deno.upgradeWebSocket(req)` para aceptar conexiones WebSocket:
 * ```ts
 * const sockets: WebSocket[] = [];

 * Deno.serve({ port: 3000 }, async (req) => {
 *   const { pathname } = new URL(req.url);
 *   if (pathname === "/ws") {
 *     const { socket, response } = Deno.upgradeWebSocket(req);
 *     socket.onopen = () => sockets.push(socket);
 *     return response;
 *   }

 *   const filePath = pathname === "/" ? "/index.html" : pathname;
 *   try {
 *     const html = await Deno.readTextFile(`./dist${filePath}`);
 *     return new Response(html, { headers: { "Content-Type": "text/html" } });
 *   } catch {
 *     return new Response("404 - No encontrado", { status: 404 });
 *   }
 * });
 *
 * export function notificarReload() {
 *   for (const ws of sockets) ws.send("reload");
 * }
 * ```
 *
 * ✅ Paso 3: Implementa el watcher (`watcher.ts`)
 * Este archivo observará archivos clave como `data.ts`, `theme.html`, etc.
 * Cuando detecte un cambio:
 * 1. Ejecuta el generador (`main.ts`)
 * 2. Llama a `notificarReload()` para decirle al navegador que se recargue
 *
 * Ejemplo:
 * ```ts
 * import { notificarReload } from "./server.ts";

 * const watcher = Deno.watchFs(["data.ts", "theme.html", "scripts/"]);
 * for await (const _event of watcher) {
 *   const p = new Deno.Command("deno", {
 *     args: ["run", "--allow-all", "main.ts"],
 *   });
 *   await p.output();

 *   notificarReload();
 * }
 * ```
 *
 * ✅ Resultado esperado:
 * - Abres tu navegador en http://localhost:3000
 * - Editas `data.ts` o `theme.html`
 * - El servidor regenera `dist/index.html`
 * - El navegador recibe un mensaje `"reload"` y se actualiza solo
 *
 * Consejo:
 * - Usa `deno task` o dos terminales: una para `deno run server.ts`, otra para `deno run watcher.ts`
 * - Este patrón es el núcleo de herramientas como Vite, Next.js, y Astro
 *
 * Este módulo refuerza cómo funciona la comunicación tiempo real, la separación de responsabilidades (servidor vs generador),
 * y cómo crear una experiencia fluida para el desarrollo web.
 */
