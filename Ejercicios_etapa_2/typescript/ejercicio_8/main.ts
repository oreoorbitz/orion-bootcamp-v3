/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En motores como Liquid, las directivas controlan el flujo de una plantilla.
 * Una de las directivas más comunes es `{% if %}`, que permite mostrar contenido **solo si se cumple una condición**.
 *
 * En los módulos anteriores:
 * - Separaste la plantilla en tokens (`detectarTokensPlantilla`)
 * - Clasificaste cada uno como texto, variable o directiva (`clasificarTokensPlantilla`)
 * - Y reemplazaste variables por valores reales (`renderizarVariables`)
 *
 * Ahora vas a interpretar el significado de una **directiva**, en este caso: `{% if ... %}`.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Hola {% if admin %}Administrador{% endif %}!
 * ```
 *
 * ✅ Ejemplo de tokens clasificados:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Administrador" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (cuando `contexto.admin === true`):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "texto", contenido: "Administrador" },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (cuando `contexto.admin === false`):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * Objetivo:
 * Eliminar o conservar bloques `{% if %} ... {% endif %}` dependiendo de si la variable evaluada es verdadera.
 *
 * Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Busca los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa el valor de la variable en `contexto`
 *    - Si es `true`, deja los tokens del bloque interno
 *    - Si es `false`, elimina esos tokens
 * 4. Solo implementa un nivel de condición (no anidado)
 *
 * Consejo:
 * - Recorre el arreglo con un bucle `for`, y cuando encuentres un `if`, busca su cierre con otro bucle
 * - Extrae el nombre de la variable con `.split(' ')` sobre `contenido`
 * - Usa `.slice()` para recortar los tokens que quieras conservar
 */
