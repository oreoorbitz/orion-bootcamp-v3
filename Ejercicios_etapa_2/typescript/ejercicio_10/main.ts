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
 *   {% if fruta %}
 *     {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
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
 *    nota: el objeto de 'filtrosRegistrados' esta escrito mas abajo en las instruciones
 *
 *
 * 2. Extiende tu función `renderizarVariables()` para:
 *    - Detectar si el contenido del token `variable` contiene `|`
 *    - Separar el nombre de variable y los filtros con `.split('|')`
 *    - Aplicar `aplicarFiltros(...)` en lugar de acceder directamente al contexto
 *
 * Para probar tu funcion, utiliza:
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
type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva';
type TipoDirectiva = 'if' | 'endif' | 'elsif' | 'else' | 'for' | 'endfor';

interface TokenPlantilla {
    tipo: TipoTokenPlantilla;
    contenido: string;
    directiva?: TipoDirectiva;
}

function aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string {
let valor = contexto[nombreVariable];

// Aplicar cada filtro en orden
    for (let filtro of filtros) {
        let filtroLimpio = filtro.trim();
        if (!filtrosRegistrados[filtroLimpio]) {
            throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
        }

        valor = filtrosRegistrados[filtroLimpio](valor);
    }

    return valor;
}

function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string {
return tokens.map(token => {
        if (token.tipo === 'variable') {
            let partes = token.contenido.split('|').map(part => part.trim()); // Separar filtros
            let nombreVariable = partes[0];
            let filtros = partes.slice(1); // Extraer filtros
            return aplicarFiltros(nombreVariable, filtros, contexto, filtrosRegistrados);
        }
        return token.contenido;
    }).join('');
}


let token: {} = { tipo: "variable", contenido: "fruta | upcase | reverse" };
let context: {} = { fruta: "plátano" };
let filtrosRegistrado: {} = {
  upcase: (x) => x.toUpperCase(),
  reverse: (x) => x.split('').reverse().join('')
}


const contexto = { fruta: "plátano", nombre: "Paola" };

const filtrosRegistrados = {
    upcase: (x: string) => x.toUpperCase(),
    reverse: (x: string) => x.split('').reverse().join(''),
    agregarSigno: (x: string) => x + "!"
};

// 🔹 Prueba con filtros en "fruta"
console.log(aplicarFiltros("fruta", ["upcase", "reverse"], contexto, filtrosRegistrados)); // "ONATÁLP"

// 🔹 Prueba con filtros en "nombre"
console.log(aplicarFiltros("nombre", ["reverse", "agregarSigno"], contexto, filtrosRegistrados)); // "aloaP!"

// 🔹 Prueba sin




/**
 * 🧪 Tarea opcional: Soporte para filtros con parámetros
 *
 * Hasta ahora, tus filtros no aceptan parámetros. Pero en Liquid real, muchos filtros permiten pasar argumentos.
 *
 * Ejemplo:
 *   - `{{ nombre | replace: "a", "*" }}` → reemplaza todas las "a" por "*"
 *   - `{{ precio | times: 1.16 }}` → multiplica el valor por 1.16 (por ejemplo, para IVA)
 *
 * ✅ Sintaxis esperada:
 * - Los argumentos del filtro se separan por comas: `filtro: arg1, arg2`
 * - Los filtros siguen separados por `|`
 *
 * ✅ Ejemplo de token:
 * ```ts
 * { tipo: "variable", contenido: "nombre | replace: 'a', '*' | upcase" }
 * ```
 *
 * ✅ Resultado esperado si nombre = "carlos":
 * ```ts
 * "CRLOS"
 * ```
 *
 * ✅ Filtro de ejemplo que puedes registrar:
 * ```ts
 * {
 *   replace: (input: string, from: string, to: string) => input.split(from).join(to),
 *   upcase: (input: string) => input.toUpperCase()
 * }
 * ```
 *
 * ✅ Sugerencia de implementación:
 * - En `renderizarVariables()`, al detectar `|`, divide cada segmento
 * - Si el filtro contiene `:`, separa el nombre y los argumentos
 * - Divide los argumentos por `,`, elimina comillas, y pásalos al filtro como parámetros
 *
 * ✅ Ejemplo de parsing:
 * ```ts
 * // De "replace: 'a', '*'" → ['replace', "'a'", "'*'"]
 * ```
 *
 * Puedes escribir una función auxiliar:
 * ```ts
 * function parseFiltro(crudo: string): [nombre: string, argumentos: string[]]
 * ```
 *
 * Esto no se usará en módulos futuros,
 * pero te ayudará a familiarizarte con cómo Shopify y Liquid manejan funciones con argumentos.
 */
