/**
 * MÓDULO 10: FILTROS EN VARIABLES DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores), puedes transformar variables con *filtros*, como:
 *   - `{{ nombre | upcase }}` → convierte a mayúsculas
 *   - `{{ precio | currency }}` → formatea como moneda
 *
 * Los filtros se encadenan y se aplican uno tras otro.
 *
 * Objetivo:
 * Permitir que una variable tenga uno o más filtros que transforman su valor antes de mostrarse.
 *
 * Instrucciones:
 * 1. Define una función `aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string`
 * 2. Encuentra el valor de la variable en `contexto`
 * 3. Aplica cada filtro, en orden, desde `filtrosRegistrados`
 * 4. Extiende `renderizarVariables()` para que soporte filtros como `{{ variable | upcase | reverse }}`
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
 * - Usa `.split('|')` para separar la variable del resto de filtros
 * - Este módulo introduce la idea de *tuberías de transformación* (transform pipelines), muy usada en programación funcional
 */
