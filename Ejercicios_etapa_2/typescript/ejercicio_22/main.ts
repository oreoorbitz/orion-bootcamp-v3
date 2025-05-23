/**
 * MÓDULO 22: INYECTAR JAVASCRIPT TRANSPILADO EN HTML
 *
 * 🧠 Concepto clave:
 * Aunque Deno permite correr TypeScript directamente, los navegadores no lo soportan.
 * Por eso, necesitamos transpilar nuestro código `.ts` a `.js` y luego insertarlo en la página.
 *
 * `Deno.emit()` nos da el JavaScript como texto (en memoria), así que no necesitamos crear archivos `.js`.
 * Podemos tomar ese resultado y **modificar el HTML directamente, sin usar librerías**.
 *
 * 🎯 Objetivo:
 * Crear una única función que:
 * - Transpile un archivo `.ts` a `.js` en memoria
 * - Inserte ese JS como script inline dentro de un archivo HTML
 * - **Sobrescriba el HTML original con el resultado**
 *
 * ✅ Instrucciones:
 *
 * 1. En la raíz del proyecto (junto a `Ejercicios_etapa_2/`), crea un archivo `injector.ts`
 * 2. Define y exporta la siguiente función:
 *
 * ```ts
 * export async function injector(
 *   tsPath: string,
 *   htmlPath: string
 * ): Promise<void>
 * ```
 *
 * Esta función debe:
 * - Leer el contenido del archivo HTML en `htmlPath`
 * - Usar `Deno.emit()` para transpilar `tsPath` a JavaScript (sin escribir archivos)
 * - Insertar el resultado como `<script>...</script>` justo antes de la etiqueta `</body>`
 * - Sobrescribir el archivo `htmlPath` con el nuevo contenido
 *
 * ⚙️ Importante:
 * - Deno **no tiene un modelo DOM**, así que debes modificar el HTML como string
 * - No uses ninguna librería externa — hazlo con `.replace()` o similares
 *
 *
 * ✅ Ejemplo de uso en `main.ts`:
 *
 * ```ts
 * import { injector } from "../injector.ts";
 *
 * await injector("frontend.ts", "index.html");
 * ```
 *
 * ✅ Resultado esperado:
 * El archivo `index.html` original debe ser reemplazado con una versión que contenga:
 *
 * ```html
 * <html>
 * <body>
 *   ...contenido HTML...
 *   <script>
 *     // tu JS inline aquí
 *     console.log("Este JS se ejecuta en el navegador");
 *   </script>
 * </body>
 * </html>
 * ```
 *
 * 🧪 Consejo:
 * Esta técnica de inyección es común en herramientas modernas como Vite y Astro.
 * Inyectar código inline te permite experimentar rápidamente sin montar servidores o rutas.
 *
 * 🧩 Integración con tu flujo anterior:
 * Puedes elegir cómo probar esta funcionalidad:
 * - Opción A: Crear un HTML sencillo (como `index.html`) a mano para pruebas rápidas
 * - Opción B: Usar el flujo que ya construiste en módulos anteriores (generación con Liquid, layouts, etc.)
 *
 * Ambas opciones son válidas **por ahora**.
 *
 * ⚠️ Pero atención:
 * En el **Módulo 23**, necesitarás que esto funcione con tu flujo de plantillas anterior.
 * El objetivo es agregar hot reload a tu sistema completo, así que asegúrate de tenerlo funcionando pronto.
 */
