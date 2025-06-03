/**
 * MÓDULO 28: TIPOS DE ARREGLOS ASOCIATIVOS EN LIQUID
 *
 * 🧠 Concepto clave:
 * En motores como Liquid, los datos pueden representarse como arreglos, objetos o estructuras híbridas.
 * Shopify resolvió esto usando un patrón llamado **Drop**: objetos que exponen datos de forma controlada.
 *
 * Los Drops permiten:
 * - Acceso por clave (`drop['handle']`)
 * - Encapsular comportamiento sin exponer toda la estructura original
 * - Limitar cómo se usa un objeto en las plantillas, sin afectar el resto del sistema
 *
 * En este módulo vas a construir tus dos primeros Drops:
 * - `all_products`: que contendrá todos los productos por `handle`
 * - `collections`: que contendrá todas las colecciones por `handle`
 *
 * 🎯 Objetivos:
 *
 * 1. Soportar acceso por índice en arreglos reales (`arr[0]`)
 * 2. Soportar acceso por propiedad (`obj.prop` y `obj['prop']`)
 * 3. Crear un Drop `AllProductsDrop` que:
 *    - Permita acceso por clave (`all_products['some-handle']`)
 *    - No permita iteración ni acceso por índice
 * 4. Crear un Drop `CollectionsDrop` que:
 *    - Permita acceso por clave (`collections['soft-shirts']`)
 *    - No permita iteración ni acceso por índice
 *
 * ✅ Instrucciones:
 *
 * 1. Asegúrate de que tu motor soporte estas expresiones con datos reales:
 *    ```liquid
 *    {{ productos[1].title }}
 *    {{ producto.title }}
 *    {{ producto['title'] }}
 *    ```
 *
 * 2. Crea una clase `AllProductsDrop`:
 *    - Recibe todos los productos en su constructor
 *    - Internamente crea un mapa por `handle`
 *    - Soporta únicamente acceso como: `all_products['producto-handle']`
 *    - Lanza un error si se intenta acceder con índice
 *
 * 3. Crea una clase `CollectionsDrop`:
 *    - Recibe todas las colecciones en su constructor
 *    - Internamente crea un mapa por `handle`
 *    - Soporta únicamente acceso como: `collections['soft-shirts']`
 *    - Cada colección dentro del Drop puede tener productos (como un arreglo normal)
 *
 * 4. En `contextPlease.ts`, crea e inyecta estos Drops dentro del objeto `contexto`.
 *
 * 💾 Datos consistentes:
 * Este módulo reutiliza los datos comunes definidos en `seedData.ts`, ubicado en la carpeta principal.
 * Ya existe una colección con handle `"soft-shirts"` y productos con handles como `"camisa-suave-a"`, `"camisa-suave-b"`, etc.
 *
 * 📝 Ejemplo de uso en `contextPlease.ts` (esto es solo un ejemplo de uso, no lo copies literalmente):
 *
 * ```ts
 * import { db } from "../db/client.ts";
 * import { products, collections, productCollections } from "../db/schema.ts";
 * import { AllProductsDrop, CollectionsDrop } from "./drops.ts";
 *
 * export async function contextPlease(): Promise<Record<string, unknown>> {
 *   const productResults = await db.select().from(products);
 *   const all_products = new AllProductsDrop(productResults);
 *
 *   const collectionsWithProducts = await db.query.collections.findMany({
 *     with: {
 *       productCollections: {
 *         with: { product: true }
 *       }
 *     }
 *   });
 *
 *   const collectionsData = collectionsWithProducts.map((c) => ({
 *     ...c,
 *     products: c.productCollections.map(pc => pc.product)
 *   }));
 *
 *   const collections = new CollectionsDrop(collectionsData);
 *
 *   return {
 *     all_products,
 *     collections
 *   };
 * }
 * ```
 *
 * ✅ Liquid que debería funcionar si todo está implementado correctamente:
 *
 * ```liquid
 * {{ all_products['camisa-suave-a'].title }}
 *
 * {{ collections['soft-shirts'].title }}
 *
 * {% for producto in collections['soft-shirts'].products %}
 *   {{ producto.title }}
 * {% endfor %}
 * ```
 *
 * 🧠 Consejo:
 * - Los Drops son objetos personalizados que permiten controlar cómo se accede a los datos.
 * - A diferencia de los arreglos comunes, **no permiten iteración ni acceso por índice**.
 * - Esto los hace ideales para representar datos globales con acceso restringido.
 *
 * 🚀 Recomendación de arquitectura:
 * - Usa `instanceof` o una propiedad `.isDrop = true` para detectar si un valor es un Drop
 * - En `renderizarVariables()` y `procesarBucles()`, asegúrate de no iterar Drops a menos que explícitamente lo permitan
 * - Estos Drops se volverán la base para otros como `productDrop`, `collectionDrop`, y más adelante `cart`, `customer`, etc.
 */
