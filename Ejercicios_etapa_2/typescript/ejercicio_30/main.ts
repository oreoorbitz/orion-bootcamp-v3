/**
 * MÓDULO 30: SECCIONES CON ESQUEMA Y CONFIGURACIÓN BÁSICA
 *
 * 🧠 Concepto clave:
 * En motores como Shopify, las "secciones" (`sections/`) son bloques independientes y reutilizables de contenido,
 * que pueden ser incluidos dentro de plantillas (`templates/`) como componentes.
 *
 * Cada sección puede tener su propio esquema (`{% schema %}`), definido en JSON, que describe qué configuraciones acepta.
 * Estas configuraciones se acceden mediante `section.settings.<id>` dentro del contenido de la sección.
 *
 * 🔧 Por ahora:
 * - Las secciones estarán asociadas directamente a una plantilla específica (relación fija).
 * - Solo se soportará un tipo de configuración: `text`
 *
 * Objetivo:
 * - Crear secciones que aceptan configuraciones a través de un esquema definido en la plantilla Liquid.
 * - Implementar el reconocimiento y parseo del bloque `{% schema %}` con contenido JSON.
 * - Permitir el acceso a `section.settings.<id>` dentro del contenido de la sección.
 *
 * ✅ Instrucciones:
 * 1. Crea una carpeta llamada `sections/` en tu ejercicio actual.
 * 2. Mockify debe validar la existencia de esta carpeta.
 *
 * 3. Crea un archivo de sección Liquid (por ejemplo, `hero.liquid`) con la siguiente estructura:
 * ```
 * <div class="hero">
 *   <h1>{{ section.settings.titulo }}</h1>
 * </div>
 *
 * {% schema %}
 * {
 *   "name": "Hero",
 *   "settings": [
 *     {
 *       "type": "text",
 *       "id": "titulo",
 *       "label": "Título principal"
 *     }
 *   ]
 * }
 * {% endschema %}
 * ```
 *
 * 4. Agrega soporte en tu motor de plantillas para:
 *    - Detectar el bloque `{% schema %}` y extraer su contenido JSON
 *    - Parsear este JSON y almacenarlo como `section.settings`
 *    - Permitir acceder a `{{ section.settings.<id> }}` dentro del contenido principal
 *
 * 5. Puedes inyectar valores de prueba en `section.settings` desde tu servidor hasta que más adelante
 *    se defina cómo configurar secciones vía archivos externos.

 * 🔁 Verifica:
 * - Que la carpeta `sections/` exista
 * - Que los archivos `.liquid` dentro de `sections/` incluyan un bloque `{% schema %}` válido
 * - Que tu motor extraiga y valide el JSON del esquema
 * - Que `section.settings.<id>` esté disponible como variable dentro del contenido renderizado
 * - Que Mockify valide la existencia de `sections/` y reporte errores si falta
 *
 * 📁 Estructura esperada:
 * ├── sections/
 * │   └── hero.liquid
 * └── templates/
 *     └── collection.liquid
 *
 * 🧩 Consejo:
 * - No necesitas aún un archivo externo para los valores de `section.settings`.
 *   Puedes definir una configuración fija desde tu servidor para cada sección mientras desarrollas.
 *
 * Este módulo abre el camino para construir interfaces visuales como el editor de temas de Shopify.
 */
