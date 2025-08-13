/**
 * 🧩 EJERCICIO 39: Endpoint `/cart/add` y carrito en memoria
 *
 * 🧠 Contexto:
 * En el ejercicio 38, `/cart.js` devolvía un JSON estático. A partir de ahora,
 * el carrito vivirá en memoria por navegador (token) y `/cart.js` devolverá su estado real.
 * Este ejercicio agrega el endpoint `/cart/add` para añadir productos al carrito.
 *
 * 🎯 Objetivos:
 * - Crear un almacenamiento en memoria para carritos, indexado por un token de cookie
 * - Implementar `POST /cart/add` que reciba `{ id, quantity }`
 * - Actualizar `/cart.js` para responder con el carrito actual desde memoria
 *
 * ✅ Instrucciones:
 *
 * 1) **Genera y usa un token de carrito por navegador**
 *
 *    - Lee una cookie (por ejemplo, `cart_token`) en cada request.
 *    - Si no existe, genera un token nuevo (UUID) y envíalo como cookie de respuesta.
 *    - Usa ese token como clave para acceder al carrito en memoria.
 *
 * 2) **Crea un almacenamiento en memoria**
 *
 *    - Mantén un `Map` (o estructura equivalente. La razon por usar un map es que Map automaticamente filtra duplicados) en el proceso del servidor:
 *      - clave: `cart_token`
 *      - valor: `{ items: Array<{ product_id, title, handle, price, quantity }> }`
 *    - Inicializa el carrito vacío cuando no exista para un token.
 *
 *    💡 Recomendación: encapsula estas operaciones en una pequeña utilidad (getCart, addItem, toJson).
 *
 * 3) **Implementa `POST /cart/add`**
 *
 *    - Ruta: `/cart/add`
 *    - Entrada (JSON): `{ id, quantity }`
 *    - Pasos:
 *      - Resuelve el producto por `id` usando tus datos de productos (usa `precio` como `price`).
 *      - Si el producto ya está en el carrito (misma `product_id`), incrementa su `quantity`.
 *      - Si no está, agrega un ítem con: `{ product_id: id, title, handle, price: producto.precio, quantity }`.
 *    - Respuesta:
 *      - Devuelve el carrito completo en JSON con `Content-Type: application/json`.
 *      - Estructura mínima alineada con el ejercicio 38:
 *        ```json
 *        {
 *          "token": "<cart_token>",
 *          "items": [
 *            { "product_id": 1, "title": "Camisa suave A", "handle": "camisa-suave-a", "price": 2500, "quantity": 2 }
 *          ]
 *        }
 *        ```
 *
 *    💡 Recomendación: crea una función dedicada para construir la respuesta JSON del carrito.
 *
 * 4) **Actualiza `/cart.js` para usar el carrito en memoria**
 *
 *    - Ruta: `/cart.js`
 *    - Lee el carrito desde el `Map` usando el `cart_token` y devuelve el mismo formato JSON del punto anterior.
 *    - Conserva `Content-Type: application/json`.
 *
 * 5) **Prueba de punta a punta (usando `39_product.liquid`)**
 *
 *    - Coloca el snippet `39_product.liquid` como tu plantilla de producto y asegúrate de que renderiza un producto del seed (p. ej., `/products/camisa-suave-a`).
 *    - Abre la página de producto en el navegador y haz clic en el botón **“Añadir al carrito”**.
 *    - Observa que se dispara `POST /cart/add` con un cuerpo como:
 *      `{ id: <product.id>, quantity: 1 }` y responde **200** con el carrito actualizado.
 *    - Visita **`/cart.js`** y confirma que incluye el ítem con:
 *      `product_id`, `title`, `handle`, `price` y `quantity`.
 *    - Haz clic nuevamente en **“Añadir al carrito”** y vuelve a consultar **`/cart.js`** para verificar que la `quantity` aumentó.
 *    - Verifica que el alert **“Producto añadido al carrito”** aparece tras cada respuesta exitosa.
 *
 * ✅ Resultado esperado:
 * - `/cart/add` agrega productos y cantidades al carrito en memoria por token.
 * - `/cart.js` devuelve el estado real del carrito (ya no es estático).
 * - El formato del JSON coincide con el del ejercicio 38 (token + items mínimos).
 */
