/**
 * MÓDULO 7: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Una plantilla no solo puede mostrar datos, también puede mostrar u ocultar secciones.
 * Con estructuras como `{% if variable %}`, se pueden incluir bloques condicionales que solo aparecen si se cumple una condición.
 * Esto es esencial para mostrar contenido personalizado según el contexto.
 *
 * Objetivo:
 * Detectar bloques condicionales `{% if ... %}` y `{% endif %}` y decidir si deben mostrarse o eliminarse según los datos.
 *
 * Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: string[], contexto: Record<string, any>): string[]`
 * 2. Evalúa las condiciones tipo `{% if variable %}` como `Boolean(contexto['variable'])`
 * 3. Si la condición es falsa, elimina todos los tokens entre `{% if ... %}` y `{% endif %}`
 * 4. No necesitas soportar condiciones anidadas por ahora
 *
 * Entrada:
 * tokens:
 * [
 *   "Hola ",
 *   "{% if admin %}",
 *   "Administrador ",
 *   "{% endif %}",
 *   "!"
 * ]
 * contexto:
 * {
 *   admin: true
 * }
 *
 * Resultado esperado:
 * [
 *   "Hola ",
 *   "Administrador ",
 *   "!"
 * ]
 *
 * Consejo:
 * - Usa un bucle e índices para marcar el inicio y fin de los bloques
 * - Este tipo de lógica condicional es común en todos los sistemas de plantillas
 */
