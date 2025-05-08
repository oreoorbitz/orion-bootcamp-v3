/**
 * MÓDULO 27: Introducción a Bases de Datos Relacionales con SQLite y Drizzle ORM

 * 🧠 Concepto clave:
 * Shopify fue construido originalmente con Ruby on Rails v1, utilizando MySQL como base de datos principal,
 * y Redis para manejo de caché. Este patrón relacional ha sido una constante en desarrollo web.

 * Un patrón común en comercio electrónico es:
 * - Un producto puede estar en múltiples colecciones
 * - Una colección puede tener múltiples productos
 * 
 * Este tipo de relación se llama **muchos a muchos**, y normalmente se resuelve con una tabla intermedia.

 * En este módulo:
 * Vas a instalar SQLite y usar Drizzle ORM para simular esta relación en tu entorno local.

 * 🎯 Objetivo:
 * - Instalar SQLite en tu entorno local
 * - Usar Drizzle ORM para definir tablas relacionales
 * - Crear una tabla de `products`, otra de `collections`, y una tabla intermedia
 * - Agregar datos a la base
 * - Exponer una variable global `collections` al motor Liquid, que contenga cada colección y sus productos asociados

 * ✅ Instrucciones:

 * 1. Instala SQLite en tu carpeta principal del curso (Ejercicios_etapa_2/)
 *    Puedes usar el siguiente comando:
 *    ```bash
 *    deno run -A npm:drizzle-kit@latest generate:sqlite
 *    ```

 *    Asegúrate de tener también estos paquetes:
 *    ```bash
 *    deno add drizzle-orm sqlite
 *    ```

 * 2. Crea en tu directorio raíz un archivo `db/schema.ts` con la definición de tus tablas:
 *    ```ts
 *    import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

 *    export const products = sqliteTable("products", {
 *      id: integer("id").primaryKey(),
 *      title: text("title").notNull(),
 *    });

 *    export const collections = sqliteTable("collections", {
 *      id: integer("id").primaryKey(),
 *      title: text("title").notNull(),
 *    });

 *    export const productCollections = sqliteTable("product_collections", {
 *      productId: integer("product_id").references(() => products.id),
 *      collectionId: integer("collection_id").references(() => collections.id),
 *    });
 *    ```

 * 3. Crea un archivo `db/seed.ts` para insertar datos de ejemplo. Puedes usar esta lógica base:
 *    ```ts
 *    import { db } from "./client.ts";
 *    import { products, collections, productCollections } from "./schema.ts";

 *    await db.insert(products).values([
 *      { id: 1, title: "Producto A" },
 *      { id: 2, title: "Producto B" },
 *    ]);

 *    await db.insert(collections).values([
 *      { id: 1, title: "Promociones" },
 *      { id: 2, title: "Nuevos productos" },
 *    ]);

 *    await db.insert(productCollections).values([
 *      { productId: 1, collectionId: 1 },
 *      { productId: 2, collectionId: 1 },
 *      { productId: 2, collectionId: 2 },
 *    ]);
 *    ```

 * 4. En tu servidor (`slightlyLate.ts`), crea una función que:
 *    - Haga un JOIN para obtener las colecciones y los productos relacionados
 *    - Devuelva la estructura esperada por Liquid:
 *      ```ts
 *      [
 *        {
 *          title: "Promociones",
 *          products: [
 *            { title: "Producto A" },
 *            { title: "Producto B" }
 *          ]
 *        },
 *        {
 *          title: "Nuevos productos",
 *          products: [
 *            { title: "Producto B" }
 *          ]
 *        }
 *      ]
 *      ```

 *    Este valor debe estar disponible como la variable global `collections` dentro de las plantillas.

 * 🔁 Flujo esperado:
 * - El CLI `Mockify` sigue enviando el path al servidor
 * - El servidor usa Drizzle para consultar la base SQLite
 * - El resultado se pasa como contexto a tu motor Liquid
 * - Se renderiza la plantilla en `dist/index.html`
 * - Se sirve por HTTP y se actualiza al detectar cambios

 * 🧠 Consejo:
 * - No necesitas dominar SQL ni relaciones complejas aún. Solo asegúrate de comprender la idea de "una colección tiene muchos productos"
 * - Esta arquitectura es la base de la mayoría de los CMS modernos como Shopify, WordPress, Sanity, etc.

 */