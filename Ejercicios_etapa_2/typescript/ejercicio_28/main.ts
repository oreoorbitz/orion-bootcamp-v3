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
 * A lo largo del curso, irás creando Drops para representar datos específicos en rutas específicas.
 * En este módulo comenzarás con `all_products`.
 *
 * 🎯 Objetivos:
 *
 * 1. Soportar acceso por índice en arreglos reales (`arr[0]`)
 * 2. Soportar acceso por propiedad (`obj.prop` y `obj['prop']`)
 * 3. Crear un Drop `AllProductsDrop` que:
 *    - Permita acceso por clave (`drop['handle']`)
 *    - Se comporte como un objeto controlado, no como un arreglo normal
 *
 * ✅ Instrucciones:
 *
 * 1. Asegúrate de que tu motor soporte estas expresiones:
 *    ```liquid
 *    {{ productos[1].title }}
 *    {{ producto.title }}
 *    {{ producto['title'] }}
 *    ```
 *
 * 2. Crea una clase `AllProductsDrop` que:
 *    - Permita acceder a un producto por clave (por ejemplo: `all_products['collar-dorado']`)
 *    - No se comporte como un arreglo iterable o accesible por índice
 *
 * 3. En `contextPlease.ts`, crea una instancia de `AllProductsDrop` con la data de productos
 *    y asígnala al contexto como `all_products`.
 *
 * 📝 Ejemplo de cómo podrías usar `AllProductsDrop` en `contextPlease.ts`
 * (**esto es solo un ejemplo de uso, no lo copies literalmente**):
 *
 * ```ts
 * import { db } from "../db/client.ts";
 * import { products } from "../db/schema.ts";
 * import { AllProductsDrop } from "./drops.ts";
 *
 * export async function contextPlease(): Promise<Record<string, unknown>> {
 *   const productResults = await db.select().from(products);
 *   const all_products = new AllProductsDrop(productResults);
 *
 *   // ...tu otro código aquí para construir collections u otras variables
 *
 *   return {
 *     all_products,
 *     // otras propiedades del contexto
 *   };
 * }
 * ```
 *
 * ✅ Liquid que debería funcionar si todo está implementado correctamente:
 *
 * ```liquid
 * {{ all_products['collar-dorado'].title }}
 * ```
 *
 * 🧠 Consejo:
 * - Los Drops se comportan como objetos de solo lectura.
 * - No se iteran ni acceden por índice, y no exponen métodos.
 * - Son una forma práctica de exponer datos específicos en rutas específicas.
 *   Por ejemplo: en el futuro usarás `productDrop` para representar el producto en una ruta como `/products/:handle`
 *
 * 🚀 Recomendación de arquitectura:
 * - Identifica Drops usando `instanceof` o alguna marca como `.isDrop = true`
 * - No trates los Drops como arreglos: piensa en ellos como mapas controlados
 * - Sigue construyendo Drops que te permitan estructurar el contexto de forma segura y escalable
 */
