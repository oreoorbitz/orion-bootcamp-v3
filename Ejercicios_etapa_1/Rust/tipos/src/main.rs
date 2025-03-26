fn main() {
    // 📌 Pruebas de la función con diferentes valores
    println!("{}", verificar_tipo(10.0));   // "Número entero: 10"
    println!("{}", verificar_tipo(3.14));   // "Número decimal: 3.14"
    println!("{}", verificar_tipo(42.5));   // "Número decimal: 42.5"
    println!("{}", verificar_tipo(42.0));   // "Número entero: 42"
}

/// 📌 Función que verifica si un número es entero o decimal.
/// - En Rust, el tipado es estricto, por lo que solo podemos aceptar `f64` (no cadenas u otros tipos).
/// - Si el número tiene parte decimal `!= 0.0`, se considera decimal.
/// - Si la parte decimal es `0.0`, se considera entero.
///
/// @param num: f64 - Número a evaluar
/// @return String - Mensaje indicando si el número es entero o decimal.
fn verificar_tipo(num: f64) -> String {
    
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_verificar_tipo() {
        assert_eq!(verificar_tipo(10.0), "Número entero: 10");
        assert_eq!(verificar_tipo(3.14), "Número decimal: 3.14");
        assert_eq!(verificar_tipo(42.0), "Número entero: 42");
        assert_eq!(verificar_tipo(42.5), "Número decimal: 42.5");
    }
}
