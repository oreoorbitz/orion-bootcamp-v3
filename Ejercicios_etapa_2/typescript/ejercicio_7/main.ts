/**
 * MÓDULO 7: REEMPLAZO DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En los motores de plantillas como Liquid, `{{ nombre }}` se reemplaza por el valor real de una variable del contexto.
 * Esto permite generar contenido dinámico desde datos, como hacer que el título de una página cambie según el usuario.
 *
 * En el módulo anterior, ya clasificaste cada fragmento de una plantilla como:
 * - texto plano
 * - variable (`{{ ... }}`)
 * - o directiva (`{% ... %}`)
 *
 * Ahora, vas a enfocarte **solamente en las variables**.
 *
 * Objetivo:
 * Reemplazar todos los tokens de tipo `variable` por los valores correspondientes en un objeto de contexto.
 *
 * ✅ Ejemplo de plantilla original:
 * ```html
 * Hola, {{ nombre }}. Bienvenido a {{ ciudad }}.
 * ```
 *
 * Puedes reutilizar tu código del módulo 5 y 6 para:
 * 1. Tokenizar esta cadena (`detectarTokensPlantilla`)
 * 2. Clasificar los tokens (`clasificarTokensPlantilla`)
 *
 * Entrada:
 * tokens:
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: ". Bienvenido a " },
 *   { tipo: "variable", contenido: "ciudad" },
 *   { tipo: "texto", contenido: "." }
 * ]
 *
 * contexto:
 * {
 *   nombre: "Carlos",
 *   ciudad: "Madrid"
 * }
 *
 * Resultado esperado:
 * "Hola, Carlos. Bienvenido a Madrid."
 *
 * Instrucciones:
 * 1. Crea una función `renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string`
 * 2. Para cada token:
 *    - Si el `tipo` es `"variable"`, busca la clave en `contexto`
 *    - Si no existe, puedes devolver una cadena vacía (`""`) o un valor por defecto
 *    - Si es tipo `"texto"` o `"directiva"`, conserva el texto tal como está
 *
 * Consejo:
 * - Usa `.map()` para transformar los tokens en strings
 * - Recuerda que en esta etapa aún **no debes interpretar las directivas** (`{% %}`)
 * - Concatenar los resultados con `.join('')` al final puede ayudarte a construir la cadena completa
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
let entradaInicial = "Hola, {{ nombre }}. Bienvenido a {{ ciudad }}";
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

// esta es la equivalente a tokens, imprimir si es necesario saber que es cada cosa
let entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);

function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string {
    return tokens.map((token, index) => {
        if (token.tipo === 'variable') {
            return contexto[token.contenido] ?? '';
        }

        // Si el token actual es texto y el siguiente es una variable, añadimos espacio al final
        if (token.tipo === "texto" && tokens[index + 1]?.tipo === "variable") {
            return token.contenido + " ";
        }

        return token.contenido;
    }).join('');
}

const contexto = {
    nombre: "Paola",
    ciudad: "México"
};
let entradaRenderizada = renderizarVariables(entradaClasificada, contexto);
console.log(entradaRenderizada);
