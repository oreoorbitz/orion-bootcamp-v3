/**
 * EJERCICIO: PROCESAMIENTO DE MUESTRAS QUÍMICAS
 *
 * PARTE 1:
 * 1. Crea una función llamada "procesarMuestras" que reciba un array de objetos, donde cada objeto (muestra)
 *    tiene las siguientes propiedades:
 *      - compuesto (string)  -> e.g. "Acetona"
 *      - masa (number)       -> masa en microgramos
 *      - unidad (string)     -> código de la unidad deseada ("MG", "G", "KG")
 *
 * 2. La función debe:
 *    a. Validar que cada muestra tenga "compuesto", "masa", y "unidad".
 *    b. Validar que "masa" sea un número no negativo.
 *    c. Validar que "unidad" exista en el objeto "unidades" (definido abajo).
 *    d. Para cada muestra válida, usar la función "convertirMicrogramos" (del ejercicio anterior)
 *       para convertir la masa a la unidad solicitada.
 *    e. Construir un string con el formato:
 *       "El compuesto <compuesto> tiene una masa de <valor convertido><símbolo>"
 *       (donde <valor convertido> es el resultado de convertirMicrogramos, y <símbolo> es el símbolo de la unidad).
 *    f. Agregar ese string a un nuevo array de resultados. Omitir las muestras inválidas.
 *    g. Retornar el array de strings con los resultados.
 *
 * PARTE 2:
 * 1. Crea una función llamada "filtrarMuestrasVolatiles" que reciba:
 *      - compuestosVolatiles: array de strings (ej: ["Acetona", "Metanol"])
 *      - resultadosProcesados: array de strings, donde cada string luce como:
 *         "El compuesto <compuesto> tiene una masa de <valor><símbolo>"
 *
 *    Debe usar .filter() para retornar solo los strings que incluyan alguno de los compuestos volátiles.
 *    Ejemplo: si "Acetona" está en compuestosVolatiles, y el string contiene "Acetona", entonces se filtra.
 *
 * 2. Crea una función llamada "calcularMasaTotal" que reciba un array de resultados procesados
 *    (suponiendo que todos están en la misma unidad, por ejemplo "mg"). Debe:
 *    a. Usar .reduce() para extraer la parte numérica de la masa en cada string y sumarla.
 *    b. Retornar la suma total como número.
 *
 * 3. Integra estas funciones en un flujo:
 *    - Se procesan las muestras con "procesarMuestras" para obtener un array de strings.
 *    - (Opcional) Se filtra con "filtrarMuestrasVolatiles".
 *    - Se calcula la masa total con "calcularMasaTotal".
 *
 * ¡Éxito con tu implementación!
 */

