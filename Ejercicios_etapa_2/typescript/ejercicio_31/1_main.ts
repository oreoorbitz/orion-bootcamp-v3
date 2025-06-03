/**
 * MÓDULO 31 (parte 2): SOPORTE PARA `{% render %}` CON CONTEXTO AISLADO
 *
 * 🧠 Concepto clave:
 * Shopify introdujo la directiva `{% render %}` para evitar efectos colaterales entre plantillas.
 * A diferencia de `include`, `render` crea un **contexto aislado** y opcionalmente recibe variables.
 *
 * 🎯 Objetivo:
 * - Implementar `{% render "archivo" %}`
 * - Crear un nuevo contexto limitado (no hereda todas las variables globales)
 * - Permitir pasar variables al snippet como: `{% render "x", producto: producto, destacado: true %}`
 *
 * ✅ Instrucciones:
 *
 * 1. En `collection.liquid`, actualiza el uso del snippet:
 * ```liquid
 * {% for product in collection.products %}
 *   {% render "product-card", product: product, destacado: true %}
 * {% endfor %}
 * ```
 *
 * 2. El archivo `snippets/product-card.liquid` puede usar esas variables:
 * ```liquid
 * <div class="product-card {% if destacado %}destacado{% endif %}">
 *   <h2>{{ product.title }}</h2>
 * </div>
 * ```
 *
 * 3. Modifica tu sistema para que:
 *    - Detecte `{% render "archivo", clave1: valor1, clave2: valor2 %}`
 *    - Genere un nuevo contexto que contenga solo esas variables
 *    - Cargue el archivo de `snippets/`, lo tokenice y lo procese usando ese nuevo contexto
 *    - El scope debe ser aislado (no hereda automáticamente el contexto externo)
 *
 * ✅ Resultado esperado:
 * - El contenido del snippet se renderiza con un contexto limpio
 * - Las variables pasadas explícitamente están disponibles dentro del snippet
 * - Otras variables externas no se pueden acceder (a menos que las pases)
 *
 * 🧠 Consejo:
 * - Si ya tienes `include`, puedes construir `render` encima:
 *   1. Extraer el nombre del archivo
 *   2. Evaluar las expresiones que siguen como claves y valores
 *   3. Crear un nuevo objeto de contexto limitado
 *
 * 🚀 En Shopify, `render` es la forma recomendada de incluir snippets. Te prepara para evitar errores
 * y mantener plantillas limpias y predecibles.
 */
