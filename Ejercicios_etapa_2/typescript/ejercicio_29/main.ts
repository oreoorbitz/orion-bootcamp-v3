/**
 * MÓDULO 29: RUTEO Y PLANTILLAS DINÁMICAS PARA PRODUCTOS Y COLECCIONES
 *
 * 🧠 Concepto clave:
 * En un sitio web dinámico (como una tienda), las rutas definen qué contenido mostrar.
 *
 * - `/products/gold-necklace` debe mostrar un producto específico
 * - `/collections/sale` debe mostrar una colección y sus productos relacionados
 *
 * En este módulo, vas a:
 * - Generar una página HTML por cada producto y colección
 * - Renderizar esas páginas con tus plantillas Liquid
 * - Servirlas desde tu servidor actual
 * - Mantener funcionando el hot reload
 *
 * 🎯 Objetivo:
 * - Implementar ruteo basado en archivos HTML precompilados
 * - Generar una página por ruta (`/products/:handle`, `/collections/:handle`)
 * - Usar las plantillas `product.liquid` y `collection.liquid` con datos desde SQLite
 *
 * ✅ Instrucciones:
 *
 * 1. Crea una carpeta de plantillas si aún no la tienes:
 *
 * ```
 * templates/
 * ├── product.liquid
 * └── collection.liquid
 * ```
 *
 * 2. Actualiza tu proceso de build para que:
 *    - Compile un HTML por producto y por colección
 *    - Guarde cada archivo en `dist/products/:handle.html` o `dist/collections/:handle.html`
 *    - Siga inyectando el script de hot reload al final del `<body>`
 *
 * 📝 Ejemplo de cómo podrías usar `contextPlease.ts` para preparar los datos para cada página:
 * (esto es solo una referencia de uso, no lo copies literalmente)
 *
 * ```ts
 * const productos = await getAllProductsFromDB();
 * for (const producto of productos) {
 *   const contexto = { product: producto };
 *   const html = renderizarHTML(template, contexto); // o como sea que implementaste el render
 *   const finalHtml = await injector(html, "server/hotreload.ts");
 *   await saveHtml(`dist/products/${producto.handle}.html`, finalHtml);
 * }
 * ```
 *
 * 3. Actualiza tu servidor para:
 *    - Servir archivos desde `dist/` según la URL solicitada
 *    - Por ejemplo, `/products/gold-necklace` → `dist/products/gold-necklace.html`
 *    - `/collections/sale` → `dist/collections/sale.html`
 *
 * 4. Asegúrate de que el hot reload siga funcionando.
 *    - El script inyectado en cada HTML debe seguir conectándose al WebSocket
 *    - Cuando modifiques una plantilla, los archivos afectados deben ser regenerados
 *
 * ✅ Ejemplo de contenido esperado en una plantilla de colección (`collection.liquid`)
 * (esta plantilla debe estar en `templates/collection.liquid`)
 *
 * ```liquid
 * <h1>{{ collection.title }}</h1>
 * <ul>
 *   {% for producto in collection.products %}
 *     <li>
 *       <a href="/products/{{ producto.handle }}">
 *         {{ producto.title }}
 *       </a>
 *     </li>
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Ejemplo de contenido esperado en una plantilla de producto (`product.liquid`)
 *
 * ```liquid
 * <h1>{{ product.title }}</h1>
 * <p>{{ product.description }}</p>
 * ```
 *
 * ✅ Ejemplo de cómo una plantilla puede vincular a una colección
 * (por ejemplo, en `index.liquid` o cualquier otra):
 *
 * ```liquid
 * <a href="/collections/sale">Ver ofertas</a>
 * ```
 *
 * 🧠 Consejo:
 * - No estás creando un servidor dinámico: estás generando páginas HTML individuales que el servidor sirve como archivos
 * - El ruteo se basa en el nombre del archivo `.html` dentro de `dist/`
 *
 * ✅ Verifica:
 * - Que se genera un archivo `.html` por cada producto y colección
 * - Que esos archivos contienen el contenido correcto y el script de hot reload
 * - Que el servidor puede servirlos correctamente cuando se accede por URL
 * - Que los enlaces en la página funcionan y llevan al archivo HTML correcto
 */
