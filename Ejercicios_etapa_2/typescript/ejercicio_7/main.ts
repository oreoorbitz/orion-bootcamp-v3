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

function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string {
return tokens.map( token => {
  if (token.tipo === 'variable') {
        return contexto[token.contenido] ?? '';
  }

  return token.contenido;
    }).join(''); // Unir todo en una sola cadena
}

const tokens: TokenPlantilla[] = [
    { tipo: "texto", contenido: "Hola, " },
    { tipo: "variable", contenido: "nombre" },
    { tipo: "texto", contenido: ". Bienvenido a " },
    { tipo: "variable", contenido: "ciudad" },
    { tipo: "texto", contenido: "." }
];

const contexto = {
    nombre: "Paola",
    ciudad: "México"
};

console.log(renderizarVariables(tokens, contexto))
