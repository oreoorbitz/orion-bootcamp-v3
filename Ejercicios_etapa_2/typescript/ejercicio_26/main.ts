/**
 * MÓDULO 26: Introducción de una base de datos simulada de productos
 *
 * 🧠 Concepto clave:
 * En una tienda real como Shopify, los productos no se escriben manualmente dentro del código del tema.
 * Se almacenan en bases de datos como PostgreSQL, SQLite o mediante GraphQL, y se insertan dinámicamente en las páginas.
 *
 * En este módulo, vas a simular esa separación creando una "base de datos mock" que estará fuera del tema visual.
 *
 * 🎯 Objetivo:
 * Crear una estructura de servidor que sirva como fuente de datos dinámica para los productos de la tienda.
 *
 * ✅ Instrucciones:
 *
 * 1. Usa la carpeta `server/` que ya creaste en ejercicios anteriores (por ejemplo, en el Módulo 23).
 *
 * 2. Dentro de `./server/`, crea un archivo llamado `products.ts` que contenga un arreglo de productos:
 *
 * ```ts
 * export const products = [
 *   { id: 1, title: "Producto A", precio: 1000 },
 *   { id: 2, title: "Producto B", precio: 2000 }
 * ];
 * ```
 *
 * 3. En tu archivo `server/slightlyLate.ts` (tu módulo tipo Express):
 *    - Importa la base de datos de productos desde `../server/products.ts`
 *    - Asegúrate de incluir la variable `all_products` en el objeto `contexto` que se pasa al motor de plantillas
 *
 * ```ts
 * import { products } from "../server/products.ts";
 *
 * const contexto = {
 *   all_products: products,
 *   // otras variables necesarias
 * };
 * ```
 *
 * 4. En tu archivo de plantilla (`theme.liquid` o `content_for_index.liquid`), puedes mostrar los productos así:
 *
 * ```liquid
 * {% for producto in all_products %}
 *   <div>{{ producto.title }} - {{ producto.precio }}</div>
 * {% endfor %}
 * ```
 *
 * 🔁 Flujo completo que debe estar funcionando hasta este punto:
 * - Tu CLI `Mockify` debe enviar al servidor el path de la carpeta actual
 * - El servidor (`slightlyLate`) debe:
 *   1. Importar la plantilla
 *   2. Inyectar el contexto (`all_products`)
 *   3. Renderizar el HTML usando tu motor Liquid
 *   4. Escribir el resultado en `./dist/index.html`
 *   5. Servir el archivo por HTTP
 *   6. Enviar por WebSocket la URL al CLI, que la imprime en consola
 *
 * 🧠 Recuerda:
 * - En el mundo real, la información como productos, usuarios o pedidos se almacena en bases de datos externas
 * - Tu archivo `products.ts` es solo una simulación educativa para ayudarte a practicar flujo de datos real
 *
 * 🔎 Consejo:
 * - Asegúrate de revisar si estás pasando correctamente el contexto a tu motor de plantillas
 * - Si tu motor Liquid no soporta variables de tipo arreglo aún, ¡revisa el módulo de bucles!
 */
