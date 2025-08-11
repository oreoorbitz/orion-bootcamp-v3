/**
 * MÓDULO 10: FILTROS EN VARIABLES DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), una variable se puede transformar antes de renderizarse usando *filtros*.
 * Estos filtros permiten aplicar funciones como mayúsculas, formateo de moneda, inversión de texto, etc.
 *
 * Los filtros se escriben después de la variable, separados por `|`, y se aplican en orden como una *tubería* (pipeline):
 *
 * Ejemplo:
 *   - `{{ nombre | upcase }}` → convierte a mayúsculas
 *   - `{{ nombre | upcase | reverse }}` → mayúsculas y luego invertir el texto
 *
 * En este módulo extenderás tu motor para aplicar esos filtros antes de mostrar el valor.
 *
 * ✅ Ejemplo de plantilla completa (con loop, condición y filtros combinados):
 * ```liquid
 * {% for fruta in frutas %}
 *   {% if fruta != 'uva' %}
 *     {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta != 'uva'" },
 *   { tipo: "variable", contenido: "fruta | upcase | reverse" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas = ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "ANAZNAM" },
 *   { tipo: "texto", contenido: "ONATÁLP" }
 * ]
 * ```
 *
 * Objetivo:
 * Agregar soporte para filtros dentro de `{{ ... }}`, aplicándolos antes de mostrar el valor final.
 *
 * Instrucciones:
 * 1. Crea una función `aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string`
 *    - Busca el valor en el contexto
 *    - Aplica cada filtro desde `filtrosRegistrados` en orden
 *
 * 2. Extiende tu función `renderizarVariables()` para:
 *    - Detectar si el contenido del token `variable` contiene `|`
 *    - Separar el nombre de variable y los filtros con `.split('|')`
 *    - Aplicar `aplicarFiltros(...)` en lugar de acceder directamente al contexto
 *
 * Entrada de ejemplo (solo el token):
 * ```ts
 * { tipo: "variable", contenido: "fruta | upcase | reverse" }
 * ```
 *
 * contexto:
 * ```ts
 * { fruta: "plátano" }
 * ```
 *
 * filtrosRegistrados:
 * ```ts
 * {
 *   upcase: (x) => x.toUpperCase(),
 *   reverse: (x) => x.split('').reverse().join('')
 * }
 * ```
 *
 * Resultado esperado:
 * ```ts
 * "ONATÁLP"
 * ```
 *
 * Consejo:
 * - Recorta espacios usando `.trim()` en cada parte del filtro
 * - Puedes lanzar un error si el filtro no está definido
 * - Reutiliza el motor completo: primero bucles, luego condiciones, luego filtros → orden importa
 */

const filtrosRegistrados: Record<string, (x: any, ...args: any[]) => any> = {
    upcase: (x: any) => String(x).toUpperCase(),
    reverse: (x: any) => String(x).split("").reverse().join(""),
    multiply_by: (x: any, n: number) => Number(x) * Number(n),
    slice: (x: any, start: number, end?: number) => String(x).slice(start, end),
  };
  
  function parseArgs(argStr?: string): any[] {
    if (!argStr) return [];
    return argStr
      .split(",")
      .map(s => s.trim())
      .map(s => {
        if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
          return s.slice(1, -1);
        }
        
        const maybeNum = Number(s);
        return Number.isNaN(maybeNum) ? s : maybeNum;
      });
  }
  
  export function aplicarFiltros(
    nombreVariable: string,
    filtros: string[],
    contexto: Record<string, any>,
    filtrosReg: Record<string, Function>
  ): string {
    if (!Object.prototype.hasOwnProperty.call(contexto, nombreVariable)) {
      throw new Error(`Variable '${nombreVariable}' no encontrada en el contexto.`);
    }
  
    let valor: any = contexto[nombreVariable];
  
    for (const filtroCrudo of filtros) {
      const parte = filtroCrudo.trim();
      if (!parte) continue;
  
      const [nombre, argStr] = parte.split(":");
      const filtro = nombre.trim();
  
      if (typeof filtrosReg[filtro] !== "function") {
        throw new Error(`Filtro '${filtro}' no está definido.`);
      }
  
      const args = parseArgs(argStr);
      valor = (filtrosReg[filtro] as Function)(valor, ...args);
    }
  
    return String(valor);
  }
  
  export function renderizarVariables(
    tokens: Array<{ tipo: string; contenido: string }>,
    contexto: Record<string, any>,
    filtrosReg: Record<string, Function> = filtrosRegistrados
  ): Array<{ tipo: "texto"; contenido: string }> {
    const salida: Array<{ tipo: "texto"; contenido: string }> = [];
  
    for (const token of tokens) {
      if (token.tipo !== "variable") {
        continue;
      }
  
      const partes = token.contenido.split("|").map(p => p.trim()).filter(Boolean);
      const nombreVariable = partes.shift() ?? "";
  
      const textoRenderizado = aplicarFiltros(nombreVariable, partes, contexto, filtrosReg);
      salida.push({ tipo: "texto", contenido: textoRenderizado });
    }
  
    return salida;
  }
  

  const contextoDemo = { fruta: "plátano" };
  const tokensDemo = [{ tipo: "variable", contenido: "fruta | upcase | reverse" }];
  
  const resultadoDemo = renderizarVariables(tokensDemo, contextoDemo);
  console.log(resultadoDemo);
  
  console.log(
    renderizarVariables([{ tipo: "variable", contenido: "fruta | slice: 0, 4 | upcase" }], contextoDemo)
  );
  console.log(
    aplicarFiltros("x", ["multiply_by: 2", "multiply_by: 5", "multiply_by: 0.5"], { x: 2 }, filtrosRegistrados)
  );

  /*
 Una expresion de filtros se puede dividir en dos partes
 El flujo de informacion en un filtro es una pipa de izquierda a derecha
 2. VOY, MULTIPLICAR - POR : 2, RESULTA EN : 4, VOY, MULTIPLICAR - POR 5, RESULTA EN : 20, VOY DIVIDIR POR 2, RESULTA EN: 10
 2 | multiply_by: 2 | 
  */
  