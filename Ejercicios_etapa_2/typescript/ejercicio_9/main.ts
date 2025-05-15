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
 *   {% if fruta %}
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
type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva';
type TipoDirectiva = 'if' | 'endif' | 'elsif' | 'else' | 'for' | 'endfor';

interface TokenPlantilla {
    tipo: TipoTokenPlantilla;
    contenido: string;
    directiva?: TipoDirectiva;
}

function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
 let resultado: TokenPlantilla[] = [];
 let i = 0;

 while (i< tokens.length) {
  let token = tokens[i]
  if (token.tipo === 'directiva' && token.contenido.startsWith('if')) {
    //Extraer el nombre de la variable
    let partes = token.contenido.split(/\s+/) // también se puede usar como .split("if ") esto eliminiaría esta parte
    let nombreVariable = partes[1] || "";

    //Buscar índice de cierre endif
    let j = i + 1;
    //En programación usamos j después de i
    while (j < tokens.length) {
      if (tokens[j].tipo === 'directiva' && tokens[j].contenido === 'endif') {
        break
      }
      j += 1;
    }
    // validando que se encontró un{% endif %}
    if (j >= tokens.length) {
      throw new Error("Error de sintaxis: {% if %} sin {% endif %}");
    }

    let condicion = contexto[nombreVariable] ?? false;
    if (condicion) {
      for (let k = i + 1; k < j; k++ ) {
        resultado.push({...tokens[k] });
      }

    }

      i = j; //saltar al endif
    } else {
      resultado.push(token);
    }

    i+= 1;
 }

  return resultado
 }


function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token.tipo === 'directiva' && token.contenido.startsWith('for')) {
            let partes = token.contenido.split(/\s+/);
            let nombreItem = partes[1]; // "fruta"
            let nombreLista = partes[3]; // "frutas"

            if (!Array.isArray(contexto[nombreLista])) {
                throw new Error(`Error: '${nombreLista}' no es un array.`);
            }

            let valoresLista = contexto[nombreLista];

            let j = i + 1;
            while (j < tokens.length && !(tokens[j].tipo === 'directiva' && tokens[j].contenido === 'endfor')) {
                j++;
            }

            if (j >= tokens.length) {
                throw new Error("Error de sintaxis: {% for %} sin {% endfor %}");
            }

            let bloqueInterno = tokens.slice(i + 1, j);

            for (let valor of valoresLista) {
                let contextoLocal = { ...contexto, [nombreItem]: valor };

                // Evaluar condicional dentro del bucle
                let bloqueProcesado = procesarCondicionales(bloqueInterno, contextoLocal);

                let tokensFinales = bloqueProcesado.map(token =>
                    token.tipo === "variable" && token.contenido === nombreItem
                        ? { ...token, contenido: valor }
                        : token
                ).filter(token => token.contenido.trim() !== "");

                resultado.push(...tokensFinales);
            }

            i = j;
        } else {
            if (token.contenido.trim() !== "") {
                resultado.push(token);
            }
        }

        i++;
    }

    return resultado;
}


const tokens: TokenPlantilla[] = [
  { tipo: "texto", contenido: "Lista: " },
  { tipo: "directiva", contenido: "for fruta in frutas" },
  { tipo: "directiva", contenido: "if fruta != 'uva'" },
  { tipo: "variable", contenido: "fruta" },
  { tipo: "texto", contenido: " " },
  { tipo: "directiva", contenido: "endif" },
  { tipo: "directiva", contenido: "endfor" }
]

const contexto = {
    frutas: ["manzana","plátano","uva"]
};

console.log(procesarBucles(tokens, contexto));
