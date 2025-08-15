/**
 * 🧩 EJERCICIO 41: Exponer `cart` como objeto Liquid y mostrarlo en una página
 *
 * 🧠 Contexto:
 * Ya cuentas con un carrito en memoria (token por navegador) y endpoints `/cart.js` y `/cart/add` (ej. 38–39).
 * Ahora ese mismo carrito debe estar disponible *sincrónicamente* en Liquid como `cart`, para renderizar una página.
 *
 * 🎯 Objetivos:
 * - Construir un objeto `cart` a partir del almacenamiento en memoria
 * - Exponerlo en el contexto de Liquid (p. ej., `context.cart`)
 * - Renderizar una plantilla de carrito que liste líneas y totales básicos
 *
 * ✅ Instrucciones:
 *
 * 1) **Obtén el carrito por token y calcula derivados**
 *
 *    - Lee el `cart_token` de las cookies de la petición.
 *    - Carga (o crea) el carrito desde tu estructura en memoria (Map).
 *    - Calcula:
 *      - `item_count`: suma de `quantity` en todas las líneas.
 *      - `total_price`: suma de `price * quantity` en todas las líneas.
 *    - Estructura mínima del carrito que vas a exponer:
 *
 *      cart: {
 *        token: string,
 *        items: Array<{ product_id: number, title: string, handle: string, price: number, quantity: number }>,
 *        item_count: number,
 *        total_price: number
 *      }
 *
 * 2) **Expón `cart` en el contexto de render**
 *
 *    - En tu `contextPlease.ts` (o donde construyes el `context`), agrega la propiedad `cart` con la forma anterior.
 *    - Asegúrate de que el origen de datos sea el mismo que usan tus endpoints (debe coincidir con `/cart.js`).
 *
 * 3) **Crea la plantilla de carrito**
 *
 *    - Copia `41_cart.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 *    - Configura tu router para servirla en la ruta `/cart`.
 *    - La plantilla debe:
 *      - Iterar `cart.items`
 *      - Mostrar `title`, `quantity`, `price | money` y `price * quantity | money`
 *      - Mostrar `cart.item_count` y `cart.total_price | money`
 *      - Mostrar un mensaje si no hay ítems
 *
 * 4) **Prueba de punta a punta**
 *
 *    - En una página de producto, usa el botón **“Añadir al carrito”** (ejercicio 39).
 *    - Visita **`/cart`** y verifica que:
 *      - Se listan los artículos con sus cantidades.
 *      - `item_count` y `total_price` reflejan el estado actual.
 *    - Abre **`/cart.js`** y valida que el JSON coincide con lo que ves en Liquid.
 *    - Refresca la página y confirma que el contenido del carrito persiste durante la sesión.
 *
 * ✅ Resultado esperado:
 * - `cart` está disponible en Liquid con `items`, `item_count` y `total_price`.
 * - La ruta `/cart` muestra el contenido del carrito y coincide con `/cart.js`.
 * - La experiencia es consistente entre el render del servidor y los endpoints Ajax.
 */
