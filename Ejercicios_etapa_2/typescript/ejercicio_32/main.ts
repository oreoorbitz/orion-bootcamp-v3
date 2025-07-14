/**
 * 🧩 MÓDULO 32: Drops personalizados para `collections` y `all_products`
 *
 * 🧠 Contexto:
 * Shopify utiliza objetos llamados **Drops** para exponer datos globales a sus plantillas Liquid. Estos Drops permiten:
 * - Acceso por clave (`drop['handle']`)
 * - Encapsular estructuras de datos
 * - Prevenir iteraciones no deseadas o accesos inválidos
 *
 * Originalmente, `all_products` en Shopify permitía acceder a todos los productos por su `handle`. Sin embargo, descubrieron que algunas tiendas tenían miles de productos, lo que generaba problemas de rendimiento. Por eso, lo limitaron a mostrar como máximo **20 productos**.
 *
 * En este módulo, vas a replicar esa lógica y crear tres Drops:
 *
 * - `CollectionsDrop`: para exponer colecciones globalmente por `handle`
 * - `ProductsDrop`: para acceder productos por `handle`, sin permitir iteración
 * - `EmptyDrop`: que simula el comportamiento de Shopify cuando accedes a un handle inexistente
 *
 * 🎯 Objetivos:
 * - Crear los tres Drops y exponerlos desde `contextPlease.ts`
 * - Limitar `all_products` a 20 productos, ordenados como lleguen de la base de datos
 * - Asegurar que acceder a datos inexistentes no lanza errores (usa `EmptyDrop`)
 *
 * ✅ Instrucciones:
 *
 * 1. **Crea el archivo `drops.ts` dentro de `typescript/server/`**
 *
 *    Implementa tres clases:
 *
 *    - `EmptyDrop`:
 *      - Retorna `undefined`, `""` o `null` para cualquier propiedad o clave
 *      - Implementa `toString()` para retornar una cadena vacía
 *
 *    - `ProductsDrop`:
 *      - Recibe un arreglo de productos
 *      - Internamente construye un `Map` usando el `handle` como clave
 *      - Solo permite acceder por `drop['handle']`
 *      - Si no existe, retorna una instancia de `EmptyDrop`
 *      - ⚠️ No debe permitir iteración ni acceso por índice
 *
 *    - `CollectionsDrop`:
 *      - Igual que `ProductsDrop`, pero con colecciones
 *      - Cada colección expone su arreglo `products` de forma normal
 *
 *    🧠 Consejo: Añade `.isDrop = true` a los objetos Drop para que tu motor pueda reconocerlos como no iterables.
 *
 * 2. **Actualiza `contextPlease.ts`**
 *
 *    - Usa tu base de datos SQLite como lo hiciste en ejercicios anteriores
 *    - Ejecuta `planter.ts` antes de comenzar para asegurarte de tener los datos actualizados
 *    - En lugar de exportar `products`, ahora exporta `all_products`, usando los primeros 20 productos
 *    - También construye `collections` usando `CollectionsDrop`
 *
 *    ```ts
 *    const all_products = new ProductsDrop(productos.slice(0, 20));
 *    ```
 *
 *    ✅ Asegúrate de que:
 *    - `collections['soft-shirts'].products` sigue funcionando
 *    - `all_products['camisa-suave-a']` funciona correctamente
 *    - Accesos inválidos como `all_products['inexistente']` o `collections['nada']` **no lancen errores**
 *
 * 3. **Prueba tu implementación usando `liquid_snippets/32_content_for_index.liquid`**
 *
 *    Usa el archivo `32_content_for_index.liquid` como prueba visual de tu implementación.
 *    Copia su contenido en tu carpeta `templates/` o donde esté apuntando tu sistema de rutas.
 *
 * 📂 Estructura esperada:
 *
 * ```
 * ├── typescript/
 * │   ├── server/
 * │   │   ├── drops.ts              ✅ nuevo
 * │   │   ├── contextPlease.ts      ✅ actualizado
 * │   └── planter.ts                ✅ volver a correr
 * └── liquid/
 *     └── 32_content_for_index.liquid ✅ plantilla de prueba
 * ```
 *
 * ✅ Resultado esperado:
 * - Acceso seguro y controlado a `collections` y `all_products`
 * - Manejo silencioso de datos inexistentes
 * - Consistencia con cómo Shopify maneja estos objetos internamente
 */
