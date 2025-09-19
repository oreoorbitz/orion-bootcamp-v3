// main.rs
// EJERCICIO 5: CONVERSIÓN DE CENTAVOS A FORMATO MONETARIO
//
// Instrucciones:
//  1. Implementa una función llamada "convertir_cents_a_moneda" que reciba dos parámetros:
//       - centavos: número entero que representa la cantidad en centavos.
//       - codigo_moneda: string con el código de la moneda (por ejemplo, "USD", "EUR", "GBP").
//  2. La función debe:
//       a. Retornar "Valor invalido" si centavos es negativo.
//       b. Retornar "Codigo de moneda invalido" si codigo_moneda no es "USD", "EUR" o "GBP".
//          Estas validaciones deben hacerse de forma temprana.
//       c. Convertir centavos a la unidad monetaria dividiendo por 100.
//       d. Formatear el resultado a dos decimales utilizando format!("{:.2}", valor).
//       e. Retornar un string que combine el símbolo (según el código de moneda) con el valor formateado.
//
// Ejemplos:
//   convertir_cents_a_moneda(1234, "USD") => "$12.34"
//   convertir_cents_a_moneda(50, "EUR")  => "€0.50"
//   convertir_cents_a_moneda(-100, "GBP") => "Valor invalido"
//   convertir_cents_a_moneda(200, "ABC")  => "Codigo de moneda invalido"

/// Convierte una cantidad en centavos a un formato monetario.
/// 
/// # Parámetros
/// - `centavos`: número entero que representa la cantidad en centavos.
/// - `codigo_moneda`: string que representa el código de la moneda ("USD", "EUR", "GBP").
/// 
/// # Retorno
/// Retorna un `String` con el valor formateado en la moneda correspondiente o un mensaje de error si los parámetros no son válidos.
fn convertir_cents_a_moneda(centavos: i32, codigo_moneda: &str) -> String {
    // TODO: Si centavos es negativo, retorna "Valor invalido".

    // TODO: Utiliza un "match" para obtener el símbolo correspondiente según el código de moneda.
    // Si codigo_moneda no es "USD", "EUR" o "GBP", retorna "Codigo de moneda invalido".

    // TODO: Convierte centavos a unidades monetarias dividiendo por 100.
    // Recuerda convertir centavos a f64 para la división.

    // TODO: Formatea el valor resultante a dos decimales utilizando format!("{:.2}", valor).

    // TODO: Retorna un String que combine el símbolo obtenido con el valor formateado.
    unimplemented!()
}

fn main() {
    // Ejemplos de uso:
    let conversion = convertir_cents_a_moneda(-4000, "GBP");
    let conversion_dos = convertir_cents_a_moneda(1000, "EURR");
    let conversion_tres = convertir_cents_a_moneda(2000, "USD");

    println!("{}", conversion);        // Debe imprimir "Valor invalido"
    println!("{}", conversion_dos);     // Debe imprimir "Codigo de moneda invalido"
    println!("{}", conversion_tres);    // Debe imprimir "$20.00"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valor_invalido() {
        let resultado = convertir_cents_a_moneda(-100, "USD");
        assert_eq!(resultado, "Valor invalido");
    }

    #[test]
    fn test_codigo_moneda_invalido() {
        let resultado = convertir_cents_a_moneda(200, "ABC");
        assert_eq!(resultado, "Codigo de moneda invalido");
    }

    #[test]
    fn test_conversion_usd() {
        let resultado = convertir_cents_a_moneda(1234, "USD");
        assert_eq!(resultado, "$12.34");
    }

    #[test]
    fn test_conversion_eur() {
        let resultado = convertir_cents_a_moneda(50, "EUR");
        assert_eq!(resultado, "€0.50");
    }

    #[test]
    fn test_conversion_otro_ejemplo() {
        let resultado = convertir_cents_a_moneda(2000, "USD");
        assert_eq!(resultado, "$20.00");
    }
}
