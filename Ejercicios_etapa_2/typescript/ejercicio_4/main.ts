/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL DOM A PARTIR DE TOKENS
 *
 * 🧠 Concepto clave:
 * En los navegadores reales, el contenido HTML se convierte en una estructura en forma de árbol llamada DOM (Document Object Model).
 * En este árbol, cada etiqueta se convierte en un "nodo", y si una etiqueta contiene otras etiquetas o texto, estas se representan como "hijos".
 * 
 * En este módulo, vas a construir una versión simplificada de ese árbol, usando JavaScript puro.
 *
 * Objetivo:
 * Tomar un arreglo de tokens clasificados (generados en los módulos 2 y 3) y construir un árbol jerárquico de nodos.
 * Cada nodo del árbol representará una etiqueta o un texto, con información de sus atributos y sus hijos.
 *
 * 🔁 ¿Qué estructura espera construirArbol?
 * La función `construirArbol(tokens: Token[]): NodoElemento` debe tomar un arreglo de objetos con la siguiente forma:
 *
 * interface Token {
 *   tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto';
 *   nombre: string | null;
 *   contenido: string | null;
 *   atributos?: Record<string, string>;
 * }
 *
 * Y devolver un objeto anidado con esta forma recursiva:
 *
 * interface NodoElemento {
 *   tipo: 'elemento';
 *   nombre: string;
 *   atributos: Record<string, string>;
 *   hijos: (NodoElemento | NodoTexto)[];
 * }
 *
 * interface NodoTexto {
 *   tipo: 'texto';
 *   contenido: string;
 * }
 *
 * ✅ Ejemplo de entrada:
 * [
 *   { tipo: 'apertura', nombre: 'div', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'Hola' },
 *   { tipo: 'apertura', nombre: 'span', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'mundo' },
 *   { tipo: 'cierre', nombre: 'span', contenido: null },
 *   { tipo: 'cierre', nombre: 'div', contenido: null }
 * ]
 *
 * ✅ Resultado esperado:
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
 * 1. Crea una función `construirArbol(tokens: Token[]): NodoElemento`
 * 2. Usa una estructura tipo *pila* (`stack`) para mantener el seguimiento del nodo actual (el nodo padre).
 * 3. Recorre cada token y:
 *    - Si es una etiqueta de apertura: crea un nuevo nodo y agrégalo como hijo del nodo actual. Luego haz `push` de ese nuevo nodo.
 *    - Si es una etiqueta de cierre: haz `pop` para regresar al nodo padre.
 *    - Si es una etiqueta autocontenida: crea el nodo y agrégalo como hijo directamente (no haces `push`).
 *    - Si es texto: crea un nodo de tipo `texto` y agrégalo como hijo del nodo actual.
 *
 * Reglas clave:
 * - La pila debe comenzar con un nodo raíz ficticio (puedes usar un `div` vacío o una etiqueta genérica).
 * - Solo puede haber un nodo raíz real al final (retorna su primer hijo si lo deseas).
 * - Todos los nodos `elemento` tienen: `tipo`, `nombre`, `atributos`, `hijos`.
 * - Todos los nodos `texto` tienen: `tipo` y `contenido`.
 *
 * Conceptos clave:
 * - Árboles y estructuras recursivas
 * - Control de contexto con pila
 * - Construcción dinámica de objetos
 */
