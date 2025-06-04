/**
 * MÓDULO 28: Reemplazar datos estáticos con una base de datos SQLite usando Drizzle
 *
 * 🧠 Concepto clave:
 * En un sistema real como Shopify, los datos como productos y colecciones viven en una base de datos.
 * En este módulo, vas a reemplazar tu `context.ts` estático por una versión conectada a una base de datos real usando Drizzle y SQLite.
 *
 * 🎯 Objetivo:
 * - Instalar y configurar Drizzle ORM
 * - Crear una base de datos SQLite con productos, colecciones y relaciones
 * - Usar consultas SQL para generar el contexto dinámicamente desde `contextPlease.ts`
 *
 * ✅ Instrucciones:
 *
 * 1. **Instala Drizzle ORM y SQLite**
 *
 * En tu terminal, ejecuta:
 * ```bash
 * deno add -r https://deno.land/x/drizzle_orm@0.30.7/mod.ts
 * deno add -r https://deno.land/x/drizzle_orm@0.30.7/sqlite/mod.ts
 * ```
 *
 * 2. **Importa los datos y crea la base de datos**
 *
 * En `typescript/server/`, crea un nuevo archivo llamado `db.ts`.
 *
 * Allí:
 * - Importa `sqlite`, `drizzle`, y `schema.sql` para definir la estructura
 * - Usa `typescript/seedData.ts` para poblar la base de datos
 *
 * El archivo debe contener algo como:
 * ```ts
 * import { drizzle } from "https://deno.land/x/drizzle_orm@0.30.7/mod.ts";
 * import { sqliteTable, text, integer } from "https://deno.land/x/drizzle_orm@0.30.7/sqlite/mod.ts";
 * import { DB } from "https://deno.land/x/sqlite/mod.ts";
 *
 * const sqlite = new DB("store.db");
 * export const db = drizzle(sqlite);
 * ```
 *
 * 3. **Define tus tablas y relaciones**
 *
 * Puedes basarte en estos tres conjuntos:
 * - `products`: `{ id, title, handle, precio }`
 * - `collections`: `{ id, title, handle }`
 * - `productCollections`: `{ productId, collectionId }` (relación muchos a muchos)
 *
 * 4. **Puebla la base de datos con `seedData.ts`**
 *
 * Desde `db.ts` o desde un script adicional (puedes crear `seed.ts` si lo prefieres), recorre los arrays exportados por `seedData.ts` e inserta los datos a las tablas correspondientes.
 *
 * 5. **Actualiza `contextPlease.ts`**
 *
 * En lugar de importar los datos directamente desde `seedData.ts`, importa tu instancia de `db` desde `db.ts` y genera dinámicamente el `context`.
 *
 * Tu `contextPlease.ts` ahora debe:
 * - Consultar todos los productos y colecciones desde la base de datos
 * - Construir la estructura `context = { products, collections }`
 * - Exportar ese objeto
 *
 * Ejemplo (simplificado):
 * ```ts
 * import { db } from "./db.ts";
 *
 * export const context = {
 *   products: await db.select().from(products),
 *   collections: await db.select().from(collections)
 * };
 * ```
 *
 * 6. **Reutiliza tu `controller.ts` sin cambios**
 *
 * Tu controlador seguirá usando `import { context } from "./contextPlease.ts"` como antes.
 * Como el contenido ahora viene de la base de datos, ya no es necesario modificar `controller.ts`.
 *
 * 🧪 Prueba:
 * - Inicia tu servidor:
 * ```bash
 * deno run --allow-all typescript/server/controller.ts
 * ```
 * - Verifica que:
 *   - El archivo HTML se genere con los productos y colecciones desde la base de datos
 *   - Los nombres y precios se muestran correctamente
 *
 * 📁 Estructura esperada:
 * ```
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_28/
 * │   │   ├── theme.liquid
 * │   │   ├── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts    ← Usar Drizzle para generar contexto dinámico
 * │       ├── db.ts               ← Definir tablas y conexión SQLite
 * │       ├── seedData.ts
 * │       ├── slightlyLate.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── dist/
 * │               └── (actualizado por servidor)
 * ```
 *
 * 📘 Tip extra:
 * Este módulo introduce la relación muchos-a-muchos (`productCollections`) que es muy común en tiendas:
 * Un producto puede pertenecer a múltiples colecciones, y una colección puede contener múltiples productos.
 */
