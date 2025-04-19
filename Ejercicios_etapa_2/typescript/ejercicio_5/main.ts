/**
 * MÓDULO 5: FUNCIONES DE BÚSQUEDA EN NODOS (getElementById y getElementsByClassName)
 *
 * 🧠 Concepto clave:
 * En los navegadores reales, cuando el DOM ya está construido, los objetos tipo `HTMLElement`
 * permiten buscar contenido dentro de sí mismos con métodos como:
 *
 *   - `element.getElementById("header")`
 *   - `element.getElementsByClassName("item")`
 *
 * En este módulo, vas a simular ese comportamiento en tu propio árbol DOM virtual.
 * Vas a agregar estos métodos a cada nodo de tipo `elemento`, de modo que se puedan llamar como:
 *
 *   nodo.getElementById('algo') o nodo.getElementsByClassName('algo')
 *
 * Objetivo:
 * Implementar **como métodos de instancia** dos funciones que permitan buscar en el árbol:
 *    - `getElementById(id: string): NodoElemento | null`
 *    - `getElementsByClassName(className: string): NodoElemento[]`
 *
 * 🧩 Estructura base esperada para tus nodos:
 *
 * interface NodoElemento {
 *   tipo: 'elemento';
 *   nombre: string;
 *   atributos: Record<string, string>;
 *   hijos: (NodoElemento | NodoTexto)[];
 *   getElementById?: (id: string) => NodoElemento | null;
 *   getElementsByClassName?: (className: string) => NodoElemento[];
 * }
 *
 * interface NodoTexto {
 *   tipo: 'texto';
 *   contenido: string;
 * }
 *
 * ✅ Ejemplo de uso esperado:
 * const nodoRaiz = construirArbol(tokens);
 * const resultado = nodoRaiz.getElementById("principal");
 *
 * Instrucciones:
 * 1. Al final del proceso de construcción de árbol (Módulo 4), asegúrate de agregar estos dos métodos
 *    a **cada nodo de tipo 'elemento'**:
 *    - `getElementById(id: string): NodoElemento | null`
 *    - `getElementsByClassName(className: string): NodoElemento[]`
 *
 * 2. Ambos métodos deben funcionar recursivamente:
 *    - `getElementById` devuelve el **primer** nodo que tenga el atributo `id` igual al buscado.
 *    - `getElementsByClassName` devuelve un arreglo con **todos los nodos** que incluyan esa clase dentro del atributo `class`.
 *
 * Detalles clave:
 * - El atributo `class` puede tener múltiples clases separadas por espacio.
 * - Estos métodos **solo aplican a nodos tipo 'elemento'** (ignora los tipo 'texto').
 * - Puedes crear una función auxiliar (helper) para no repetir lógica de recorrido recursivo.
 *
 * Consejo:
 * - Así como en el navegador puedes hacer `document.getElementById(...)` o `element.getElementsByClassName(...)`,
 *   ahora tú podrás hacer lo mismo sobre tu árbol JS personalizado.
 *
 * Sugerencia:
 * Si no quieres mutar directamente los objetos, también puedes definir una función
 * `agregarMetodosDOM(nodo: NodoElemento)` que recorra el árbol y agregue los métodos a cada nodo de tipo elemento.
 */
