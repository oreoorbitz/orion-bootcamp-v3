/**
 * MÓDULO 33: ARCHIVOS DE CONFIGURACIÓN PARA AJUSTES GLOBALES
 *
 * 🧠 Concepto clave:
 * En Shopify, los ajustes globales del tema se gestionan a través de dos archivos JSON:
 *
 * - `settings_schema.json`: lo define el desarrollador del tema y describe los inputs configurables
 * - `settings_data.json`: lo actualiza el usuario (por ejemplo desde el editor visual de Shopify) con los valores reales
 *
 * Vamos a replicar esta estructura para separar claramente la definición del esquema y el estado actual de los valores.
 *
 * 🎯 Objetivos:
 * - Crear una carpeta `config/` que contenga los dos archivos necesarios
 * - Usar estos archivos para exponer configuraciones globales y de secciones dentro del contexto de Liquid
 * - Preparar el sistema para que en el próximo módulo puedas modificar `settings_data.json` desde una CLI
 *
 * ✅ Instrucciones:
 *
 * 1. Crea una carpeta `config/` dentro de tu ejercicio actual.
 *    A partir de este módulo, Mockify debe verificar la existencia de esta carpeta.
 *
 * 2. Dentro de `config/`, crea un archivo llamado `settings_schema.json`.
 *
 *    ✅ **Copia exactamente** el siguiente contenido:
 *    ```json
 *    [
 *      {
 *        "name": "Layout",
 *        "settings": [
 *          {
 *            "type": "range",
 *            "id": "page_width",
 *            "label": "Ancho de página",
 *            "min": 1000,
 *            "max": 1600,
 *            "step": 100,
 *            "default": 1200,
 *            "unit": "px"
 *          },
 *          {
 *            "type": "checkbox",
 *            "id": "animations_reveal_on_scroll",
 *            "label": "Animaciones al hacer scroll",
 *            "default": true
 *          }
 *        ]
 *      }
 *    ]
 *    ```

 * 3. Dentro de `config/`, crea un archivo llamado `settings_data.json`.
 *
 *    ✅ **Copia exactamente** el siguiente contenido:
 *    ```json
 *    {
 *      "current": {
 *        "page_width": 1200,
 *        "animations_reveal_on_scroll": true
 *      },
 *      "sections": {
 *        "featured-collection": {
 *          "type": "featured-collection",
 *          "settings": {
 *            "header": "Lo más vendido",
 *            "sub_text": "Productos que no fallan",
 *            "collection": "soft-shirts"
 *          }
 *        }
 *      }
 *    }
 *    ```

 * 4. En tu archivo `contextPlease.ts`, modifica la lógica para:
 *    - Leer el contenido de `settings_schema.json` y `settings_data.json` usando `Deno.readTextFile`
 *    - Parsear ambos con `JSON.parse()`
 *    - Exponer la propiedad `settings` en el contexto global, usando `settings_data.current`
 *    - Asegurarte de que las secciones renderizadas reciban sus `section.settings` desde `settings_data.sections`
 *
 * 🧠 Consejo:
 * - En Shopify, el `settings_schema.json` lo escribe el desarrollador y actúa como contrato.
 * - El `settings_data.json` lo actualiza el usuario desde el editor visual. Nosotros no tenemos ese editor todavía,
 *   así que **tú simularás este paso editando el JSON directamente**.
 *
 * ✅ Resultado esperado:
 *
 * En tu plantilla principal (`index.liquid` o similar), puedes usar:
 * ```liquid
 * {{ settings.page_width }}       → 1200
 * {{ settings.animations_reveal_on_scroll }} → true
 * ```
 *
 * Y en `sections/featured-collection.liquid`, debes poder acceder a:
 * ```liquid
 * <h2>{{ section.settings.header }}</h2>
 * <p>{{ section.settings.sub_text }}</p>
 *
 * {% for product in collections[section.settings.collection].products %}
 *   {% render 'product-card', product: product %}
 * {% endfor %}
 * ```

 * 🚨 Recomendaciones técnicas:
 * - No necesitas validar tipos ni valores, Shopify tampoco lo hace
 * - Esta estructura será extendida en el próximo módulo con una CLI que modifica `settings_data.json`
 */
