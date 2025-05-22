/**
 * MÓDULO 21: SOPORTE PARA LAYOUTS Y `content_for_index`

 * 🧠 Concepto clave:
 * En sistemas como Shopify, cada página se construye a partir de una **plantilla principal (layout)**,
 * que define la estructura global del documento HTML (`<html>`, `<head>`, `<body>`, etc.).

 * El contenido dinámico de cada página se "inyecta" en un espacio reservado llamado `{{ content_for_index }}`.
 * Esto permite separar el diseño general (header, footer, scripts) del contenido específico de cada plantilla.

 *
 * 🎯 Objetivo:
 * Agregar soporte para layouts y la variable `content_for_index` en tu compilador Liquid.

 *
 * ✅ Instrucciones:

 * 1. En cada ejercicio vas a crear un archivo `theme.liquid`, con estructura básica:
 * ```liquid
 * <html>
 *   <head>
 *     <meta charset="UTF-8"></meta>
 *     <title>Titulo temporar</title>
 *   </head>
 *   <body>
 *     {{ content_for_index }}
 *   </body>
 * </html>
 * ```

 * 2. Modifica tu función `renderizarArchivoLiquid` o crea una nueva que:
 *    - Primero vamos a renderizar el archivo content_for_index.liquid.
 *      el mismo objecto de contexto que será declarado en main(no es necesario hacer data.ts por el momento) a todo los archivos.
 *    - Luego lea el layout (`theme.liquid`)
 *    - Reemplace `{{ content_for_index }}` con el HTML generado de el archivo content_for_index.liquid
 *    - Renderice el layout final con el mismo contexto (por si usa variables como `settings`)

 * 3. Asegúrate de que el contenido insertado ya esté procesado (con variables, condicionales, bucles, etc.)

 *
 * ✅ Resultado esperado:
 * Una estructura como esta:
 * - content_for_index.liquid → contiene el contenido para tu pagina principal
 * - theme.liquid` → contiene la estructural global de tu pagina
 * - Resultado final en `dist/index.html` combina ambos, usando el placeholder `{{ content_for_index }}`

 *
 * 🧪 Ejemplo:
 * content_for_index.liquid
 * ```liquid
 * <h1>{{ producto.titulo }}</h1>
 * <p>{{ producto.descripcion }}</p>
 * ```

 * theme.liquid
 * ```liquid
 * <html>
 *   <head><title>{{ settings.titulo }}</title></head>
 *   <body>
 *     {{ content_for_index }}
 *   </body>
 * </html>
 * ```

 * // contexto:
 * {
 *   producto: { titulo: "Camisa", descripcion: "De algodón" },
 *   settings: { titulo: "Mi tienda" }
 * }

 * // resultado final esperado:
 * ```html
 * <html>
 *   <head><title>Mi tienda</title></head>
 *   <body>
 *     <h1>Camisa</h1>
 *     <p>De algodón</p>
 *   </body>
 * </html>
 * ```

 *
 * ✅ Consejo:
 * - Si quieres mantener tu función limpia, considera:
 *    - `renderizarContenido()` → solo para la plantilla
 *    - `inyectarEnLayout(layout: string, content: string, contexto: Record<string, any>)`

 * Este patrón te prepara para proyectos grandes, donde muchas vistas comparten un diseño base común.
 */
