/**
 * MÓDULO 6: CLASIFICACIÓN DE TOKENS DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * Ya separaste la plantilla en partes individuales (texto, variables y directivas), pero todas son solo cadenas.
 * Antes de poder renderizar variables o interpretar directivas, necesitas saber **qué es cada una**.
 *
 * Este módulo es el equivalente al que hiciste en HTML cuando clasificaste etiquetas como apertura, cierre o texto.
 * Aquí harás algo similar: clasificar cada string como tipo `texto`, `variable`, o `directiva`.
 *
 * Objetivo:
 * Convertir un arreglo de strings en un arreglo de objetos con tipo explícito.
 *
 * Instrucciones:
 * 1. Crea una función llamada `clasificarTokensPlantilla(tokens: string[]): TokenPlantilla[]`
 * 2. Devuelve un arreglo donde cada string se convierte en un objeto con esta estructura:
 *
 * ```ts
 * type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva'
 *
 * interface TokenPlantilla {
 *   tipo: TipoTokenPlantilla;
 *   contenido: string;
 * }
 * ```
 *
 * 3. Clasifica según las reglas:
 *   - Si comienza con `{{` y termina con `}}`, es tipo `'variable'`
 *   - Si comienza con `{%` y termina con `%}`, es tipo `'directiva'`
 *   - Si no es ninguno de los dos, es tipo `'texto'`
 *
 * Entrada:
 * [
 *   "Hola, ",
 *   "{{ nombre }}",
 *   ". ",
 *   "{% if admin %}",
 *   "Eres administrador.",
 *   "{% endif %}"
 * ]
 *
 * Resultado esperado:
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: ". " },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Eres administrador." },
 *   { tipo: "directiva", contenido: "endif" }
 * ]
 *
 * Consejo:
 * - Usa `.startsWith()` y `.endsWith()` para clasificar cada string
 * - Recorta los delimitadores (`{{ }}`, `{% %}`) usando `.slice()` o `.replace()` para extraer solo el contenido
 */

type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva'

interface TokenPlantilla {
 tipo: TipoTokenPlantilla;
 contenido: string;
}

function detectarTokensPlantilla(entrada: string): string[] {
    const regex = /({{.*?}}|{%.*?%})/g;
    let resultado: string[] = [];
    let ultimoIndice = 0;

    // Usamos `matchAll()` para obtener todas las coincidencias y sus posiciones en la cadena
    for (const match of entrada.matchAll(regex)) {
        const token = match[0]; // Token detectado
        const inicioToken = match.index!; // Posición en la cadena

        // Agregar el texto entre el último índice y la posición actual del token
        if (inicioToken > ultimoIndice) {
            resultado.push(entrada.substring(ultimoIndice, inicioToken));
        }

        // Agregar el token
        resultado.push(token);
        ultimoIndice = inicioToken + token.length; // Actualizar el índice de seguimiento
    }

    // Agregar el resto del texto después del último token
    if (ultimoIndice < entrada.length) {
        resultado.push(entrada.substring(ultimoIndice));
    }

    return resultado;
}

//Prueba con la entrada
let entradaInicial = "Hola, {{ nombre }}. {% if admin %}Eres administrador.{% endif %}";
let entradaTokenizada = (detectarTokensPlantilla(entradaInicial));



function clasificarTokensPlantilla(tokens: string[]): TokenPlantilla[] {
  return tokens.map(token => {
    if (token.startsWith("{{") && token.endsWith("}}")) {
      return { tipo: "variable", contenido: token.slice(2, -2).trim() };
    }
    if (token.startsWith("{%") && token.endsWith("%}")) {
      return { tipo: "directiva", contenido: token.slice(2, -2).trim() };
    }

    return { tipo: "texto", contenido: token.trim() };
  });
}

let entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
console.log(entradaClasificada);
