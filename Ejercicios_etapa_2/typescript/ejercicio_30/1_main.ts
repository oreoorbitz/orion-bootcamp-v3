/**
 * MÓDULO 30 (parte 2): GENERACIÓN Y SERVICIO DE HTML DINÁMICO CON RUTAS
 *
 * 🧠 Concepto clave:
 * En la parte anterior, definiste una lista de rutas, cada una con su URL, plantilla y contexto.
 * Ahora vas a generar los archivos HTML correspondientes y asegurarte de que se sirvan correctamente
 * desde tu servidor actual.
 *
 * Este paso conecta tu ruteo interno con el HTML real que se mostrará en el navegador.
 *
 * 🎯 Objetivo:
 * - Tomar la estructura de rutas que preparaste
 * - Renderizar HTML usando tus plantillas y contextos
 * - Inyectar el script de hot reload
 * - Escribir los archivos HTML en `dist/` siguiendo la estructura de rutas
 *
 * ✅ Instrucciones:
 *
 * 1. Copia la estructura de rutas que creaste en `0_main.ts` y pégala en este archivo.
 *    Aquí es donde vas a hacer el render final de cada página.
 *
 * 2. Usa tu motor de plantillas para generar el HTML correspondiente a cada ruta.
 *    - Usa `renderizarHTML(plantilla, contexto)` o el equivalente que estés usando
 *    - Usa tu módulo `injector()` para inyectar el script de hot reload
 *    - Guarda el resultado en la ubicación adecuada dentro de `dist/`
 *
 * 📝 Ejemplo del flujo general (esto es solo una referencia de uso, no lo copies literalmente):
 *
 * ```ts
 * import { renderizarHTML } from "../path/to/liquidRenderer.ts";
 * import { injector } from "../server/injector.ts";
 * import { writeFile } from "../path/to/utils.ts";
 *
 * for (const ruta of rutas) {
 *   const rawHtml = await renderizarHTML(`templates/${ruta.template}`, ruta.context);
 *   const finalHtml = await injector(rawHtml, "server/hotreload.ts");
 *
 *   const outputPath = `dist${ruta.url}.html`;
 *   await writeFile(outputPath, finalHtml);
 * }
 * ```
 *
 * 3. Verifica que tu servidor está configurado para:
 *    - Servir cualquier archivo HTML desde `dist/` según la URL solicitada
 *    - Por ejemplo, `/products/gold-necklace` debe servir `dist/products/gold-necklace.html`
 *
 * 4. Asegúrate de que el hot reload siga funcionando.
 *    - El script debe estar inyectado en cada archivo
 *    - Cuando modifiques una plantilla o archivo de datos, los HTML correspondientes deben regenerarse
 *
 * ✅ Verifica:
 * - Que se genera un archivo `.html` por cada producto y colección
 * - Que están guardados en rutas como:
 *   - `dist/products/:handle.html`
 *   - `dist/collections/:handle.html`
 * - Que los enlaces entre páginas funcionan correctamente en el navegador
 * - Que el servidor los sirve correctamente
 * - Que el script de hot reload está presente en cada HTML generado
 *
 * 🧠 Consejo:
 * - Esta arquitectura te permite generar sitios completos sin necesidad de un servidor dinámico
 * - En siguientes módulos, extenderás este patrón para otras páginas, secciones o contenido personalizado
 */
