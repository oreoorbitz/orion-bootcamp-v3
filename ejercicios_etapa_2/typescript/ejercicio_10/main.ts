/**
 * MÓDULO 10: FILTROS EN VARIABLES DE PLANTILLA
 *
 * Objetivo: Implementar filtros como `{{ nombre | upcase }}` usando funciones registradas.
 *
 * Instrucciones:
 * 1. Define una función `aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string`
 * 2. Para cada filtro, aplica su función correspondiente sobre el valor actual
 * 3. Extiende la función `renderizarVariables()` para que detecte y use estos filtros
 *
 * Entrada:
 * token: `{{ nombre | upcase | reverse }}`
 * contexto:
 * {
 *   nombre: "carlos"
 * }
 * filtrosRegistrados:
 * {
 *   upcase: (x) => x.toUpperCase(),
 *   reverse: (x) => x.split('').reverse().join('')
 * }
 *
 * Resultado esperado:
 * "SOLRAC"
 *
 * Consejo:
 * - Divide el contenido dentro de `{{ ... }}` usando `.split('|')`
 * - El primer elemento es la variable, el resto son filtros encadenados
 * - Aplica cada filtro en orden sobre el resultado del anterior
 */
