/**
 * 🧩 EJERCICIO 42: Endpoints `/cart/update` y `/cart/clear` + página de carrito interactiva
 *
 * 🧠 Contexto:
 * Ya cuentas con `/cart/add`, `/cart.js` y una página de carrito (Ej. 41) que muestra `cart`.
 * Ahora vas a permitir **actualizar cantidades** y **vaciar el carrito** desde la UI.
 *
 * 🎯 Objetivos:
 * - Implementar `POST /cart/update` para cambiar cantidades (soporta actualización por lotes)
 * - Implementar `/cart/clear` para vaciar el carrito y redirigir a `/cart`
 * - Asegurar que la plantilla de carrito pueda enviar cambios y verlos reflejados
 *
 * ✅ Instrucciones:
 *
 * 1) **Prepara tu servicio de carrito (memoria por `cart_token`)**
 *
 *    Asegúrate de contar con utilidades (o créalas ahora):
 *    - `getCart(token)` → retorna el carrito (lo crea si no existe)
 *    - `setQuantity(token, productId, quantity)`:
 *        - Si `quantity > 0` → establece la cantidad de esa línea
 *        - Si `quantity <= 0` → elimina la línea
 *    - `clearCart(token)` → deja `items: []`
 *    - `recalculate(cart)` → calcula `item_count` y `total_price` (para tu `context.cart`)
 *    - `toJson(token)` → construye el JSON mínimo usado por `/cart.js`:
 *      ```json
 *      {
 *        "token": "<cart_token>",
 *        "items": [
 *          { "product_id": 1, "title": "Camisa suave A", "handle": "camisa-suave-a", "price": 2500, "quantity": 2 }
 *        ]
 *      }
 *      ```
 *
 *    ℹ️ **Alias `id` en Liquid**: para facilitar la edición en la plantilla,
 *       expón en **Liquid** cada línea con un campo `id` que sea igual a `product_id`.
 *       Ejemplo de cada ítem en **Liquid**:
 *       `{ id: product_id, product_id, title, handle, price, quantity }`
 *
 * 2) **Implementa `POST /cart/update`**
 *
 *    - Ruta: `/cart/update`
 *    - Lee `cart_token` desde cookie.
 *    - **Formato de entrada** (batch):
 *      ```json
 *      { "updates": { "<product_id>": <quantity>, ... } }
 *      ```
 *      (El `<product_id>` es string en el JSON del request; conviértelo a número si tu store lo requiere.)
 *    - Aplica `setQuantity()` para cada par (productId, quantity).
 *    - Responde `200` con el carrito actualizado como JSON (`toJson(token)`), con `Content-Type: application/json`.
 *
 * 3) **Implementa `/cart/clear` con redirección**
 *
 *    - Ruta: `/cart/clear`
 *    - Método: `POST` (puedes usar `GET` si te resulta más simple para probar).
 *    - Lógica: `clearCart(token)` y responde **302** con `Location: /cart`.
 *
 * 4) **Usa la plantilla interactiva**
 *
 *    - Copia `42_cart.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 *    - Sirve esta plantilla en la ruta `/cart`.
 *    - Esta plantilla:
 *        - Muestra inputs `number` por línea con `name="updates[{{ item.id }}]"`.
 *        - Hace `fetch('/cart/update', { method: 'POST', body: JSON.stringify({ updates }) })` en `submit`.
 *        - Llama a `/cart/clear` y redirige a `/cart` al vaciar.
 *
 * 5) **Alinear estado entre Liquid y Ajax**
 *
 *    - Asegúrate de que `context.cart` (Liquid) se derive del **mismo** carrito en memoria que usa `/cart.js`.
 *    - Tras `update` o `clear`, recarga la página para ver los nuevos totales en Liquid.
 *
 * 6) **Pruebas sugeridas**
 *
 *    - Añade artículos desde una página de producto (Ej. 39).
 *    - En `/cart`, cambia cantidades y pulsa **Actualizar carrito**:
 *        - Debe llamar a `POST /cart/update` y al recargar verás cantidades y totales actualizados.
 *        - Abre `/cart.js` para confirmar que el JSON coincide.
 *    - Pulsa **Vaciar carrito**:
 *        - Debe ejecutar `/cart/clear`, redirigir a `/cart` y mostrar el carrito vacío.
 *
 * ✅ Resultado esperado:
 * - `POST /cart/update` procesa cambios por lotes y elimina líneas con cantidad 0.
 * - `/cart/clear` vacía el carrito y redirige a `/cart`.
 * - El estado es consistente entre `/cart` (Liquid) y `/cart.js` (Ajax).
 */
