/**
 * 🧩 EJERCICIO 38: Implementar endpoint `/cart.js`
 *
 * 🧠 Contexto:
 * Shopify expone una API pública en `/cart.js` que devuelve el contenido actual del carrito
 * como JSON. Este endpoint se usa en tiendas para actualizar dinámicamente precios,
 * cantidades y productos usando JavaScript o AJAX sin recargar la página.
 *
 * En este ejercicio, comenzarás implementando una versión *estática* de ese endpoint,
 * que devolverá una respuesta fija usando contenido proporcionado.
 *
 * En ejercicios posteriores, este endpoint se volverá dinámico según el contenido real del carrito.
 *
 * 🎯 Objetivos de esta primera parte:
 * - Crear una ruta `/cart.js` en el servidor
 * - Devolver una respuesta JSON estática (hardcoded) copiando contenido desde un archivo proporcionado
 *
 * ✅ Instrucciones:
 *
 * 1. **Copia el contenido del archivo de respuesta estática**
 *
 *    Abre el archivo `38_cart_response.json` que encontrarás en la carpeta `liquid_snippets/`.
 *    Copia todo su contenido.
 *
 * 2. **Agrega la ruta `/cart.js` al servidor**
 *
 *    Dentro de tu archivo `slightlyLate.ts`, agrega una ruta GET para `/cart.js`.
 *
 *    Para mantener tu código organizado, te recomendamos:
 *
 *    - Crear una función separada que se encargue de construir la respuesta de este endpoint.
 *    - Definir un arreglo con los endpoints `.js` que vas a soportar, y usarlo para decidir qué función ejecutar según la ruta exacta.
 *
 *    Luego, simplemente devuelve el objeto que copiaste como parte del cuerpo de la respuesta,
 *    junto con el encabezado `Content-Type: application/json`.
 *
 *    ⚠️ Estas recomendaciones son solo sugerencias de organización — puedes implementar la lógica de la forma que prefieras.
 *
 *    Ejemplo esperado:
 *    ```
 *    GET /cart.js → 200 OK
 *    Content-Type: application/json
 *    Body: { "token": "...", "items": [...], ... }
 *    ```
 *
 * 🧪 Puedes probarlo accediendo directamente a:
 *
 *    ```
 *    http://localhost:PORT/cart.js
 *    ```
 *
 *    El contenido devuelto debe coincidir exactamente con el JSON que copiaste del archivo.
 *
 * 3. **Haz una solicitud a `/cart.js` desde el navegador**
 *
 *    Abre tu layout principal (`layout/theme.liquid`) y agrega un `<script>` al final del `<body>`.
 *
 *    ⚠️ Ten en cuenta que escribir JavaScript para el navegador es distinto a cómo lo hemos estado haciendo con Deno.
 *
 *    Para escribir código que se ejecute cuando la página termine de cargar:
 *
 *    - Te recomendamos buscar información sobre el evento `DOMContentLoaded` en JavaScript.
 *    - Dentro del callback de ese evento, haz una solicitud `fetch()` al endpoint `/cart.js`.
 *    - Puedes usar `async/await` o una cadena de `.then()` — te recomendamos repasar estas dos formas de manejar asincronía si no las tienes frescas.
 *
 *    Dentro del callback exitoso del `fetch`, muestra el resultado con un simple `alert()` que muestre el texto crudo de la respuesta.
 *
 *    💡 No necesitas procesar el JSON aún — solo mostrar el contenido textual.
 */
