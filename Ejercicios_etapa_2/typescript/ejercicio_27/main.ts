/**
 * MÓDULO 27: Introducción a Bases de Datos Relacionales con SQLite y Drizzle ORM
 *
 * 🧠 Concepto clave:
 * En sistemas como Shopify, los datos como productos y colecciones se gestionan en bases de datos relacionales.
 * Un patrón común es la relación **muchos a muchos**, donde:
 *
 * - Un producto puede pertenecer a múltiples colecciones
 * - Una colección puede contener múltiples productos
 *
 * Este módulo te permite replicar ese modelo usando SQLite y Drizzle ORM, y preparar tus datos
 * para integrarlos al motor Liquid a través de un módulo dedicado.
 *
 * 🎯 Objetivo:
 * - Configurar SQLite y Drizzle ORM
 * - Crear una base de datos relacional con productos y colecciones
 * - Construir un módulo `contextPlease.ts` que devuelva el contexto para tu motor Liquid
 *
 * ✅ Instrucciones:
 *
 * 1. Instala SQLite y Drizzle ORM en la raíz de tu proyecto:
 *
 * ```bash
 * deno run -A npm:drizzle-kit@latest generate:sqlite
 * deno add drizzle-orm sqlite
 * ```
 *
 * 2. Crea un archivo `db/schema.ts` con la definición de tus tablas.
 *    Este archivo define cómo está estructurada tu base de datos.
 *
 * 📝 Ejemplo de uso de `db/schema.ts` (no es código para copiar literalmente):
 *
 * ```ts
 * import { collections, products, productCollections } from "../db/schema.ts";
 *
 * await db.insert(products).values([
 *   { id: 1, title: "Producto A" },
 *   { id: 2, title: "Producto B" }
 * ]);
 * ```
 *
 * 3. Crea `db/seed.ts` y usa Drizzle para insertar datos de ejemplo.
 *    Este archivo sirve para poblar la base con entradas iniciales.
 *
 * Puedes usar esta estructura como punto de partida (ajústala a tu diseño):
 *
 * ```ts
 * [
 *   { id: 1, title: "Producto A" },
 *   { id: 2, title: "Producto B" },
 *   { id: 3, title: "Producto C" }
 * ]
 *
 * [
 *   { id: 1, title: "Ofertas" },
 *   { id: 2, title: "Nuevos lanzamientos" }
 * ]
 *
 * [
 *   { productId: 1, collectionId: 1 },
 *   { productId: 2, collectionId: 1 },
 *   { productId: 2, collectionId: 2 },
 *   { productId: 3, collectionId: 2 }
 * ]
 * ```
 *
 * 4. Crea un archivo `server/contextPlease.ts`.
 *    Este módulo será responsable de consultar la base de datos y devolver el objeto `contexto`
 *    que tu motor Liquid utilizará.
 *
 * 📝 Ejemplo de uso de `contextPlease.ts` (solo para referencia):
 *
 * ```ts
 * import { contextPlease } from "../server/contextPlease.ts";
 *
 * const contexto = await contextPlease();
 * renderizarHTML(tokens, contexto); // o como sea que implementaste tu función de render
 * ```
 *
 * 5. Asegúrate de que el contexto incluya una propiedad `collections` que represente las colecciones
 *    y sus productos asociados, en un formato adecuado para tus plantillas Liquid.
 *
 * 🔁 Flujo esperado:
 * - Tu CLI ejecuta el servidor con la ruta del ejercicio
 * - El servidor llama a `contextPlease()` para obtener el contexto
 * - El motor Liquid usa ese contexto para renderizar
 * - El resultado se guarda como HTML y se sirve por HTTP
 *
 * 🧠 Consejo:
 * - A partir de este punto, `contextPlease.ts` será el lugar donde agregarás otras variables globales como `all_products`
 * - Esta estructura modular te permite mantener tu lógica de datos separada de tu motor de renderizado
 */
