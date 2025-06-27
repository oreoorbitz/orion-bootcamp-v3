/**
 * MÓDULO 9: CONSTRUCCIÓN DE BUCLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Los motores de plantillas como Liquid permiten generar contenido dinámico a partir de arreglos usando bucles `{% for item in lista %}`.
 * Esto es esencial para mostrar listas como productos, entradas de blog, comentarios, etc.
 *
 * En los módulos anteriores:
 * - Aprendiste a detectar y clasificar tokens (`texto`, `variable`, `directiva`)
 * - Procesaste condicionales `{% if %}` en base al contexto
 * - Reemplazaste variables simples con `{{ nombre }}`
 *
 * Ahora vas a interpretar una nueva directiva: los bucles con `{% for item in lista %}`.
 * Además, dentro del cuerpo del bucle puede haber condicionales — lo cual pondrá a prueba si tu motor procesa los bloques en orden correcto.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Lista: 
 * {% for fruta in frutas %}
 *   {% if fruta != 'uva' %}
 *     {{ fruta }} 
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta != 'uva'" },
 *   { tipo: "variable", contenido: "fruta" },
 *   { tipo: "texto", contenido: " " },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas = ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "texto", contenido: "manzana " },
 *   { tipo: "texto", contenido: "plátano " }
 * ]
 * ```
 *
 * Objetivo:
 * Detectar bloques `{% for %}` → `{% endfor %}` y repetir su contenido por cada elemento en el arreglo indicado.
 * Los bloques internos pueden tener condicionales que debes procesar primero.
 *
 * Instrucciones:
 * 1. Crea una función `procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada directiva `{% for item in lista %}`:
 *    - Identifica el bloque hasta el `{% endfor %}`
 *    - Extrae el nombre del item y de la lista (`for fruta in frutas`)
 *    - Busca `contexto['frutas']` y verifica que sea un arreglo
 *    - Por cada valor, renderiza una copia del bloque interno:
 *        - Reemplaza `{{ item }}` con el valor actual
 *        - Aplica `procesarCondicionales()` al bloque interno antes de renderizar
 * 3. El resultado debe ser un nuevo arreglo con los bloques repetidos y procesados
 *
 * Consejo:
 * - Puedes usar `renderizarVariables()` dentro del cuerpo del bucle
 * - Aplica `procesarCondicionales()` para manejar `if` dentro del `for`
 * - Haz un bucle externo para recorrer los tokens y detectar el inicio y fin del `for`
 * - Asegúrate de mantener el orden de ejecución: primero condicionales, luego variables
 */


interface TokenPlantilla {
    tipo: "texto" | "variable" | "directiva";
    contenido: string;
  }
  
  export function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    const resultado: TokenPlantilla[] = [];
    let i = 0;
  
    while (i < tokens.length) {
      const token = tokens[i];
  
      if (token.tipo === "directiva" && token.contenido.startsWith("for ")) {
        // Extraer datos del for
        const match = token.contenido.match(/^for (\w+) in (\w+)$/);
        if (!match) {
          throw new Error("Directiva for mal formada: " + token.contenido);
        }
  
        const [, nombreItem, nombreLista] = match;
        const lista = contexto[nombreLista];
  
        if (!Array.isArray(lista)) {
          
        }
  
        let bloqueInterno: TokenPlantilla[] = [];
        let nivel = 1;
        let j = i + 1;
  
        while (j < tokens.length && nivel > 0) {
          const t = tokens[j];
          if (t.tipo === "directiva") {
            if (t.contenido.startsWith("for ")) nivel++;
            else if (t.contenido === "endfor") nivel--;
          }
          if (nivel > 0) bloqueInterno.push(t);
          j++;
        }
  
        for (const valor of lista) {
          const nuevoContexto = { ...contexto, [nombreItem]: valor };
          let procesado = procesarCondicionales(bloqueInterno, nuevoContexto);
          procesado = renderizarVariables(procesado, nuevoContexto);
          resultado.push(...procesado);
        }
  
        i = j; 
      } else {
        resultado.push(token);
        i++;
      }
    }
  
    return resultado;
  }  