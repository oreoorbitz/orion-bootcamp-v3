/**
 * MÓDULO 31 (parte 1): SOPORTE PARA `include` Y LA CARPETA `snippets/`
 *
 * 🧠 Concepto clave:
 * En sistemas como Liquid, es común reutilizar fragmentos de plantilla compartidos llamados **snippets**.
 * En esta primera parte, implementarás la directiva `{% include "archivo" %}`, que copia el contenido
 * del snippet directamente dentro de la plantilla actual, reutilizando el mismo contexto.
 *
 * Esto es útil para:
 * - Tarjetas de producto
 * - Componentes repetidos como estrellas, precios, botones, etc.
 *
 * 🎯 Objetivo:
 * - Crear una carpeta `snippets/` en tu proyecto
 * - Implementar soporte para `{% include "archivo" %}`
 * - Procesar el contenido del snippet usando el **mismo contexto actual**
 *
 * ✅ Instrucciones:
 *
 * 1. Crea la carpeta `snippets/` dentro del ejercicio actual. A partir de este módulo, **Mockify debe validar que esta carpeta exista**.
 *
 * 2. Crea un archivo `snippets/product-card.liquid` con contenido de prueba como:
 * ```liquid
 * <div class="product-card">
 *   <h2>{{ product.title }}</h2>
 *   <p>{{ product.description }}</p>
 * </div>
 * ```
 *
 * 3. En tu plantilla `collection.liquid`, úsalo así:
 * ```liquid
 * <h1>{{ collection.title }}</h1>
 * {% for product in collection.products %}
 *   {% include "product-card" %}
 * {% endfor %}
 * ```
 *
 * 4. Modifica tu sistema de plantillas para que:
 *    - Detecte tokens como `{% include "archivo" %}`
 *    - Busque el archivo correspondiente dentro de la carpeta `snippets/` con extensión `.liquid`
 *    - Lea el contenido del archivo
 *    - Tokenice y procese esos tokens **como si fueran parte del archivo original**
 *    - Use el **mismo contexto actual** (no hay scope nuevo)
 *
 * ✅ Resultado esperado:
 * - El contenido del snippet aparece como parte de la plantilla
 * - Las variables como `product.title` funcionan si existen en el contexto actual
 *
 * ✅ Ejemplo de resultado:
 * ```html
 * <h1>Promociones</h1>
 * <div class="product-card">
 *   <h2>Producto A</h2>
 *   <p>Descripción A</p>
 * </div>
 * <div class="product-card">
 *   <h2>Producto B</h2>
 *   <p>Descripción B</p>
 * </div>
 * ```
 *
 * 🧠 Consejo:
 * - `include` es simple: copia y pega con el mismo contexto.
 * - Esta es una buena base para luego crear `render`, que permite pasar un contexto más limitado.
 */
