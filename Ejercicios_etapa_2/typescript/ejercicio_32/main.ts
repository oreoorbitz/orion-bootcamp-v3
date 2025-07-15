/**
 * 🧩 MÓDULO 32: Drops personalizados para `collections` y `products`
 *
 * 🧠 Contexto:
 * Shopify utiliza objetos llamados **Drops** para exponer datos globales a sus plantillas Liquid.
 * Un Drop es un tipo especial de objeto que:
 * - Expone datos por `handle`, como `collections['soft-shirts']`
 * - Encapsula su estructura interna para protegerla
 * - No puede iterarse ni accederse por índice, aunque parezca un arreglo u objeto
 *
 * Aunque Liquid no tiene un sistema de tipos estricto, Shopify implementó este patrón dentro de su motor
 * para ofrecer seguridad y control. No estamos hablando de un `type` de TypeScript, sino de una convención:
 * objetos que tienen un comportamiento especial que tu motor de plantillas debe respetar.
 *
 * Por ejemplo:
 * - `collections['some-handle']` debería devolver una colección si existe, o algo vacío si no existe
 * - No deberías poder hacer un `for` directamente sobre `collections`
 *
 * 🎯 Objetivos:
 * - Implementar soporte para un tipo especial de objeto llamado Drop en tu motor de Liquid
 * - Los Drops deben permitir acceso por clave (como un diccionario)
 * - No deben permitir iteración (`{% for ... in drop %}` debe fallar o ignorarse)
 * - No deben permitir acceso por índice (`drop[0]` no debe devolver nada útil)
 *
 * ✅ Instrucciones:
 *
 * 1. **Crea un Drop de productos y uno de colecciones**
 *
 *    - En tu `contextPlease.ts`, agrega una forma de identificar que las propiedades `collections` y `products`
 *      que estás exportando en el objeto `context` son Drops:
 *      - Un Drop de productos que exponga los productos por su `handle`
 *      - Un Drop de colecciones que exponga las colecciones por su `handle`
 *    - Ambos Drops deben funcionar como diccionarios, por ejemplo, en tu Liquid:
 *
 *      ```liquid
 *      {{ products['camisa-suave-a'].title }}
 *      {{ collections['soft-shirts'].title }}
 *      ```
 *
 *    - Cada colección debe incluir su arreglo `products` como propiedad normal (no necesita ser un Drop)
 *
 *    Ejemplo conceptual (no copies literalmente):
 *    ```ts
 *    const rawProducts = await db.select().from(products);
 *    const productos = new ProductsDrop(rawProducts);
 *
 *    const rawCollections = await db.query.collections.findMany({
 *      with: {
 *        productCollections: {
 *          with: { product: true }
 *        }
 *      }
 *    });
 *
 *    const colecciones = new CollectionsDrop(
 *      rawCollections.map(c => ({
 *        ...c,
 *        products: c.productCollections.map(pc => pc.product)
 *      }))
 *    );
 *
 *    return {
 *      products: productos,
 *      collections: colecciones
 *    };
 *    ```
 *
 * 2. **Actualiza tu motor de plantillas para soportar Drops**
 *
 *    - Un Drop es simplemente un objeto que implementa una convención especial en tu motor
 *    - Puedes identificar si un objeto es un Drop usando `.isDrop = true` o `instanceof`
 *    - En `renderizarVariables()` y `procesarBucles()`, evita iterar Drops o accederlos como si fueran arreglos
 *    - Asegúrate de que si se accede a una clave que no existe (`drop['no-existe']`), **el resultado sea un string vacío** cuando se renderiza en una plantilla
 *
 *    Esto asegura que Drops se comporten de forma segura y silenciosa, como lo hacen en Shopify.
 *
 * 3. **Prueba tu implementación usando `liquid_snippets/32_content_for_index.liquid`**
 *
 *    Copia el contenido de ese archivo a tu carpeta `templates/` o donde tu router lo espere.
 *    Este archivo contiene el siguiente Liquid, que debe renderizarse sin errores:
 *
 *    ```liquid
 *    {{ products['camisa-suave-a'].title }}
 *
 *    {{ collections['soft-shirts'].title }}
 *
 *    {% for producto in collections['soft-shirts'].products %}
 *      {{ producto.title }} - {{ producto.precio }}
 *    {% endfor %}
 *
 *    {{ products['no-existe'].title }} → (no error)
 *    {{ collections['fantasma'].products }} → (no error)
 *    ```
 *
 * 4. **Ejecuta `planter.ts` antes de comenzar**
 *
 *    El archivo de base de datos ha sido actualizado con más productos.
 *    Asegúrate de correr `planter.ts` para que tu base esté al día:
 *
 *    ```bash
 *    deno run --allow-read --allow-write --allow-net planter.ts
 *    ```
 *
 * ✅ Resultado esperado:
 * - `products['handle']` y `collections['handle']` devuelven datos útiles si existen
 * - Accesos inválidos retornan valores vacíos sin lanzar errores
 * - Tu motor reconoce que no debe iterar Drops o tratarlos como arreglos
 * - Las colecciones siguen teniendo acceso a sus productos normalmente
 */
