/**
 * MÓDULO 5: CREACIÓN DE ELEMENTOS DEL DOM
 *
 * Objetivo: Tomar la estructura en forma de árbol creada anteriormente y construir elementos DOM reales con JavaScript.
 *
 * Instrucciones:
 * 1. Crea una función llamada `construirDOM(nodo: any): HTMLElement | Text`
 * 2. Si el nodo es de tipo 'texto', usa `document.createTextNode`.
 * 3. Si es un 'elemento', usa `document.createElement`, aplica atributos y recursivamente construye sus hijos.
 * 4. Crea un árbol DOM completo y agrégalo al `document.body` o un `div#root`.
 *
 * Ejemplo de uso:
 * const raiz = construirDOM(arbol);
 * document.getElementById('root').appendChild(raiz);
 *
 * Consejo:
 * - Asegúrate de que `document` esté disponible (usa Deno con permisos de DOM si estás usando Deno DOM, o corre en navegador)
 * - Este módulo une todo lo anterior: análisis, construcción, recursión, y creación de HTML visual.
 */
