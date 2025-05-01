/**
 * MÓDULO 13: MANEJO DE ERRORES EN EL MOTOR DE PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Mientras que HTML real es bastante tolerante con errores (por ejemplo, etiquetas mal cerradas),
 * los motores de plantillas como Liquid deben ser *estrictos* para que el desarrollador reciba retroalimentación clara.
 *
 * A medida que tu sistema crece, es crucial que puedas detectar errores comunes:
 * - Variables que no existen
 * - Filtros desconocidos
 * - Sintaxis mal formada en `{% if %}`, `{% for %}`, etc.
 * - Valores no válidos al hacer asignaciones
 *
 * Objetivo:
 * Agregar validaciones a tu pipeline de plantillas para manejar errores con mensajes informativos,
 * sin romper el programa de manera silenciosa.
 *
 * Instrucciones:
 * 1. Revisa cada una de tus funciones principales del motor de plantillas:
 *    - `procesarAsignaciones`
 *    - `procesarCondicionales`
 *    - `procesarBucles`
 *    - `renderizarVariables`
 *    - `aplicarFiltros`
 * 2. Agrega validaciones defensivas:
 *    - Si una variable no está en el `contexto`, lanza un error o registra una advertencia
 *    - Si un filtro no existe en `filtrosRegistrados`, lanza un error
 *    - Si `{% if %}` no tiene un `{% endif %}` correspondiente, lanza un error de sintaxis
 *    - Si `{% for ... in ... %}` tiene una lista no definida, muestra advertencia
 *    - Si se intenta `assign` sin `=`, o con un valor inválido, detén la ejecución
 *
 * Consejo:
 * - Usa `throw new Error(...)` para errores críticos
 * - Puedes crear una función auxiliar `validarSintaxis()` para verificar tokens antes de procesarlos
 * - Puedes registrar advertencias con `console.warn(...)` sin detener el flujo si el error no es grave
 *
 * Opcional:
 * - Crea un modo `estricto` (por ejemplo con una bandera `modoEstrictamenteTipado: true`) que detenga todo si hay errores
 * - Permite continuar silenciosamente si el modo estricto está desactivado
 *
 * Ejemplo:
 * ```ts
 * // Si este token no tiene cierre correspondiente
 * ["{% if usuario %}", "Contenido", "{{ nombre }}"]
 * // Deberías lanzar un error:
 * throw new Error("Bloque {% if %} sin cierre {% endif %}")
 * ```
 *
 * Resultado esperado:
 * Tu motor debe fallar claramente ante errores lógicos o de sintaxis,
 * ayudando a depurar plantillas de forma más profesional.
 *
 * Este módulo marca el paso de "juguete funcional" a "herramienta real para desarrolladores".
 */
