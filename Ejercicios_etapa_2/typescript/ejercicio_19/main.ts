/**
 * MÓDULO 19: MODULARIZACIÓN DEL SERVIDOR LOCAL (slightlyLate)
 *
 * 🧠 Concepto clave:
 * En proyectos reales, no escribimos un servidor desde cero cada vez. 
 * Usamos bibliotecas como **Express** (Node.js) o **Oak** (Deno) que encapsulan toda la lógica de servidor
 * en funciones reutilizables y fáciles de mantener.

 * En este módulo, vas a **extraer tu servidor a un módulo reutilizable** que te servirá para los siguientes ejercicios.

 * 🎯 Objetivo:
 * Crear un módulo llamado `slightlyLate.ts` que pueda iniciar un servidor básico y servir archivos HTML desde la carpeta `dist/`.

 * ✅ Instrucciones:
 * 1. Crea un archivo llamado `slightlyLate.ts` en la carpeta raíz de esta parte del curso (por ejemplo, en `Ejercicios_etapa_2/`)
 * 
 * 2. En este archivo, exporta una función llamada `iniciarServidor`, que reciba un puerto como parámetro:
 *    ```ts
 *    export function iniciarServidor(puerto: number = 3000) {
 *      Deno.serve({ port: puerto }, async (req) => {
 *        const url = new URL(req.url);
 *        const path = url.pathname === "/" ? "/index.html" : url.pathname;
 *        try {
 *          const archivo = await Deno.readTextFile(`dist${path}`);
 *          return new Response(archivo, {
 *            headers: { "Content-Type": "text/html" }
 *          });
 *        } catch {
 *          return new Response("404 - Página no encontrada", { status: 404 });
 *        }
 *      });
 *    }
 *    ```

 * 3. En tu archivo `server.ts`, importa esta función:
 *    ```ts
 *    import { iniciarServidor } from "../slightlyLate.ts";
 *    iniciarServidor(3000);
 *    ```

 * 4. Corre el servidor con los mismos permisos que antes:
 *    ```bash
 *    deno run --allow-net --allow-read ejercicio_19/server.ts
 *    ```

 * ✅ Consejo:
 * - En el mundo real, Express (Node.js) o Oak (Deno) encapsulan este tipo de lógica.
 * - Aquí estás simulando ese tipo de abstracción para entender cómo funcionan estos módulos internamente.

 * 🧪 Bonus:
 * Puedes mejorar tu módulo para que detecte automáticamente el tipo MIME (`text/html`, `text/css`, etc.)
 * usando extensiones de archivo si quieres expandirlo.

 * Este módulo sienta las bases para reutilizar tu servidor de forma sencilla a medida que tus proyectos crecen.
 */
