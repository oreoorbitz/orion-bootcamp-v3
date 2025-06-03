/**
 * MÓDULO 30 (parte 1): DEFINICIÓN DE RUTAS Y ASOCIACIÓN A PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Hasta ahora, has trabajado con una sola página (como `index.html`). A partir de este punto,
 * tu sistema debe poder generar múltiples páginas HTML, cada una correspondiente a una ruta como:
 *
 * - `/products/gold-necklace`
 * - `/collections/sale`
 *
 * En este archivo vas a:
 * - Definir un sistema de rutas internas
 * - Conectar cada ruta con una plantilla específica
 * - Asociar datos contextuales a cada ruta (usando Drops)
 *
 * 🎯 Objetivo:
 * - Crear una tabla de rutas locales basada en tus datos
 * - Asociar cada ruta a una plantilla Liquid
 * - Crear un contexto por ruta, con variables como `product` o `collection`
 *
 * ✅ Instrucciones:
 *
 * 1. Define una estructura de rutas que represente todas las páginas que se deben generar:
 *    - Cada ruta debe tener:
 *      - una `url` relativa (ej. `/products/gold-necklace`)
 *      - una plantilla Liquid (ej. `product.liquid`)
 *      - un contexto de datos (ej. `{ product: productDrop }`)
 *
 * 2. Usa `contextPlease.ts` para cargar todos los productos y colecciones desde la base.
 *
 * 3. Crea Drops específicos para cada entidad si es necesario:
 *    - Por ejemplo: `new ProductDrop(product)`
 *    - Esto encapsula la lógica de cada entidad dentro de su ruta
 *    - La ubicación y organización de estos Drops queda a tu criterio
 *
 * 📝 Ejemplo de cómo podrías estructurar las rutas dentro de este archivo:
 * (**esto es solo una referencia de uso, no lo copies literalmente**)
 *
 * ```ts
 * import { contextPlease } from "../server/contextPlease.ts";
 *
 * const { collections } = await contextPlease();
 *
 * const rutas: {
 *   url: string;
 *   template: string;
 *   context: Record<string, unknown>;
 * }[] = [];
 *
 * for (const collection of collections) {
 *   rutas.push({
 *     url: `/collections/${collection.handle}`,
 *     template: "collection.liquid",
 *     context: { collection }
 *   });
 *
 *   for (const product of collection.products) {
 *     rutas.push({
 *       url: `/products/${product.handle}`,
 *       template: "product.liquid",
 *       context: {
 *         product: new ProductDrop(product) // o como sea que implementaste tu drop
 *       }
 *     });
 *   }
 * }
 * ```
 *
 * ✅ Resultado esperado:
 * - Tienes una lista de rutas como:
 *   - `/products/gold-necklace`
 *   - `/collections/sale`
 * - Cada una enlazada a una plantilla y un contexto
 * - Las variables como `product` o `collection` están listas para ser renderizadas en Liquid
 *
 * 🧠 Consejo:
 * - Estás preparando los datos y la estructura — aún no generas los archivos HTML (eso será en el siguiente paso)
 * - Los Drops como `ProductDrop` y `CollectionDrop` te permiten aislar la lógica de cada entidad
 *   y reutilizarla según el tipo de página
 */
