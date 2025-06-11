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
 * 1. **Verifica la estructura de tu tema en `typescript/ejercicio_29/`**
 *
 *    Debes tener ya tu proyecto con la siguiente estructura:
 *    - `layout/theme.liquid`
 *    - `templates/content_for_index.liquid`
 *    - `assets/theme.css`
 *    - `main.ts`
 *
 *    Si vienes del ejercicio anterior (`ejercicio_28`), esta estructura ya debe existir.
 *
 * 2. **Actualiza tu archivo `layout/theme.liquid`**
 *
 *    - Reemplaza el uso de `{{ content_for_index }}` por `{{ content_for_layout }}`
 *    - Este marcador actuará como punto de entrada dinámico para el contenido de cualquier plantilla.
 *
 * 3. **Actualiza `controller.ts` para combinar layout + template**
 *
 *    Dentro de tu función de renderizado:
 *
 *    - Lee el archivo `templates/content_for_index.liquid` como plantilla base de contenido.
 *    - Luego, renderízalo con el contexto actual.
 *    - Usa el resultado como valor de `content_for_layout` y pasa ese dato al procesar `layout/theme.liquid`.
 *    - Escribe el HTML final resultante dentro de `themes/dev/dist/index.html`.
 *
 *    También debes asegurarte de que tu lógica de lectura de archivos `.liquid` sea robusta:
 *    - Verifica rutas con cuidado, ya que en el próximo módulo se agregarán plantillas adicionales.
 *    - El nombre del archivo (`content_for_index.liquid`) será reemplazado dinámicamente más adelante.
 *
 * 4. **Prueba el flujo completo**
 *
 *    - Verifica que `layout/theme.liquid` y `templates/content_for_index.liquid` se combinen correctamente
 *      y que el archivo `dist/index.html` contenga ambos resultados.
 *    - Asegúrate de que los estilos de `theme.css` siguen aplicándose.
 *    - Usa `main.ts` para observar cambios y enviar actualizaciones al servidor.
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_29/
 * │   │   ├── layout/
 * │   │   │   └── theme.liquid
 * │   │   ├── templates/
 * │   │   │   └── content_for_index.liquid
 * │   │   ├── assets/
 * │   │   │   └── theme.css
 * │   │   └── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               │   └── theme.liquid
 * │               ├── templates/
 * │               │   └── content_for_index.liquid
 * │               └── dist/
 * │                   ├── index.html
 * │                   └── assets/
 * │                       └── theme.css
 *
 * 🎯 Resultado esperado:
 * El archivo final generado (`dist/index.html`) debe tener el diseño base definido en `layout/theme.liquid`
 * con el contenido dinámico de `templates/content_for_index.liquid` correctamente inyectado en `{{ content_for_layout }}`.
 *
 * Este patrón te preparará para manejar múltiples plantillas y rutas en el siguiente módulo.
 */
