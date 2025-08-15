/**
 * 🧩 EJERCICIO 40: Condicionales con comparaciones y `else` en Liquid
 *
 * 🧠 Contexto:
 * Hasta ahora tu motor Liquid evaluaba condicionales simples (p. ej., `{% if admin %}`).
 * A partir de este ejercicio debes:
 * 1) Soportar expresiones de comparación dentro de `{% if %}`
 * 2) Soportar el bloque `{% else %}` (sin `elsif` por ahora)
 *
 * 🎯 Objetivos:
 * - Aceptar operadores: `==`, `!=`, `>`, `>=`, `<`, `<=`
 * - Evaluar comparaciones en `{% if ... %}` y permitir `{% else %}` → `{% endif %}`
 * - Operar con números, strings y booleanos (además de truthiness ya soportado)
 *
 * ✅ Reglas de evaluación:
 *
 * 1) Resolución de operandos
 *    - Si un operando es un identificador (p. ej., `x`), resuélvelo desde el contexto actual.
 *    - Literales admitidos: números (`3`, `3.5`), strings (`"abc"`), booleanos (`true`, `false`).
 *
 * 2) Coerción de tipos
 *    - Si **ambos** operandos son numéricos (o strings que representan números), compara numéricamente.
 *    - En otros casos, compara como **strings** para `>`, `>=`, `<`, `<=`.
 *    - Para `==` y `!=`: numérica si ambos son numéricos; en otro caso, igualdad de strings.
 *
 * 3) Truthiness (cuando no hay operador, p. ej. `{% if x %}`)
 *    - `false`, `null`/`undefined`, string vacío, `0` numérico → falsy.
 *    - Cualquier otro valor → truthy.
 *
 * 4) Sintaxis soportada
 *    - `{% if <expr> %} ... {% endif %}`
 *    - `{% if <expr> %} ... {% else %} ... {% endif %}`
 *    - Una sola comparación por condición (sin `and` / `or` en este ejercicio).
 *
 * 5) Robustez
 *    - Si la expresión no se puede evaluar, considera la condición como `false` y continúa el render.
 *
 * 🛠️ Implementación sugerida:
 * - Extrae el contenido entre `{% if` y `%}`; tokeniza en `left`, `operator`, `right`.
 * - Detecta el operador entre: `==`, `!=`, `>`, `>=`, `<`, `<=`. Si no hay, evalúa truthiness de `left`.
 * - Resuelve variables y literales; aplica coerción; ejecuta comparación.
 * - En el parser de bloques, reconoce opcionalmente una rama `{% else %}` antes de `{% endif %}`.
 *
 * 🧪 Pruebas:
 * - Copia `40_conditionals_test.liquid` desde `liquid_snippets/` a tu carpeta `templates/`.
 * - Sirve esa ruta (por ejemplo, `/conditionals-test`) y verifica:
 *   - `if x > 2`, `if x == "3"`, `if "apple" < "banana"` renderizan como se espera.
 *   - El bloque `{% else %}` aparece cuando la condición es falsa.
 *
 * ✅ Resultado esperado:
 * - Tu motor soporta comparaciones con `==`, `!=`, `>`, `>=`, `<`, `<=` en `{% if %}`.
 * - `{% else %}` funciona correctamente y cierra con `{% endif %}`.
 * - Los casos de fallo se renderizan de forma segura (la condición se considera `false`).
 */
