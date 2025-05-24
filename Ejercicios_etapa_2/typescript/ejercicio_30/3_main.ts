/**
 * MÓDULO 30 (parte 3): CREAR ENLACES ENTRE PÁGINAS USANDO PROPIEDADES `.url`
 *
 * 🧠 Concepto clave:
 * Ahora que estás generando una página HTML por producto y colección, necesitas que las plantillas puedan
 * generar enlaces entre ellas. Para esto, debes incluir una propiedad `.url` en cada objeto `product` y `collection`.
 *
 * Esta propiedad indica la ruta relativa de cada entidad, y debe calcularse dentro de tu modelo (`contextPlease.ts`),
 * no en el controlador.
 *
 * 🎯 Objetivo:
 * - Enriquecer los objetos de producto y colección con una propiedad `url`
 * - Usar esa propiedad en tus plantillas Liquid para generar enlaces navegables
 *
 * ✅ Instrucciones:
 *
 * 1. Dentro de `contextPlease.ts`, al preparar el contexto:
 *    - Para cada producto, agrega: `product.url = "/products/" + product.handle`
 *    - Para cada colección, agrega: `collection.url = "/collections/" + collection.handle`
 *    - Este paso debe ocurrir antes de que los datos sean retornados al controlador
 *
 * 📝 Ejemplo de uso (solo una referencia, no copiar literalmente):
 *
 * ```ts
 * for (const collection of collectionsFromDB) {
 *   collection.url = `/collections/${collection.handle}`;
 *   for (const product of collection.products) {
 *     product.url = `/products/${product.handle}`;
 *   }
 * }
 * ```
 *
 * 2. En tus plantillas, usa `.url` para generar los enlaces entre páginas:
 *
 * ✅ Enlace a una colección desde content_for_index:
 * ```liquid
 * <a href="{{ collection.url }}">Ver colección</a>
 * ```
 *
 * ✅ Iterar los productos de una colección:
 * ```liquid
 * <h1>{{ collection.title }}</h1>
 * <ul>
 *   {% for producto in collection.products %}
 *     <li><a href="{{ producto.url }}">{{ producto.title }}</a></li>
 *   {% endfor %}
 * </ul>
 * ```
 *
 * 3. Actualiza `Mockify` si es necesario:
 * - A partir de ahora, estás generando múltiples archivos HTML:
 *   - `dist/products/:handle.html`
 *   - `dist/collections/:handle.html`
 *
 * 📦 Mockify debe validar:
 * - Que existe una carpeta `dist/products/`
 * - Que existe una carpeta `dist/collections/`
 * - Que dentro de esas carpetas hay archivos `.html` correspondientes a cada entidad
 * - Si falta alguno, debe mostrar un mensaje de advertencia o error
 *
 * 🧠 Consejo:
 * - El objetivo es mantener la lógica de datos en el modelo (`contextPlease.ts`)
 * - El controlador (`main.ts`) solo usa esos datos para renderizar
 * - Las plantillas Liquid deben poder usar `.url` sin saber cómo se calculó
 *
 * ✅ Verifica:
 * - Que todos los objetos tengan `.url` al momento de renderizar
 * - Que los enlaces generados en HTML correspondan con los archivos generados en `dist/`
 * - Que Mockify valide correctamente la estructura del proyecto
 */
