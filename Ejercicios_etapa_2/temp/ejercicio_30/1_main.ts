/**
 * MÓDULO 30 (parte 2): GENERAR HTML POR RUTA Y ENLACES ENTRE PÁGINAS
 *
 * 🧠 Concepto clave:
 * En este archivo tomarás las rutas definidas en `0_main.ts` y las usarás para:
 * - Cargar y renderizar la plantilla asociada
 * - Inyectar el script de hot reload
 * - Guardar el archivo HTML en `dist/`
 *
 * También debes asegurarte de que tus objetos `product` y `collection` tengan una propiedad `.url`
 * para que las plantillas puedan generar enlaces entre páginas.
 *
 * 🎯 Objetivo:
 * - Generar archivos HTML para cada ruta
 * - Asegurar enlaces navegables entre páginas usando `.url`
 * - Mantener el hot reload funcionando en todas las rutas
 *
 * ✅ Instrucciones:
 *
 * 1. Copia la lista de rutas que definiste en `0_main.ts` y pégala al inicio de este archivo.
 *    - Cada entrada debe incluir: `url`, `template`, y `context`
 *
 * 2. Asegúrate de que los datos provenientes de `contextPlease.ts` ya incluyan `.url` en cada producto y colección:
 *
 * 📝 Ejemplo de cómo agregar `.url` (esto ocurre en el modelo, no aquí):
 * ```ts
 * product.url = `/products/${product.handle}`;
 * collection.url = `/collections/${collection.handle}`;
 * ```
 *
 * 3. Para cada ruta:
 *    - Carga la plantilla desde `templates/`
 *    - Renderiza el HTML con el contexto de la ruta
 *    - Inyecta el script de hot reload
 *    - Guarda el archivo resultante en `dist/` respetando la estructura de URL
 *
 * ✅ Ejemplo de flujo general (solo referencia, no copiar literalmente):
 * ```ts
 * for (const ruta of rutas) {
 *   const plantilla = await Deno.readTextFile(`templates/${ruta.template}`);
 *   const html = renderizar(plantilla, ruta.context); // o como hayas implementado tu render
 *   const finalHtml = await injector(html, "server/hotreload.ts");
 *
 *   const outputPath = `dist${ruta.url}.html`;
 *   await saveHtml(outputPath, finalHtml);
 * }
 * ```
 *
 * ✅ Liquid que puedes usar en `content_for_index.liquid`:
 * ```liquid
 * <ul>
 *   {% for collection in collections %}
 *     <li><a href="{{ collection.url }}">{{ collection.title }}</a></li>
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Liquid que puedes usar en `collection.liquid`:
 * ```liquid
 * <h1>{{ collection.title }}</h1>
 * <ul>
 *   {% for product in collection.products %}
 *     <li><a href="{{ product.url }}">{{ product.title }}</a></li>
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Liquid que puedes usar en `product.liquid`:
 * ```liquid
 * <h1>{{ product.title }}</h1>
 * <p>{{ product.description }}</p>
 * ```
 *
 * 🧠 Consejo:
 * - Este archivo representa tu controlador: toma decisiones de flujo, no transforma datos
 * - Toda lógica de `.url` debe venir ya preparada desde el modelo (`contextPlease.ts`)
 * - Cada archivo HTML debe ser completamente funcional y estar listo para navegación entre rutas
 *
 * ✅ Verifica:
 * - Que cada archivo `.html` esté correctamente guardado en `dist/`
 * - Que el script de hot reload esté presente
 * - Que los enlaces entre páginas funcionen correctamente
 */
