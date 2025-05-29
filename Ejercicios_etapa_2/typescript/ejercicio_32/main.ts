/**
 * MÓDULO 32: SISTEMA DE SECCIONES ESTÁTICAS Y SCHEMA DE CONFIGURACIÓN
 *
 * 🧠 Concepto clave:
 * En Shopify, las páginas están compuestas por bloques reutilizables llamados **secciones**.
 * Cada sección puede tener un esquema (`schema`) que define qué contenido se puede configurar.
 *
 * En este módulo:
 * - Vas a implementar soporte para una nueva directiva `{% section %}`
 * - Y para un bloque `{% schema %}` que definirá los campos configurables de la sección
 * - Las configuraciones estarán disponibles dentro de `section.settings`
 *
 * 🎯 Objetivos:
 * - Implementar soporte para `{% section 'nombre' %}`
 * - Procesar un bloque `{% schema %}` dentro de los archivos de sección
 * - Cargar el array `settings` dentro del contexto de esa sección
 *
 * ✅ Instrucciones:
 *
 * 1. Crea una carpeta `sections/` dentro de tu ejercicio actual.
 *    - Mockify debe validar que esta carpeta exista a partir de este módulo.
 *
 * 2. Dentro de esa carpeta, crea un archivo `featured-collection.liquid` con este contenido de ejemplo:
 *
 * ```liquid
 * <section class="featured">
 *   <h2>{{ section.settings.header }}</h2>
 *   <p>{{ section.settings.sub_text }}</p>
 *   {% for product in collections[section.settings.collection].products %}
 *     {% render 'product-card', product: product %}
 *   {% endfor %}
 *
 *   {% schema %}
 *   {
 *     "settings": [
 *       { "type": "text", "id": "header", "value": "Nuestras mejores camisas" },
 *       { "type": "text", "id": "sub_text", "value": "Son suaves!" },
 *       { "type": "text", "id": "collection", "value": "soft-shirts" }
 *     ]
 *   }
 *   {% endschema %}
 * </section>
 * ```
 *
 * 3. Implementa soporte para:
 *    - La directiva `{% section 'nombre' %}` → debe buscar el archivo `sections/nombre.liquid`
 *    - Detectar el bloque `{% schema %}` dentro de ese archivo
 *    - Parsear su contenido como JSON
 *    - Crear un objeto `section.settings` en el contexto con los valores de cada setting
 *
 * 📝 Ejemplo:
 * Si el JSON es:
 * ```json
 * {
 *   "settings": [
 *     { "type": "text", "id": "header", "value": "Hola mundo" },
 *     { "type": "text", "id": "sub", "value": "Bienvenidos" }
 *   ]
 * }
 * ```
 * Entonces en Liquid, debe funcionar:
 * ```liquid
 * {{ section.settings.header }} → "Hola mundo"
 * {{ section.settings.sub }} → "Bienvenidos"
 * ```
 *
 * ✅ Resultado esperado:
 * Puedes incluir en tu plantilla principal algo como:
 * ```liquid
 * {% section 'featured-collection' %}
 * ```
 * Y se renderizará el HTML correspondiente con los datos definidos en el esquema.
 *
 * 🧠 Consejo:
 * - Shopify utiliza un editor visual que guarda los valores reales en `config/settings_data.json`.
 *   En este módulo **simulamos esa funcionalidad** usando el campo `"value"` directamente dentro del bloque `schema`.
 * - En un módulo futuro dejeramos de usar "value" y en su lugar usaremos un archivo de config/settings_data.json
 *
 */
