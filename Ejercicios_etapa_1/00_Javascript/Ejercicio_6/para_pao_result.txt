/**
 * OBJETO UNIDADES
 * Mapea códigos de unidad a sus factores de conversión y símbolos.
 * - MG: factor 1000, simbolo "mg"
 * - G:  factor 1e6, simbolo "g"
 * - KG: factor 1e9, simbolo "kg"
 */
const unidades = {
    MG: { factor: 1000, simbolo: "mg" },
    G:  { factor: 1e6, simbolo: "g" },
    KG: { factor: 1e9, simbolo: "kg" }
  };
  
  /**
   * convertirMicrogramos
   * 
   * Convierte una masa dada en microgramos (microgramos) a la unidad solicitada (codigoUnidad).
   * - Valida que microgramos >= 0
   * - Valida que la unidad exista en el objeto unidades
   * - Utiliza toFixed(2) para formatear
   * 
   * @param {number} microgramos
   * @param {string} codigoUnidad - e.g. "MG", "G", "KG"
   * @returns {string} un string con el valor formateado, e.g. "1.23mg",
   *                   o mensajes de error: "Valor inválido" o "Código de unidad inválido".
   */
  export function convertirMicrogramos(microgramos, codigoUnidad) {
    if (microgramos < 0) {
      return "Valor inválido";
    }
    if (!unidades[codigoUnidad]) {
      return "Código de unidad inválido";
    }
    const factor = unidades[codigoUnidad].factor;
    const simbolo = unidades[codigoUnidad].simbolo;
    const resultado = (microgramos / factor).toFixed(2);
    return `${resultado}${simbolo}`;
  }
  
  /**
   * procesarMuestras
   *
   * Recibe un array de objetos con las propiedades:
   *  - compuesto (string)
   *  - masa (number, en microgramos)
   *  - unidad (string, e.g. "MG", "G", "KG")
   * 
   * Valida las propiedades, y si son válidas, convierte la masa usando convertirMicrogramos.
   * Retorna un array de strings con el formato:
   *  "El compuesto <compuesto> tiene una masa de <valor convertido><símbolo>"
   * Omitiendo las muestras inválidas.
   * Pista: investiga como iterar sobre un objecto
   * @param {Array} muestras
   * @returns {Array<string>}
   */
  export function procesarMuestras(muestras) {
    const resultados = [];
  
    for (const muestra of muestras) {
      // Validar propiedades
      if (!muestra.compuesto || typeof muestra.compuesto !== "string") {
        continue; // inválido, omitir
      }
      if (typeof muestra.masa !== "number" || muestra.masa < 0) {
        continue; // inválido, omitir
      }
      if (!unidades[muestra.unidad]) {
        continue; // inválido, omitir
      }
  
      // Convertir masa
      const conversion = convertirMicrogramos(muestra.masa, muestra.unidad);
      if (conversion === "Valor inválido" || conversion === "Código de unidad inválido") {
        continue; // conversión fallida, omitir
      }
  
      // Construir string
      const resultado = `El compuesto ${muestra.compuesto} tiene una masa de ${conversion}`;
      resultados.push(resultado);
    }
  
    return resultados;
  }
  
  /**
   * filtrarMuestrasVolatiles
   *
   * Recibe:
   *  - compuestosVolatiles: array de strings con nombres de compuestos volátiles (e.g. ["Acetona", "Metanol"])
   *  - resultadosProcesados: array de strings, e.g. ["El compuesto Acetona tiene una masa de 1.23mg", ...]
   * 
   * Retorna un nuevo array con los resultados que incluyan alguno de los compuestos en compuestosVolatiles.
   * Se puede usar .filter() y .some() para lograr esto.
   * 
   * @param {Array<string>} compuestosVolatiles
   * @param {Array<string>} resultadosProcesados
   * @returns {Array<string>}
   */
  export function filtrarMuestrasVolatiles(compuestosVolatiles, resultadosProcesados) {
    return resultadosProcesados.filter((resultado) => {
      return compuestosVolatiles.some((compuestoVolatil) =>
        resultado.includes(compuestoVolatil)
      );
    });
  }
  
  /**
   * calcularMasaTotal
   *
   * Recibe un array de strings (resultados procesados), todos asumiendo misma unidad (e.g. "mg").
   * Debe extraer la parte numérica de la masa y sumarla. Ej:
   *  "El compuesto Acetona tiene una masa de 1.23mg" => extraer "1.23"
   * Usa .reduce() para acumular la suma de esos valores numéricos.
   * Retorna la suma total como number.
   * Pista: aprende sobre Regex en javascript, y cómo usar .match() para extraer partes de un string.
   * @param {Array<string>} resultadosProcesados
   * @returns {number}
   */
  export function calcularMasaTotal(resultadosProcesados) {
    return resultadosProcesados.reduce((acumulador, texto) => {
      // Buscar la parte de la masa usando una expresión regular.
      // Ejemplo: "El compuesto X tiene una masa de 1.23mg"
      // Queremos capturar "1.23"
      const regex = /tiene una masa de ([\d.]+)\w*/;
      const match = texto.match(regex);
      if (match && match[1]) {
        const numero = parseFloat(match[1]);
        if (!isNaN(numero)) {
          return acumulador + numero;
        }
      }
      return acumulador;
    }, 0);
  }
  
  // Ejemplo de uso:
  const muestras = [
    { compuesto: "Acetona", masa: 1234, unidad: "MG" },
    { compuesto: "Etanol", masa: 500,  unidad: "G" },
    { compuesto: "Agua", masa: -100,   unidad: "KG" },   // Inválida
    { compuesto: "Butanol", masa: 2000, unidad: "XYZ" }  // Inválida
  ];
  
  const resultados = procesarMuestras(muestras);
  console.log("Resultados:", resultados);
  
  const volatiles = ["Acetona", "Metanol"];
  const resultadosVolatiles = filtrarMuestrasVolatiles(volatiles, resultados);
  console.log("Volátiles:", resultadosVolatiles);
  
  const masaTotal = calcularMasaTotal(resultadosVolatiles);
  console.log("Masa total (mg):", masaTotal);
  