/**
 * MÓDULO 25: Separación cliente-servidor y render desde el servidor
 *
 * 🧠 Concepto clave:
 * En Shopify, el servidor es responsable de generar vistas a partir de temas. El cliente (como una CLI)
 * solicita al servidor que regenere contenido, y el servidor responde con una vista actualizada.
 *
 * En este módulo vas a preparar esa separación:
 * - El archivo `main.ts` actuará como cliente.
 * - El servidor escuchará peticiones desde el cliente.
 * - Toda la lógica de renderizado se moverá a un archivo `controller.ts`.
 *
 * ✅ Objetivo:
 * - Separar la lógica de generación en el servidor (`controller.ts`)
 * - Simular una petición desde el cliente (`main.ts`) usando `fetch()`
 * - Mostrar la respuesta en consola
 *
 * 📁 Estructura esperada:
 *
 * /Ejercicios_etapa_2/
 * |── typescript/
 * ├── ejercicio_25/
 * │   └── main.ts            ← Este archivo solo enviará una petición al servidor
 * └── server/
 *         ├── controller.ts   ← Mueve aquí la lógica de renderizado
 *         ├── slightlyLate.ts ← Servidor con endpoint `/theme-update`
 *         └── themes/
 *             └── dev/
 *                 ├── assets/
 *                 │   └── theme.css
 *                 ├── content_for_index.liquid
 *                 ├── theme.liquid
 *                 └── dist/            ← Aquí se genera el HTML
 *
 * 🛠️ Instrucciones:
 *
 * 1. En `/Ejercicios_etapa_2/typescript/server/`, crea una carpeta `themes/` y dentro de ella, una carpeta `dev/`.
 *    Copia los archivos `content_for_index.liquid`, `theme.liquid`, y la carpeta `assets/` del ejercicio dentro de `themes/dev/`.
 *    Crea también una carpeta vacía `dist/` dentro de `dev/`.
 *
 * 2. Crea el archivo `controller.ts` en `/Ejercicios_etapa_2/typescript/server/`.
 *    Mueve aquí toda la lógica que antes estaba en `main.ts`.
 *    Asegúrate de que los `readFile` y `writeFile` ahora usen las rutas correctas desde `themes/dev/`.
 *
 * 3. En `slightlyLate.ts` (el servidor), agrega un endpoint:
 *    ```ts
 *    // dentro del router del servidor
 *    if (req.url === "/theme-update" && req.method === "POST") {
 *      const result = await generarHTMLDesdeController();
 *      req.respond({ status: 200, body: result });
 *    }
 *    ```
 *    Este endpoint debe importar y llamar a una función de `controller.ts` que genera el HTML y devuelve un mensaje.
 *
 * 4. En `/Ejercicios_etapa_2/ejercicio_25/main.ts`, reemplaza la lógica de render por una solicitud al servidor:
 *    ```ts
 *    const res = await fetch("http://localhost:3000/theme-update", {
 *      method: "POST",
 *      body: JSON.stringify({ message: "hello" }),
 *    });
 *    const texto = await res.text();
 *    console.log("🖥️ Respuesta del servidor:", texto);
 *    ```
 *    ⚠️ Recuerda iniciar el servidor antes de ejecutar `main.ts`.
 *
 * 📌 Recuerda:
 * - Este patrón ilustra cómo, en un entorno profesional, la lógica se centraliza en el servidor.
 * - `main.ts` representa la CLI que pide regenerar vistas (esto lo expandiremos en los siguientes módulos).
 * - El servidor representa el entorno de producción o desarrollo donde se aplican los cambios.
 *
 * ✅ Checklist de entrega:
 * - [ ] `controller.ts` genera el HTML desde `themes/dev/`
 * - [ ] `slightlyLate.ts` expone el endpoint `/theme-update`
 * - [ ] `main.ts` usa `fetch()` para pedir que se genere el HTML y muestra la respuesta
 */

const res = await fetch("http://localhost:3000/theme-update", {
    method: "POST",
    body: JSON.stringify({ message: "hello" }),
});

const texto = await res.text();
console.log("🖥️ Respuesta del servidor:", texto);
