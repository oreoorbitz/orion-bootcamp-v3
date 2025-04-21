/**
 * MÓDULO 18: CONVERSIÓN DE TYPESCRIPT A JAVASCRIPT + SIMULACIÓN DE PILA DE EVENTOS
 *
 * 🧠 Concepto clave:
 * Hasta este punto, nuestro sistema funciona como una **compilación unidireccional**: tomamos datos,
 * los transformamos mediante una plantilla, y generamos archivos HTML. Una vez generado el HTML,
 * ese documento existe como un archivo independiente. Esto es un **flujo de una sola vía (one-way stream)**.
 *
 * Sin embargo, en el navegador tradicional, JavaScript fue inventado para **modificar HTML ya existente**,
 * lo que permite flujos **bidireccionales**, donde los datos pueden cambiar la vista, y la vista puede disparar eventos
 * que modifican los datos.
 *
 * En este módulo, vas a:
 * - Convertir TypeScript a JavaScript usando `Deno.emit()`
 * - Inyectar ese JavaScript en una página HTML generada
 * - Simular una **pila de eventos**, que representa en qué estado se encuentra tu sistema
 * - Preparar el camino para que otras herramientas externas puedan "esperar" a que ciertos eventos hayan ocurrido
 *   antes de hacer modificaciones adicionales sobre el HTML.
 *
 * 🧱 ¿Por qué usamos una pila de eventos?
 * Cuando varios procesos (por ejemplo, filtros, renderizadores, extensiones) interactúan con el HTML generado,
 * necesitan una forma de saber *cuándo* es seguro hacer su trabajo. Al mantener una lista con el historial de eventos,
 * cualquier herramienta puede saber qué pasos ya se ejecutaron y en qué orden.
 *
 * 🎯 Objetivo:
 * - Inyectar un archivo TypeScript convertido a JavaScript como un `<script>` inline en el HTML
 * - Registrar todos los pasos del proceso en una `stackEventos`
 *
 * Instrucciones:
 * 1. Crea una función:
 *    `convertirATranspilarYInyectarScript(rutaArchivoTS: string, html: string, stackEventos: string[]): string`
 *
 *    Esta función debe:
 *    - Usar `Deno.emit()` para convertir el archivo `.ts` a JavaScript
 *    - Inyectar el código generado como un `<script>` justo antes de `</body>` en el HTML
 *    - Registrar `"ts->js compilado"` y `"script inyectado"` en la `stackEventos`
 *
 * 2. Asegúrate de que cualquier modificación HTML a través de filtros o herramientas pueda consultar `stackEventos`
 *    antes de ejecutarse, por ejemplo:
 *
 * ```ts
 * if (!stackEventos.includes('html-finalizado')) {
 *   throw new Error("Aún no puedes modificar el HTML: falta el paso final.");
 * }
 * ```
 *
 * 3. Incluye un bloque visible en el HTML que imprima la pila como comentario o sección oculta:
 *
 * ```html
 * <!-- stackEventos: ["render inicio", "ts->js compilado", "script inyectado", "html-finalizado"] -->
 * ```
 *
 * 4. Opcional: crea un archivo `global.ts` que defina una función simple, como:
 * ```ts
 * console.log("¡Mi script fue inyectado correctamente!");
 * ```
 * …y verifica que se incluya automáticamente en el HTML renderizado.
 *
 * Consejo:
 * - Si quieres más control, puedes colocar los scripts antes del cierre de `</body>` pero después de cualquier otro contenido.
 * - Para evitar que se inyecte varias veces, puedes agregar un marcador como: `<!-- script-inyectado -->`
 *
 * Resultado esperado:
 * - Un archivo HTML válido que contiene un `<script>` generado dinámicamente
 * - Una pila de eventos accesible desde el contexto de ejecución, tanto desde consola como desde otros filtros
 * - Un sistema básico de coordinación que simula cómo frameworks y navegadores manejan ciclos de vida
 *
 * 🚀 Este módulo te prepara para comprender cómo las aplicaciones modernas combinan pasos de compilación
 * con ejecución progresiva y herramientas externas.
 */
