/**
 * EJERCICIO DE CONVERSIÓN DE MICROGRAMOS A UNIDADES DE MASA
 *
 * Instrucciones:
 *
 * 1. Escribe una función que reciba un número que representa la masa en microgramos y retorne el valor convertido a la unidad deseada.
 *
 *    Detalles:
 *    - La función debe recibir dos parámetros:
 *         - microgramos: número que representa la masa en microgramos.
 *         - codigoUnidad: string con el código de la unidad a la que deseas convertir (por ejemplo, "MG", "G", "KG").
 *    - Utiliza el siguiente objeto "unidades", que mapea cada código a un objeto con dos propiedades:
 *
 *         const unidades = {
 *           MG: { factor: 1000, simbolo: "mg" },
 *           G:  { factor: 1e6, simbolo: "g" },
 *           KG: { factor: 1e9, simbolo: "kg" }
 *         }
 *
 *    - Realiza las siguientes validaciones (usando "early return"):
 *         a. Si microgramos es negativo, retorna "Valor inválido".
 *         b. Si codigoUnidad no existe en el objeto "unidades", retorna "Código de unidad inválido".
 *
 *    - Convierte la masa dividiendo microgramos por el factor correspondiente y formatea el resultado a dos decimales utilizando toFixed(2).
 *    - Retorna un string que combine el valor formateado y el símbolo correspondiente.
 *
 *    Sugerencia: Nombra esta función usando un verbo que describa su acción, por ejemplo "convertirMicrogramos".
 *
 * 2. Recuerda que el objetivo de este ejercicio es practicar:
 *      - La creación de funciones que retornen valores.
 *      - El uso de validaciones tempranas ("early return") para verificar entradas.
 *      - El acceso a propiedades de objetos utilizando notación de punto y de corchetes.
 *      - El formateo de números con toFixed.
 *      - La integración de funciones y el uso de constantes.
 *
 * ¡Éxito con tu implementación!
 */

// TODO: Escribe la función para convertir microgramos a unidades de masa.
// Sugerencia de nombre: convertirMicrogramos
// Pista:
// - Si microgramos < 0, retorna "Valor inválido".
// - Si el código de unidad no existe en el objeto, retorna "Código de unidad inválido".
// - Realiza la conversión dividiendo microgramos por el factor correspondiente del objeto "unidades" y formatea el resultado con toFixed(2).
// - Retorna el string formado por el valor formateado y el símbolo correspondiente.

// Escribe código aquí abajo