// Objeto que mapea códigos de unidad a sus factores y símbolos.
const unidades = {
    MG: { factor: 1000, simbolo: "MG" },
    G:  { factor: 1e6, simbolo: "G" },
    KG: { factor: 1e9, simbolo: "KG" }
  };

  /**
   * sanitiza un string
   * @param {string}
   * @return {string}
   */

  const sanitizar = str => str.toUpperCase()

  /**
   * Función previa (del ejercicio anterior):
   * Convierte una masa en microgramos a la unidad indicada, validando:
   *  - microgramos >= 0
   *  - codigoUnidad existe en "unidades"
   *  - Retornar un string usando toFixed(2) y el símbolo (por ej. "1.23mg")
   */
  export function convertirMicrogramos(microgramos, codigoUnidad) {
    if (microgramos < 0) return ('Valor invalido');
    console.log('los microgramos es', microgramos)
   if (!unidades[codigoUnidad]) return 'Codigo de unidad invalido'; // Reemplazar
    const factor = unidades[codigoUnidad].factor
    const simbolo = unidades[codigoUnidad].simbolo
    const resultado = (microgramos/factor).toFixed(4)
    return (`${resultado} : MG`);


  }

  /**
   * PARTE 1:
   * Función que procesa las muestras. Valida las propiedades y, si son válidas, convierte la masa
   * y retorna un array de strings con el formato:
   * "El compuesto <compuesto> tiene una masa de <valor convertido><símbolo>"
   * Pista: investiga como iterar sobre un objecto
   */
  export function procesarMuestras(muestras) {
    // TODO:
    // 1. Crear un array de resultados vacío.
  let resultados = [];
      // 2. Iterar sobre "muestras":
      for( let muestra of muestras) {
      if (!muestra.compuesto || typeof muestra.compuesto !== 'string') {
        continue;
      }
      if (typeof (muestra.masa) !== 'number' || muestra.masa <= 0) {
        continue;
      }
      if (!unidades[muestra.unidad]) {
        continue;
      }
      let conversion = convertirMicrogramos(muestra.masa, muestra.unidad)
      if (conversion === 'valor invlido' || conversion === 'codigo de unidad invalido') {
        continue;
      }
      let resultado = `El compuesto ${muestra.compuesto} tiene una masa de ${conversion}`;
      resultados.push(resultado);
      }
    //    - Verificar que tenga "compuesto", "masa", "unidad"
    //    - Verificar "masa" >= 0
    //    - Verificar "unidad" en "unidades"
    //    - Convertir usando "convertirMicrogramos"
    //    - Construir el string y pushear a resultados
    // 3. Retornar resultados
    return resultados; // Reemplazar
  }


  /**
   * PARTE 2:
   * filtrarMuestrasVolatiles
   *
   * @param {Array<string>} compuestosVolatiles - e.g. ["Acetona", "Metanol"]
   * @param {Array<string>} resultadosProcesados - e.g. ["El compuesto Acetona tiene una masa de 1.23mg", ...]
   * @returns {Array<string>} un array filtrado de strings que contengan algún compuesto volátil
   */
  export function filtrarMuestrasVolatiles(compuestosVolatiles, resultadosProcesados) {
    // TODO: Implementar con .filter() y, por ejemplo, compuestosVolatiles.some(comp => cadena.includes(comp))

    return resultadosProcesados.filter(resultado => {
            return compuestosVolatiles.some(compuestoVolatil => resultado.includes(compuestoVolatil))
    }); // Reemplazar
  }


  /**
   * calcularMasaTotal
   *
   * Recibe un array de resultados (ej: "El compuesto X tiene una masa de 1.23mg")
   * Supone que todas las muestras están en la misma unidad (ej: mg).
   * Debe extraer la parte numérica y sumarla usando .reduce(), retornando la suma.
   * Pista: aprende sobre Regex en javascript, y cómo usar .match() para extraer partes de un string.
   * @param {Array<string>} resultadosProcesados
   * @returns {number} Masa total
   */
  export function calcularMasaTotal(resultadosProcesados) {
    const resultado = resultadosProcesados.reduce((acumulador, texto) => {
     const regex = /tiene una masa de ([\d.]+)\w*/;
     const match = texto.match(regex)
     if (match && match[1]) {
      console.log(match[1])
      const numero = parseFloat(match[1])
      if (!isNaN(numero) ){
       return acumulador + numero
      }
     }
    }, 0)
    return resultado
}







  /* Sin usar RegEx
  export function calcularMasaTotal(resultadosProcesados) {
    // TODO: Extraer la parte numérica de cada string y sumar.
    const resultado = resultadosProcesados.reduce( (acumulador, texto) => {
      const arrayPalabras = texto.split(' ');
      const talVezNumeros = arrayPalabras.map((texto) => parseFloat(texto))
      const numero = talVezNumeros.find( talVezNumero => talVezNumero >= 0)
      return acumulador + numero
       } ,0 )
       return resultado
    // Ej: "El compuesto Acetona tiene una masa de 1.23mg" => "1.23" => parseFloat("1.23")
    ; // Reemplazar
  }
*/



  // Ejemplo de uso:
  const muestras = [
    { compuesto: "Acetona", masa: 1234, unidad: "MG" },
    { compuesto: "Metanol", masa: 1658, unidad: "MG" },
    { compuesto: "Etanol", masa: 500,  unidad: "G" },
    { compuesto: "Agua", masa: -100,   unidad: "KG" },  // Inválida (masa negativa)
    { compuesto: "Butanol", masa: 2000, unidad: "XYZ" } // Inválida (unidad inexistente)
  ];

  // Procesamos:
  const resultados = procesarMuestras(muestras);
  console.log("Resultados:", resultados);

  // Filtramos compuestos volátiles:
  const volatiles = ["Acetona", "Metanol"];
  const resultadosVolatiles = filtrarMuestrasVolatiles(volatiles, resultados);
  console.log("Volátiles:", resultadosVolatiles);

  // Calculamos la masa total:
  const masaTotal = calcularMasaTotal(resultadosVolatiles);
  console.log("Masa total (mg):", masaTotal);
