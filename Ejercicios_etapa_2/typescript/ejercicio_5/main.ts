/**
 * MÓDULO 5: DETECCIÓN DE PLACEHOLDERS EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Una *plantilla* es una cadena de texto que puede incluir variables, directivas y expresiones especiales.
 * Estas plantillas no se usan directamente — primero deben ser procesadas para insertar datos reales.
 *
 * En lenguajes como Liquid, los placeholders se representan con dos tipos de marcadores:
 *   - `{{ variable }}` → muestra un valor del contexto
 *   - `{% directiva %}` → indica instrucciones como condicionales o bucles
 *
 * En este módulo, aprenderás a reconocer y separar esos bloques dentro del texto.
 *
 * Objetivo:
 * Dividir una cadena de plantilla en partes manejables: texto normal, variables, y directivas.
 *
 * Instrucciones:
 * 1. Crea una función llamada `detectarTokensPlantilla(entrada: string): string[]`
 * 2. Devuelve un arreglo con:
 *    - los bloques `{{ ... }}` (variables),
 *    - los bloques `{% ... %}` (directivas),
 *    - y el texto restante entre ellos.
 *
 * Entrada de ejemplo:
 * "Hola, {{ nombre }}. {% if admin %}Eres administrador.{% endif %}"
 *
 * Salida esperada:
 * [
 *   "Hola, ",
 *   "{{ nombre }}",
 *   ". ",
 *   "{% if admin %}",
 *   "Eres administrador.",
 *   "{% endif %}"
 * ]
 *
 * Consejo:
 * - Usa `.split()` con expresiones regulares o `.match()` con `/({{.*?}}|{%.*?%})/g`
 * - No interpretes aún el significado de los bloques — solo identifícalos.
 */
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
let entrada = "Hola, {{ nombre }}. {% if admin %}Eres administrador.{% endif %}";
console.log(detectarTokensPlantilla(entrada));
