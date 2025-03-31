/**
 * EJERCICIO 7: PROCESAMIENTO DE MUESTRAS QUÍMICAS
 *
 * Instrucciones:
 * 1. Crea una función llamada "procesarMuestras" que reciba un array de objetos.
 *    Cada objeto representa una muestra y debe tener las siguientes propiedades:
 *      - compuesto: string (nombre del compuesto, por ejemplo "Acetona")
 *      - masa: number (masa en microgramos)
 *      - unidad: string (código de la unidad a la que se desea convertir, por ejemplo "MG", "G", "KG")
 *
 * 2. La función debe:
 *    a. Validar que cada muestra tenga las propiedades "compuesto", "masa" y "unidad". Además, verifica que:
 *         - "masa" sea un número y no sea negativo.
 *         - "unidad" exista en el objeto "unidades" (que mapea cada código a un objeto con las propiedades "factor" y "simbolo").
 *    b. Para cada muestra válida, utiliza la función "convertirMicrogramos" (implementada en el ejercicio anterior)
 *       para convertir la masa a la unidad deseada.
 *    c. Construir un string con el siguiente formato:
 *         "El compuesto <compuesto> tiene una masa de <valor convertido><símbolo>"
 *       donde <valor convertido> es el resultado de la conversión y <símbolo> es el símbolo correspondiente obtenido
 *       del objeto "unidades".
 *    d. Agregar el string a un nuevo array. Si alguna muestra es inválida, omitirla.
 *
 * 3. Retorna el array de strings con los resultados.
 *
 * Ejemplo:
 * Dada la muestra { compuesto: "Acetona", masa: 1234, unidad: "MG" },
 * y suponiendo que convertirMicrogramos(1234, "MG") retorna "1.23mg", la función debe incluir en el resultado:
 * "El compuesto Acetona tiene una masa de 1.23mg".
 *
 * Sugerencia: Reutiliza la función "convertirMicrogramos" del ejercicio anterior para realizar la conversión.
 *
 * ¡Éxito con tu implementación!
 */

// Asumiendo que ya existe la función convertirMicrogramos en el mismo módulo o importada:
export const convertirMicrogramos = (microgramos, codigoUnidad) => {
    // Implementación previa (puede estar completada en otro ejercicio)

};

export const procesarMuestras = (muestras) => {
    // TODO: Declara un array vacío para almacenar los resultados.
    
    // TODO: Itera sobre el array de muestras.
    // Para cada muestra, verifica que tenga las propiedades "compuesto", "masa" y "unidad".
    // Verifica que "masa" sea un número no negativo y que "unidad" exista en el objeto "unidades" (usa la misma validación que en convertirMicrogramos).
    // Si la muestra es válida:
    //   - Utiliza la función "convertirMicrogramos" para convertir la masa.
    //   - Construye un string con el formato:
    //         "El compuesto <compuesto> tiene una masa de <valor convertido><símbolo>"
    //   - Agrega el string al array de resultados.
    
    // TODO: Retorna el array de resultados.
    return []; // Reemplazar por la implementación correcta.
};

// Ejemplo de uso:
const muestras = [
    { compuesto: "Acetona", masa: 1234, unidad: "MG" },
    { compuesto: "Etanol", masa: 500, unidad: "G" },
    { compuesto: "Agua", masa: -100, unidad: "KG" },  // Muestra inválida (masa negativa)
    { compuesto: "Metanol", masa: 2000, unidad: "XYZ" } // Muestra inválida (unidad no existente)
];
const resultadoProcesamiento = procesarMuestras(muestras);
console.log(resultadoProcesamiento);
