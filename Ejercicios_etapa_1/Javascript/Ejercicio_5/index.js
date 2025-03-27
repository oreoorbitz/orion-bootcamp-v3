// @ts-check
/**
 * Objeto que mapea códigos de moneda a sus respectivos símbolos.
 * @type {{USD: string, EUR: string, GBP: string}}
 */
const monedas = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }
 console.log(monedas.USD)
  /**
   * Convierte una cantidad en centavos a un formato monetario.
   *
   * @param {number} centavos - Número entero que representa la cantidad en centavos.
   * @param {string} codigoMoneda - Código de la moneda (por ejemplo, "USD", "EUR", "GBP").
   * @returns {string} El valor formateado en la moneda correspondiente o un mensaje de error si los parámetros no son válidos.
   *
   * Ejemplos:
   *  convertirCentsAMoneda(1234, "USD") => "$12.34"
   *  convertirCentsAMoneda(50, "EUR")  => "€0.50"
   *  convertirCentsAMoneda(-100, "GBP") => "Valor invalido"
   *  convertirCentsAMoneda(200, "ABC") => "Codigo de moneda invalido"
   */
  export const convertirCentsAMoneda = (centavos, codigoMoneda) => {
   if (centavos < 0) return ('Valor invalido');

   if (!monedas[codigoMoneda]) return ("Codigo de moneda invalido")

  const valorEntero = (centavos/100).toFixed(2);
  const simboloMoneda = monedas[codigoMoneda]

  return (`${simboloMoneda}${valorEntero}`)
  }



  // Ejemplos de uso:
  const convercion = convertirCentsAMoneda(-4000, "GBP")
  const convercionDos = convertirCentsAMoneda(1000, "EURR")
  const convercionTres = convertirCentsAMoneda(2000, "USD")
