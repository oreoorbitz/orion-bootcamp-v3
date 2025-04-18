/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL
 *
 * Objetivo: Convertir la lista de tokens clasificados en una estructura de árbol que represente el DOM.
 *
 * Instrucciones:
 * 1. Crea una función llamada `construirArbol(tokens: any[]): any`
 * 2. Usa una pila (stack) para mantener el seguimiento del nodo padre actual.
 * 3. Crea objetos con esta estructura:
 *    {
 *      tipo: 'elemento' | 'texto',
 *      nombre: 'div',
 *      atributos: {...},
 *      hijos: []
 *    }
 *
 * Ejemplo:
 * Entrada simplificada de tokens:
 * [
 *   apertura <div>,
 *   texto "Hola",
 *   apertura <span>,
 *   texto "mundo",
 *   cierre </span>,
 *   cierre </div>
 * ]
 *
 * Resultado esperado:
 * {
 *   tipo: 'elemento',
 *   nombre: 'div',
 *   atributos: {},
 *   hijos: [
 *     { tipo: 'texto', contenido: 'Hola' },
 *     {
 *       tipo: 'elemento',
 *       nombre: 'span',
 *       atributos: {},
 *       hijos: [
 *         { tipo: 'texto', contenido: 'mundo' }
 *       ]
 *     }
 *   ]
 * }
 *
 * Conceptos clave: pila, estructuras anidadas, recorrido incremental
 */
