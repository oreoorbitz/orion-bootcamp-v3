/**
 * 🧩 MÓDULO 28: Reemplazar datos estáticos con una base de datos SQLite usando Drizzle
 *
 * 🧠 Concepto clave:
 * En sistemas reales como Shopify, los datos como productos y colecciones viven en una base de datos.
 * En este módulo, vas a reemplazar tu `context.ts` estático por una versión conectada a una base de datos real.
 * Usarás Drizzle ORM con SQLite para crear, poblar y consultar tu modelo de datos.
 *
 * 🎯 Objetivo:
 * - Construir un modelo funcional usando SQLite y Drizzle
 * - Definir la estructura de datos (tablas) y poblarla con `seedData.ts`
 * - Generar el objeto `context` directamente desde la base de datos
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *    - Copia tu tema a `typescript/ejercicio_28/`.
 *    - Asegúrate de incluir:
 *      - `theme.liquid`
 *      - `content_for_index.liquid`
 *      - Una carpeta `assets/`
 *
 * 2. **Crea y configura `contextPlease.ts`**
 *    - Este módulo será responsable de **todo el modelo (M de MVC)**.
 *    - Ubícalo en: `typescript/server/contextPlease.ts`
 *
 * 3. **Importa Drizzle y SQLite directamente**
 *    Dentro de `contextPlease.ts`, importa los módulos necesarios:
 *    ```ts
 *    import { drizzle } from "https://deno.land/x/drizzle_orm@0.30.7/mod.ts";
 *    import { sqliteTable, integer, text } from "https://deno.land/x/drizzle_orm@0.30.7/sqlite/mod.ts";
 *    import { DB } from "https://deno.land/x/sqlite/mod.ts";
 *    ```
 *
 * 4. **Define las tablas directamente en `contextPlease.ts`**
 *    - `products`: columnas `id`, `title`, `handle`, `precio`
 *    - `collections`: columnas `id`, `title`, `handle`
 *    - `productCollections`: columnas `productId`, `collectionId`
 *    - Usa `sqliteTable(...)` para cada una
 *
 * 5. **Importa `seedData.ts` y pobla las tablas**
 *    - Importa desde: `./seedData.ts`
 *    - Usa `.insert(...)` para agregar productos, colecciones y asociaciones
 *    - Este paso solo debe ejecutarse si la tabla está vacía
 *
 * 6. **Construye el objeto `context`**
 *    - Haz consultas con Drizzle para obtener todos los productos y colecciones
 *    - Recorre `productCollections` para asociar productos a cada colección
 *    - Arma un objeto final con:
 *      ```ts
 *      export const context = {
 *        products: [...],
 *        collections: [...], // cada una con sus productos
 *      };
 *      ```
 *
 * 7. **No modifiques `controller.ts`**
 *    - `controller.ts` debe seguir importando el contexto de contextPlease
 *    - El resto de tu pipeline (renderizado, dist/, hotreload) no necesita cambiar.
 *
 * 🧪 Prueba:
 * - Inicia el servidor con:
 *   ```bash
 *   deno run --allow-all typescript/server/controller.ts
 *   ```
 * - Asegúrate de que:
 *   - El HTML generado muestra productos y colecciones correctos
 *   - Cada colección contiene los productos apropiados
 *   - El filtro `money` sigue funcionando (lo agregaste en el módulo anterior)
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
 * │       ├── contextPlease.ts   ← contiene todo el modelo y consultas
 * │       ├── seedData.ts
 * │       ├── slightlyLate.ts
 * │       └── themes/
 * │           └── dev/
 * │               └── dist/
 *
 * 🧠 Recomendación:
 * No te compliques con joins complejos. Si necesitas, usa múltiples consultas
 * y combínalas tú mismo desde JavaScript para construir la relación muchos-a-muchos.
 *
 * 🎯 Resultado esperado:
 * - Los datos de productos y colecciones ahora provienen de SQLite
 * - El objeto `context` se construye dinámicamente desde el modelo
 * - Consolidaste tu modelo en un solo módulo (`contextPlease.ts`), lo cual
 *   simplifica el patrón MVC que usarás de aquí en adelante.
 */
