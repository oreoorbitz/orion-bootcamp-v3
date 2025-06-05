/**
 * 🧩 MÓDULO 29: Separar plantilla base y contenido mediante `layout` y `templates`
 *
 * 🧠 Concepto clave:
 * En este módulo vas a separar la lógica del diseño principal (layout) del contenido específico de cada página (template).
 * Este patrón imita la arquitectura de temas de Shopify, donde `layout/theme.liquid` sirve como contenedor general
 * y cada archivo dentro de `templates/` representa el contenido de una página específica.
 *
 * 🎯 Objetivo:
 * - Crear una estructura más escalable separando `layout` y `templates`.
 * - Usar la variable especial `{{ content_for_layout }}` para inyectar el contenido de plantilla en el diseño base.
 * - Mantener la renderización en `controller.ts` con esta nueva estructura.
 *
 * ✅ Instrucciones:
 *
 * 1. **Reestructura tu tema en `typescript/ejercicio_29/`**
 *
 *    - Crea una nueva carpeta `templates/`
 *    - Mueve el archivo `content_for_index.liquid` dentro de esta carpeta y renómbralo como `index.liquid`
 *
 *    - Crea una nueva carpeta `layout/`
 *    - Mueve el archivo `theme.liquid` a esa carpeta (la ruta final debe ser: `layout/theme.liquid`)
 *
 *    - Verifica que tu tema siga incluyendo una carpeta `assets/` con estilos y/o scripts
 *
 * 2. **Actualiza tu archivo `layout/theme.liquid`**
 *
 *    - Reemplaza el uso de `{{ content_for_index }}` por `{{ content_for_layout }}`
 *    - Este marcador actuará como punto de entrada dinámico para el contenido de cualquier plantilla
 *
 * 3. **Actualiza `controller.ts` para manejar `layout` + `template`**
 *
 *    En tu función de renderizado dentro de `controller.ts`:
 *
 *    - Lee y procesa el archivo `templates/index.liquid` como el contenido específico de la página.
 *    - Luego, lee y procesa `layout/theme.liquid` como contenedor global.
 *    - Asegúrate de pasar el contenido renderizado del template como una variable llamada `content_for_layout`
 *      dentro del contexto que se usa al renderizar el layout.
 *    - Escribe el resultado final en `themes/dev/dist/index.html` como siempre.
 *
 *    > 🧠 No necesitas manejar rutas todavía. Por ahora, siempre usa `index.liquid` como template.
 *
 * 4. **Prueba el flujo completo**
 *
 *    - Asegúrate de que la salida final combine correctamente el contenido de `templates/index.liquid`
 *      dentro del diseño definido en `layout/theme.liquid`, y que aparezca renderizado como `dist/index.html`.
 *    - Verifica que los estilos CSS aún funcionen correctamente.
 *    - Usa tu servidor y haz un fetch como hiciste en ejercicios anteriores si necesitas regenerar el HTML.
 *
 * 📁 Estructura esperada:
 * ```
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_29/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts          ← Ahora maneja layout + template combinados
 * │       ├── contextPlease.ts       ← Contexto generado como antes
 * │       ├── slightlyLate.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── assets/
 * │               └── dist/
 * │                   └── index.html
 * ```
 *
 * 🎯 Resultado esperado:
 * El archivo final generado (`dist/index.html`) debe tener el diseño base definido en `layout/theme.liquid`
 * con el contenido dinámico de `templates/index.liquid` correctamente inyectado en `{{ content_for_layout }}`.
 *
 * Este patrón te preparará para manejar múltiples plantillas y rutas en el siguiente módulo.
 */
