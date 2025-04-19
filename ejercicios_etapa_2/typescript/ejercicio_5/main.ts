/**
 * MÓDULO 5: FUNCIONES DE BÚSQUEDA EN NODOS (getElementById y getElementsByClassName)
 *
 * Objetivo: Agregar métodos de búsqueda similares al DOM real sobre la estructura de árbol creada en el Módulo 4.
 * Esto permite buscar elementos por `id` o por `class` dentro de tu árbol virtual.
 *
 * Estructura de entrada:
 * El árbol generado en el Módulo 4. Cada nodo tiene una forma como esta:
 *
 * {
 *   tipo: 'elemento' | 'texto',
 *   nombre: 'div',
 *   atributos: { id: 'main', class: 'container' },
 *   hijos: [ ...otros nodos... ]
 * }
 *
 * Instrucciones:
 * 1. Implementa dos funciones:
 *    - `getElementById(nodo: any, id: string): any | null`
 *    - `getElementsByClassName(nodo: any, className: string): any[]`
 *
 * 2. Estas funciones deben hacer una búsqueda *recursiva* en todo el árbol.
 *    - `getElementById` devuelve el primer nodo que contenga el atributo `id` igual al valor buscado.
 *    - `getElementsByClassName` devuelve un arreglo de todos los nodos que tengan la clase indicada.
 *
 * Detalles:
 * - El atributo `class` puede tener múltiples clases separadas por espacio (igual que en HTML).
 * - Si el nodo no tiene `atributos`, ignóralo y continúa buscando en sus hijos.
 *
 * Ejemplo:
 *
 * const arbol = {
 *   tipo: 'elemento',
 *   nombre: 'div',
 *   atributos: { id: 'root', class: 'contenedor' },
 *   hijos: [
 *     {
 *       tipo: 'elemento',
 *       nombre: 'p',
 *       atributos: { class: 'texto grande' },
 *       hijos: [{ tipo: 'texto', contenido: 'Hola mundo' }]
 *     }
 *   ]
 * }
 *
 * getElementById(arbol, 'root') // Devuelve el nodo raíz
 * getElementsByClassName(arbol, 'texto') // Devuelve un arreglo con el nodo <p>
 *
 * Consejo:
 * - Usa `.split(' ')` para dividir la clase en palabras individuales
 * - Piensa en recorrer el árbol usando una función recursiva
 * - Esto sentará las bases para navegación, renderizado parcial y reutilización en módulos posteriores
 */
