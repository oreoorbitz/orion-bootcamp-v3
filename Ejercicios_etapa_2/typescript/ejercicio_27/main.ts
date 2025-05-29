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
 *    Asegúrate de incluir un campo `handle` en las tablas de `products` y `collections`.
 *    Este campo será clave para el ruteo dinámico y para acceder a datos desde los Drops en módulos siguientes.
 *
 * 📝 Ejemplo de esquema (`db/schema.ts`) — solo para referencia:
 *
 * ```ts
 * import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
 *
 * export const products = sqliteTable("products", {
 *   id: integer("id").primaryKey(),
 *   title: text("title").notNull(),
 *   handle: text("handle").notNull().unique()
 * });
 *
 * export const collections = sqliteTable("collections", {
 *   id: integer("id").primaryKey(),
 *   title: text("title").notNull(),
 *   handle: text("handle").notNull().unique()
 * });
 *
 * export const productCollections = sqliteTable("product_collections", {
 *   productId: integer("product_id").references(() => products.id),
 *   collectionId: integer("collection_id").references(() => collections.id)
 * });
 * ```
 *
 * 3. Crea `db/seed.ts` y usa Drizzle para insertar datos de ejemplo.
 *
 * ✅ Usa el archivo compartido `../seedData.ts` ubicado en el directorio padre.
 * Este archivo contiene una colección consistente de productos y colecciones que usaremos en todos los módulos.
 *
 * Importa y utiliza su contenido así:
 *
 * ```ts
 * import { db } from "./client.ts";
 * import {
 *   products,
 *   collections,
 *   productCollections
 * } from "./schema.ts";
 * import { seedCollections, seedProducts, seedProductCollections } from "../seedData.ts";
 *
 * await db.insert(products).values(seedProducts);
 * await db.insert(collections).values(seedCollections);
 * await db.insert(productCollections).values(seedProductCollections);
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
 *    y sus productos asociados. La estructura recomendada es:
 *
 * ```ts
 * [
 *   {
 *     title: "Soft Shirts",
 *     handle: "soft-shirts",
 *     products: [
 *       { title: "Camisa suave A", handle: "camisa-suave-a" },
 *       { title: "Camisa suave B", handle: "camisa-suave-b" }
 *     ]
 *   }
 * ]
 * ```
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
 * - El campo `handle` será esencial para ruteo dinámico y acceso con Drops personalizados
 * - Usar un archivo `seedData.ts` centralizado facilita mantener ejemplos consistentes en todos los módulos
 */
