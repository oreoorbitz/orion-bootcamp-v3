/**
 * MÓDULO 32: INCLUSIÓN DE SNIPPETS CON `render`

 * 🧠 Concepto clave:
 * En Shopify, los *snippets* son fragmentos reutilizables de Liquid, como pequeños componentes.
 * Se pueden incluir dentro de secciones o plantillas usando la directiva `{% render %}`.
 * Además, permiten pasar parámetros con valores específicos, lo que los hace muy versátiles.

 * En este módulo, vas a:
 * - Crear una carpeta `snippets/` para alojar archivos `.liquid` reutilizables
 * - Actualizar tu motor de Liquid para que soporte `{% render %}`
 * - Implementar el paso de variables a un snippet usando sintaxis tipo `clave: valor`

 * ✅ Ejemplo de uso:
 * ```liquid
 * {% render 'boton', texto: 'Comprar ahora', color: 'rojo' %}
 * ```

 * Esto debería buscar el archivo: `snippets/boton.liquid`, y dentro de ese snippet estarán disponibles las variables:
 * - `texto`
 * - `color`

 * ✅ Ejemplo de contenido de `snippets/boton.liquid`:
 * ```liquid
 * <button style="background: {{ color }};">{{ texto }}</button>
 * ```

 * Resultado esperado al renderizar:
 * ```html
 * <button style="background: rojo;">Comprar ahora</button>
 * ```

 * 📁 Estructura esperada:
 * - `snippets/`
 *   └── boton.liquid

 * ✅ Instrucciones:

 * 1. Crea una carpeta `snippets/` dentro de tu carpeta del tema.
 *    - Mockify debe validar su existencia.

 * 2. Implementa el soporte para `{% render 'nombre_snippet', ... %}` en tu motor de Liquid:
 *    - Extrae el nombre del snippet (debe buscar `snippets/<nombre>.liquid`)
 *    - Extrae todos los parámetros (usando expresión regular o parser simple)
 *    - Crea un nuevo contexto local para ese snippet con esas variables

 * 3. Renderiza el contenido del snippet usando el nuevo contexto, y reemplaza el bloque `{% render %}` por el resultado.

 * 🛠 Consejo técnico:
 * - Puedes representar el nuevo contexto como una copia del contexto padre con los valores nuevos sobrescritos.
 * - Asegúrate de no contaminar el contexto global. Cada snippet debe tener su propio alcance (scope).

 * 🔒 Reglas adicionales:
 * - Solo se aceptan literales (`texto: '...'`, `color: 'rojo'`, `precio: 10`)
 * - Por ahora, no implementes soporte para expresiones anidadas ni variables como parámetros (eso se cubrirá más adelante)

 * ✅ Resultado esperado:
 * Usar `{% render 'nombre', param1: 'valor1' %}` debería incluir y renderizar ese snippet con los valores indicados.
 *
 */
