/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL DOM A PARTIR DE TOKENS
 *
 * Objetivo: Convertir una lista de tokens clasificados en una estructura de árbol
 * que represente el contenido y jerarquía de un documento HTML simple.
 *
 * Entrada esperada:
 * Un arreglo de objetos (tokens) generado en módulos anteriores. Cada token debe
 * tener esta estructura (al menos):
 *
 * {
 *   tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto',
 *   nombre: string | null,
 *   contenido: string | null,
 *   atributos?: Record<string, string>  // solo si aplica
 * }
 *
 * Ejemplo de entrada:
 * [
 *   { tipo: 'apertura', nombre: 'div', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'Hola' },
 *   { tipo: 'apertura', nombre: 'span', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'mundo' },
 *   { tipo: 'cierre', nombre: 'span', contenido: null },
 *   { tipo: 'cierre', nombre: 'div', contenido: null }
 * ]
 *
 * Salida esperada:
 * Un objeto raíz que representa el árbol DOM en forma de estructura anidada:
 *
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
 * Instrucciones:
 * 1. Crea una función `construirArbol(tokens: any[]): any`
 * 2. Usa una pila (stack) para construir la jerarquía:
 *    - Cuando encuentres una etiqueta de apertura, crea un nodo y agrégalo como hijo del nodo actual.
 *      Luego haz "push" a ese nodo como el nuevo contexto actual.
 *    - Cuando encuentres una etiqueta de cierre, haz "pop" de la pila.
 *    - Cuando encuentres un texto o una etiqueta de autocierre, agrégalo directamente al nodo actual.
 *
 * Reglas clave:
 * - El nodo raíz es el primer elemento del stack.
 * - Todos los elementos deben ir en `hijos` del nodo padre actual.
 * - Los nodos tipo 'texto' tienen solo las propiedades: `tipo: 'texto'` y `contenido`
 * - Los nodos tipo 'elemento' tienen: `tipo`, `nombre`, `atributos`, y `hijos`
 *
 * Conceptos clave: estructuras anidadas, árboles, pila (stack), control de contexto
 */