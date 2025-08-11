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
 * Hola, {{ nombre }}.
 * {% if admin %}
 * Bienvenido, administrador.
 * {% endif %}
 * ```
 *
 * ✅ Ejemplo de `contexto`:
 * ```ts
 * const contexto = {
 *   nombre: "Carlos",
 *   admin: true
 * }
 * ```
 *
 * ✅ Ejemplo de tokens clasificados (antes de este módulo):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." },
 *   { tipo: "directiva", contenido: "endif" }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `true`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `false`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." }
 * ]
 * ```
 *
 * 🎯 Objetivo:
 * Eliminar o conservar bloques `{% if %} ... {% endif %}` dependiendo de si la variable evaluada es verdadera.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Busca los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa el valor de la variable en `contexto`
 *    - Si es `true`, conserva los tokens del bloque interno
 *    - Si es `false`, elimínalos
 * 4. Solo implementa un nivel de condición (no anidado)
 *
 * 💡 Consejo:
 * - Recorre el arreglo con un bucle `for`, y cuando encuentres un `if`, busca su cierre con otro bucle
 * - Extrae el nombre de la variable con `.split(' ')` sobre `contenido`
 * - Usa `.slice()` para conservar los tokens del interior si la condición se cumple
 * - Deja pasar los demás tokens sin cambios
 *
 * Esto es una simulación básica del sistema de condiciones de Liquid. Más adelante podrás anidar condiciones o usar `else`.
 */


type TokenPlantilla = {
    tipo: "texto" | "variable" | "directiva";
    contenido: string;
  };
  
  function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    const resultado: TokenPlantilla[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.tipo === "directiva" && token.contenido.startsWith("if ")) {
        const variable = token.contenido.split(" ")[1];
        let j = i + 1;
        while (j < tokens.length && !(tokens[j].tipo === "directiva" && tokens[j].contenido === "endif")) {
          j++;
        }
        if (contexto[variable]) {
          resultado.push(...tokens.slice(i + 1, j));
        }
        i = j;
      } else {
        resultado.push(token);
      }
    }
    return resultado;
  }
  
  console.log(procesarCondicionales())
  