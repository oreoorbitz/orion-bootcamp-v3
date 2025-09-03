/**
 * 🧩 EJERCICIO 44: Carrito basado en variantes (usar `id` = id de la variante)
 *
 * 🧠 Contexto:
 * Ya proveemos un `seedData.ts` actualizado con `options` y `variants`.
 * El alumno solo debe **re-ejecutar `planter.ts`** para reseedear la DB.
 * A partir de ahora, el carrito opera con **ids de variantes**, no de productos.
 * Cuando se añade al carrito, se envía `{ id, quantity }` donde `id` es la variante.
 *
 * 🧾 Título de la línea
 * - Cada line item debe exponer `title` como:
 *   `line_item.product.title + " - " + line_item.variant.title`
 *   (si la variante no tiene opciones, típicamente `variant.title = "Default Title"`).
 *
 * 🎯 Objetivos:
 * - Migrar el modelo y endpoints del carrito para operar con ids de variantes.
 * - Mantener **43_cart.liquid** funcionando sin cambios (usa `updates[{{ item.id }}]`).
 * - Exponer en el contexto y en `/cart.js` los datos de la variante elegida.
 *
 * ✅ Paso 0 (Setup)
 * - Ejecuta **`planter.ts`** para cargar la versión nueva del seed (no edites el seed).
 * - Limpia carritos antiguos (`/cart/clear`) antes de probar.
 *
 * 1) Modelo de línea de carrito (variante)
 *    {
 *      id: number,      // id de la variante (clave de la línea)
 *      product_id: number,
 *      title: string,   // "Producto - Variante"
 *      handle: string,  // del producto
 *      sku?: string,    // de la variante
 *      price: number,   // de la variante (centavos)
 *      quantity: number
 *    }
 *
 * 2) Servicio de carrito (actualiza/crea funciones)
 *    - `getVariant(id)` → busca variante + su producto.
 *    - `addItem(token, id, quantity)`:
 *        - valida existencia y `available`.
 *        - si la variante ya está en el carrito, suma `quantity`.
 *        - usa `variant.price` y `variant.sku`.
 *        - arma `title = product.title + " - " + variant.title`.
 *    - `setQuantity(token, id, quantity)` → `>0` actualiza; `<=0` elimina.
 *    - `recalculate(cart)` → `item_count`, `total_price`.
 *    - `toJson(token)` → incluye `items[*].id` (variante), `title`, `product_id`, `sku`, `price`, `quantity`.
 *
 * 3) Endpoint `/cart/add` (POST)
 *    - Entrada: `{ "id": number, "quantity": number }` (id = variante).
 *    - Lógica:
 *      - `getVariant(id)`; si no existe o `!available`, responde 422.
 *      - `addItem(token, id, quantity)` → `recalculate` → 200 (JSON o redirect).
 *    - Compat opcional: si recibes `{ "variant_id": n }`, usa `id = body.id ?? body.variant_id`.
 *      (Recomendado: `44_product.liquid` debe enviar `{ id: <variant.id>, quantity }`.)
 *
 * 4) Endpoint `/cart/update` (POST)
 *    - Entrada: `{ "updates": { "<id>": number, ... }, "attributes"?: { [k: string]: string } }`
 *      (las claves son **ids de variante**).
 *    - Aplica `setQuantity` y, si hay, actualiza `attributes` (compat con Ej. 43).
 *    - Responde 200 con `toJson(token)`.
 *
 * 5) Endpoint `/cart.js`
 *    - Refleja el estado basado en variante y el `title` combinado, por ejemplo:
 *      {
 *        "token": "...",
 *        "items": [{
 *          "id": 1005,
 *          "product_id": 1,
 *          "title": "Camisa suave A - Azul / M",
 *          "handle": "camisa-suave-a",
 *          "sku": "CAMISA-SUAVE-A-AZUL-M",
 *          "price": 2550,
 *          "quantity": 2
 *        }],
 *        "attributes": { ... } // si vienes de Ej. 43
 *      }
 *
 * 6) Plantillas
 *    - **Producto**: `44_product.liquid`
 *      - Renderiza selects desde `product.options`.
 *      - Resuelve variante en `product.variants` según selección.
 *      - Muestra `price/available/sku`.
 *      - Envía **POST /cart/add** con `{ id: <variant.id>, quantity }`.
 *    - **Carrito**: `43_cart.liquid` se mantiene intacto.
 *
 * 7) Pruebas sugeridas
 *    A) Dos combinaciones del mismo producto → líneas separadas con títulos distintos.
 *    B) Variante `available = 0` → bloqueo del add (UI o 422).
 *    C) `updates[<variant_id>]` → totales y `item_count` coherentes.
 *
 * ✅ Resultado esperado
 * - `/cart/add` y `/cart/update` operan con ids de variante (`id`).
 * - `43_cart.liquid` sigue funcionando sin cambios.
 * - `/cart.js` muestran el título combinado y los datos de variante.
 */
