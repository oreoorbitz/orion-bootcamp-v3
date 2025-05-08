/**
 * MÓDULO 28: TIPOS DE ARREGLOS ASOCIATIVOS EN LIQUID

 * 🧠 Concepto clave:
 * En motores de plantillas como Liquid, los datos pueden organizarse en estructuras similares a objetos o arreglos.
 * Estas estructuras deben comportarse de manera predecible según su tipo:
 * 
 * - Un arreglo indexado puede recorrerse con bucles (`{% for %}`)
 * - Un objeto con claves accede a propiedades por nombre (`obj.key` o `obj['key']`)
 * - Algunas estructuras especiales globales combinan ambos comportamientos pero requieren restricciones futuras

 * En este módulo, vas a definir tres tipos de estructuras que tu motor Liquid debe reconocer y manejar correctamente.

 * 🎯 Objetivo:
 * Implementar soporte para 3 tipos de arreglos asociativos:
 * 
 * 1. **Arreglos indexados** (listas normales):
 *    - Se acceden con índice (`[0]`, `[1]`, etc.)
 *    - Pueden iterarse usando `{% for item in lista %}`
 *    - Son 0-indexados
 * 
 * 2. **Colecciones con claves (key-based)**:
 *    - No son iterables
 *    - Se acceden por `obj.propiedad` o `obj['propiedad']`
 *    - Usados para estructuras fijas con nombre (como configuraciones o grupos de datos relacionados)

 * 3. **Colecciones híbridas especiales (hybrid collections)**:
 *    - Se usan para variables globales como `collections` o `all_products`
 *    - Tienen dos formas de acceso:
 *      - `hybrid[0]` para acceso por índice
 *      - `hybrid['titulo-promocion']` para acceso por clave
 *    - Deben implementarse con un **sistema de limitaciones** que permita, por ejemplo:
 *      - Limitar la cantidad de productos que se procesan
 *      - Filtrar o cortar elementos al principio o final del recorrido
 *    - Este sistema asegura que en el futuro puedas controlar el rendimiento sin romper compatibilidad

 * ✅ Instrucciones:

 * 1. En tu motor Liquid, agrega una función de tipo "resolución de colección" que detecte si la variable es:
 *    - Una lista iterable (`Array.isArray()` o similar)
 *    - Un objeto con claves (`typeof === 'object'`)
 *    - Una colección híbrida (ver punto 3)

 * 2. Para las **colecciones híbridas**:
 *    - Crea una clase `HybridCollection` o similar
 *    - Internamente debe contener:
 *      - Un arreglo indexado (`this.lista`)
 *      - Un objeto con claves (`this.mapa`)
 *    - Implementa acceso por índice y por clave con lógica de fallback
 *    - Implementa un sistema de limitaciones como:
 *      ```ts
 *      collection.setLimit((items) => items.slice(0, 20));
 *      ```
 *      para limitar el número de elementos que se pueden recorrer o mostrar

 * 3. Asegúrate de que tu motor respete:
 *    - Solo iterar si el valor es verdaderamente iterable
 *    - Lanzar errores claros si se intenta iterar un objeto no iterable

 * 4. Expón en tus plantillas al menos una variable de cada tipo:
 *    ```liquid
 *    {% for producto in productos %} {{ producto.nombre }} {% endfor %}
 *    {{ configuracion.color }}
 *    {{ all_products['collar-oro'] }}
 *    ```

 * 🧪 Ejemplo de contexto sugerido:
 * ```ts
 * const contexto = {
 *   productos: [
 *     { nombre: "Collar A" },
 *     { nombre: "Collar B" }
 *   ],
 *   configuracion: {
 *     color: "azul",
 *     version: "1.2.0"
 *   },
 *   all_products: new HybridCollection([
 *     { nombre: "Collar C" },
 *     { nombre: "Collar D" }
 *   ], {
 *     "collar-c": { nombre: "Collar C" },
 *     "collar-d": { nombre: "Collar D" }
 *   }).setLimit((arr) => arr.slice(0, 1))
 * };
 * ```

 * 🧠 Consejo:
 * - El sistema de limitación es importante porque en proyectos reales,
 *   como una tienda con miles de productos, **mostrar todo puede causar bloqueos o lentitud**
 * - Este patrón prepara tu motor para escalar en el futuro, como lo hace Shopify

 */
