/**
 * MÓDULO 11: FILTROS EN VARIABLES DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), una variable se puede transformar antes de renderizarse usando *filtros*.
 * Estos filtros permiten aplicar funciones como mayúsculas, formateo de moneda, inversión de texto, etc.
 *
 * Los filtros se escriben después de la variable, separados por `|`, y se aplican en orden como una *tubería* (pipeline):
 *
 * Ejemplo:
 *   - `{{ nombre | upcase }}` → convierte a mayúsculas
 *   - `{{ nombre | upcase | reverse }}` → mayúsculas y luego invertir el texto
 *
 * En este módulo extenderás tu motor para aplicar esos filtros antes de mostrar el valor.
 *
 * ✅ Ejemplo de plantilla completa (con loop, condición y filtros combinados):
 * ```liquid
 * {% for fruta in frutas %}
 *   {% if fruta != 'uva' %}
 *     {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta != 'uva'" },
 *   { tipo: "variable", contenido: "fruta | upcase | reverse" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas = ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "ANAZNAM" },
 *   { tipo: "texto", contenido: "ONATÁLP" }
 * ]
 * ```
 *
 * Objetivo:
 * Agregar soporte para filtros dentro de `{{ ... }}`, aplicándolos antes de mostrar el valor final.
 *
 * Instrucciones:
 * 1. Crea una función `aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string`
 *    - Busca el valor en el contexto
 *    - Aplica cada filtro desde `filtrosRegistrados` en orden
 *
 * 2. Extiende tu función `renderizarVariables()` para:
 *    - Detectar si el contenido del token `variable` contiene `|`
 *    - Separar el nombre de variable y los filtros con `.split('|')`
 *    - Aplicar `aplicarFiltros(...)` en lugar de acceder directamente al contexto
 *
 * Entrada de ejemplo (solo el token):
 * ```ts
 * { tipo: "variable", contenido: "fruta | upcase | reverse" }
 * ```
 *
 * contexto:
 * ```ts
 * { fruta: "plátano" }
 * ```
 *
 * filtrosRegistrados:
 * ```ts
 * {
 *   upcase: (x) => x.toUpperCase(),
 *   reverse: (x) => x.split('').reverse().join('')
 * }
 * ```
 *
 * Resultado esperado:
 * ```ts
 * "ONATÁLP"
 * ```
 *
 * Consejo:
 * - Recorta espacios usando `.trim()` en cada parte del filtro
 * - Puedes lanzar un error si el filtro no está definido
 * - Reutiliza el motor completo: primero bucles, luego condiciones, luego filtros → orden importa
 */
