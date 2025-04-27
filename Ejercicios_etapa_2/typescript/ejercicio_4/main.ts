/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL DOM A PARTIR DE TOKENS
 *
 * 🧠 Concepto clave:
 * Un documento HTML es naturalmente una estructura en forma de árbol.
 * Cada etiqueta de apertura crea un nuevo "nodo padre", cada etiqueta de cierre cierra el nodo actual,
 * y los textos son hijos normales dentro de las etiquetas.
 *
 * En este módulo vas a construir:
 * - Un árbol jerárquico que representa tu HTML
 * - Usando **un stack** para saber en qué nivel del árbol estás
 * - Usando **tipos explícitos** en TypeScript para representar nodos
 *
 * 🎯 Objetivo:
 * 1. Crear una función `construirArbol(tokens: Token[]): Nodo`
 * 2. Construir recursivamente un árbol de nodos a partir de los tokens
 *
 * ✅ Entrada esperada:
 * Un arreglo de objetos tipo `Token`:
 * ```ts
 * type Token = {
 *   tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto';
 *   nombre: string | null;
 *   contenido: string | null;
 *   atributos?: Record<string, string>;
 * }
 * ```
 *
 * ✅ Ejemplo de tokens:
 * ```ts
 * [
 *   { tipo: 'apertura', nombre: 'div', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'Hola' },
 *   { tipo: 'apertura', nombre: 'span', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'mundo' },
 *   { tipo: 'cierre', nombre: 'span', contenido: null },
 *   { tipo: 'cierre', nombre: 'div', contenido: null }
 * ]
 * ```
 *
 * ✅ ¿Qué tipos usar para el árbol de nodos?
 * Recomendamos usar **dos tipos separados** para que sea más claro:
 *
 * ```ts
 * type NodoElemento = {
 *   tipo: 'elemento';
 *   nombre: string;
 *   atributos: Record<string, string>;
 *   hijos: Nodo[];
 * };

 * type NodoTexto = {
 *   tipo: 'texto';
 *   contenido: string;
 * };

 * type Nodo = NodoElemento | NodoTexto;
 * ```
 *
 * - Un `NodoElemento` tiene nombre, atributos, y un arreglo de `hijos`
 * - Un `NodoTexto` tiene solo el contenido de texto
 * - El tipo general `Nodo` es la unión (`|`) de ambos
 *
 * ✅ Salida esperada:
 * Un objeto tipo `Nodo` que representa el árbol DOM:
 * ```ts
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
 * ```
 *
 * ✅ Instrucciones:
 * 1. Crea una función `construirArbol(tokens: Token[]): Nodo`
 * 2. Usa una pila (stack) para construir la jerarquía:
 *    - Cuando encuentres una etiqueta de apertura:
 *      - Crea un nuevo `NodoElemento`
 *      - Agrégalo como hijo del nodo actual
 *      - Haz `push` del nuevo nodo como el nodo actual
 *    - Cuando encuentres una etiqueta de cierre:
 *      - Haz `pop` del stack para volver al padre
 *    - Cuando encuentres un texto:
 *      - Crea un `NodoTexto`
 *      - Agrégalo como hijo del nodo actual
 *    - Cuando encuentres una etiqueta de autocierre:
 *      - Crea un `NodoElemento` sin hijos
 *      - Agrégalo directamente como hijo del nodo actual
 *
 * ✅ Reglas clave:
 * - El primer `NodoElemento` que se abre será el **nodo raíz** de tu árbol
 * - Cada nodo puede tener múltiples `hijos`
 * - Un `NodoTexto` nunca tiene `hijos`
 *
 * Conceptos clave que vas a practicar:
 * - Estructuras de árbol
 * - Uso de `stack` para seguir jerarquía
 * - Modelado de tipos con TypeScript
 * - Pensar en estructuras de datos dinámicas
 *
 * Consejo:
 * - Si ves que todo se complica, **haz primero un pseudocódigo**:  
 *   "Si apertura -> crear hijo y mover contexto... Si cierre -> regresar al padre..."
 * - Así entenderás cómo un navegador construye el DOM real.
 */
