//import { takeCoverageInsideWorker } from "vitest/browser.js";

/**
 * MÓDULO 11: ASIGNACIÓN DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), se pueden definir nuevas variables directamente desde la plantilla usando `{% assign %}`.
 * Esto permite guardar temporalmente un valor para usarlo más adelante en condiciones, bucles o filtros.
 *
 * Imagina que tienes una lista de frutas, y quieres mostrar cada una precedida por un mensaje común definido con `assign`.
 * Además, transformas el contenido usando filtros como `upcase` y `reverse`.
 *
 * ✅ Ejemplo de plantilla:
 * ```liquid
 * {% assign mensaje = "Fruta disponible:" %}
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ mensaje | upcase }} {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados esperados:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "assign mensaje = \"Fruta disponible:\"" },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
 *   { tipo: "variable", contenido: "mensaje | upcase" },
 *   { tipo: "variable", contenido: "fruta | upcase | reverse" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Contexto de entrada:
 * ```ts
 * { frutas: ["manzana", "plátano"] }
 * ```
 *
 * ✅ Resultado esperado:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "FRUTA DISPONIBLE: ANAZNAM" },
 *   { tipo: "texto", contenido: "FRUTA DISPONIBLE: ONATÁLP" }
 * ]
 * ```
 *
 * 🎯 Objetivo:
 * Detectar y ejecutar asignaciones del tipo `{% assign nombre = valor %}` y actualizar el `contexto` con la nueva variable.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función `procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada token `tipo: "directiva"` que comience con `"assign "`:
 *    - Extrae el nombre y el valor con `.split("=")`
 *    - Si el valor está entre comillas (`"Hola"`), guárdalo como texto literal
 *    - Si **no** tiene comillas (`otroNombre`), busca el valor en el `contexto`
 *    - Guarda esa nueva variable en el `contexto`
 *    - El token `assign` no debe producir ningún contenido visible
 *
 * 🔍 Detalles a tener en cuenta:
 * - Los valores pueden ser:
 *   - Texto literal entre comillas: `"Hola"`
 *   - Un número: `42`
 *   - Otro nombre de variable: `otroNombre`
 * - Si detectas comillas (`"` o `'`), quítalas al guardar el valor
 * - Si no hay comillas, interpreta el contenido como el nombre de otra variable
 *
 * ✅ Consejo:
 * - Usa `.trim()` después del `split("=")` para evitar errores con espacios
 * - Este paso debe ejecutarse **antes** de renderizar variables o evaluar condicionales
 * - Las asignaciones no deben dejar rastros visibles en el resultado renderizado
 *
 * ⚠️ Validación:
 * Asegúrate de que tu motor todavía pueda:
 * - Procesar filtros (`upcase`, `reverse`, etc.)
 * - Evaluar condicionales (`if fruta`)
 * - Repetir contenido en bucles (`for fruta in frutas`)
 * - Y ahora también asignar valores (`assign`)
 */
type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva';
type TipoDirectiva = 'if' | 'endif' | 'elsif' | 'else' | 'for' | 'endfor';

interface TokenPlantilla {
    tipo: TipoTokenPlantilla;
    contenido: string;
    directiva?: TipoDirectiva;
}

function aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string | string[] {
    let valor = contexto[nombreVariable];

    if (valor === undefined) {
        throw new Error(`Error: La variable '${nombreVariable}' no está definida en el contexto.`);
    }

    if (Array.isArray(valor)) {
        return valor.map(elemento => {
            let resultado = elemento;
            for (let filtro of filtros) {
                let filtroLimpio = filtro.trim();
                if (!filtrosRegistrados[filtroLimpio]) {
                    throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
                }
                resultado = filtrosRegistrados[filtroLimpio](resultado);
            }
            return resultado;
        });
    } else {
        for (let filtro of filtros) {
            let filtroLimpio = filtro.trim();
            if (!filtrosRegistrados[filtroLimpio]) {
                throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
            }
            valor = filtrosRegistrados[filtroLimpio](valor);
        }
        return valor;
    }
}



function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string {
    return tokens.map(token => {
        if (token.tipo === 'variable') {
            let partes = token.contenido.split('|').map(part => part.trim()); // Separar filtros
            let nombreVariable = partes[0];
            let filtros = partes.slice(1); // Extraer filtros

            let resultado = aplicarFiltros(nombreVariable, filtros, contexto, filtrosRegistrados);

            // Asegurar que el resultado es un array y separar correctamente cada transformación
            return Array.isArray(resultado) ? resultado.map(el => `${el}`).join('\n') : resultado;
        }
        return token.contenido;
    }).join('\n'); // Unir tokens con saltos de línea
}

function procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
let resultado: TokenPlantilla[] = [];

for(let token of tokens) {
  if(token.tipo === 'directiva' && token.contenido.startsWith("assing")) {
    let partes = token.contenido.replace("assign","").split("=").map(part => part.trim());
    if (partes.length === 2) {
      let nombreVariable = partes[0];
      let valorCrudo = partes[1];

       // Si el valor está entre comillas, quitar comillas y guardar el texto literal
       if (valorCrudo.startsWith('"') && valorCrudo.endsWith('"') || valorCrudo.startsWith("'") && valorCrudo.endsWith("'")) {
        contexto[nombreVariable] = valorCrudo.slice(1, -1);
       }
       // Si el valor es un número, guardarlo como número
       else if (!isNaN(Number(valorCrudo))) {
        contexto[nombreVariable] = Number(valorCrudo);
       }
       // Si no, asumir que es el nombre de otra variable y obtener su valor del contexto
       else {
       contexto[nombreVariable] = contexto[valorCrudo] ?? null
       }
    }
  } else {
          resultado.push(token); // Los tokens de asignación no deben producir contenido visible
    }
}

  return resultado;
}


let tokens = [
 { tipo: "directiva", contenido: "assign mensaje = \"Fruta disponible:\"" },
 { tipo: "directiva", contenido: "for fruta in frutas" },
 { tipo: "directiva", contenido: "if fruta" },
 { tipo: "variable", contenido: "mensaje | upcase" },
 { tipo: "variable", contenido: "fruta | upcase | reverse" },
 { tipo: "directiva", contenido: "endif" },
 { tipo: "directiva", contenido: "endfor" }
 ]
let contexto = { frutas: ["manzana", "plátano"] };
let filtrosRegistrados: {} = {
  upcase: (x) => x.toUpperCase(),
  reverse: (x) => x.split('').reverse().join('')
}

// Primero, procesamos las asignaciones para actualizar el contexto
let tokensProcesados = procesarAsignaciones(tokens, contexto);

// Luego, usamos renderizarVariables() para convertir los tokens en contenido final
let resultadoFinal = renderizarVariables(tokensProcesados, contexto).split('\n').map(linea => ({ tipo: "texto", contenido: linea }));

console.log(resultadoFinal);
