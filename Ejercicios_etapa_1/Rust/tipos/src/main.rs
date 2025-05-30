// main.rs
// EJERCICIO 4: TIPOS Y EXPRESIONES IF EN RUST
//
// Este ejercicio se centra en el manejo de tipos en Rust y en el uso de expresiones if.
// Se implementan funciones para determinar si un número es entero o decimal, verificar si un número es positivo,
// realizar una división segura y evaluar la longitud de un texto.
// Estos ejemplos ilustran cómo el tipado estático y las expresiones if en Rust difieren de los enfoques en lenguajes dinámicos.


fn main() {
    // Pruebas existentes:
    println!("{}", verificar_tipo(10.0));   // "Número entero: 10"
    println!("{}", verificar_tipo(3.14));   // "Número decimal: 3.14"
    println!("{}", verificar_tipo(42.5));   // "Número decimal: 42.5"
    println!("{}", verificar_tipo(42.0));   // "Número entero: 42"

    println!("¿3.14 es positivo? {}", es_positivo(3.14)); // true
    println!("¿ -1.0 es positivo? {}", es_positivo(-1.0)); // false

    match dividir_seguro(10.0, 2.0) {
        Ok(resultado) => println!("División segura: 10.0 / 2.0 = {}", resultado),
        Err(err) => println!("División segura: {}", err),
    }
    match dividir_seguro(10.0, 0.0) {
        Ok(resultado) => println!("División segura: 10.0 / 0.0 = {}", resultado),
        Err(err) => println!("División segura: {}", err),
    }

    println!("{}", evaluar_longitud("Ada"));      // "El texto 'Ada' es corto"
    println!("{}", evaluar_longitud("Lovelace")); // "El texto 'Lovelace' es largo"
}

/// Función que verifica si un número es entero o decimal.
/// Si la parte decimal es 0.0, se considera entero; de lo contrario, decimal.
fn verificar_tipo(num: f64) -> String {
    unimplemented!()
}

/// Función que verifica si un número es positivo.
/// Retorna true si el número es mayor que 0, de lo contrario, false.
fn es_positivo(num: f64) -> bool {
    unimplemented!()
}

/// Función que realiza una división segura.
/// Retorna un Result con el cociente si el divisor no es 0, o un mensaje de error en caso contrario.
fn dividir_seguro(dividendo: f64, divisor: f64) -> Result<f64, String> {
    unimplemented!()
}

/// Función que evalúa la longitud de un texto.
/// Retorna un mensaje indicando si el texto es "largo" (más de 5 caracteres) o "corto".
fn evaluar_longitud(texto: &str) -> String {
    unimplemented!()
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
    
    #[test]
    fn test_es_positivo() {
        assert_eq!(es_positivo(3.14), true);
        assert_eq!(es_positivo(-1.0), false);
        assert_eq!(es_positivo(0.0), false);
    }

    #[test]
    fn test_dividir_seguro() {
        assert_eq!(dividir_seguro(10.0, 2.0), Ok(5.0));
        assert_eq!(dividir_seguro(10.0, 0.0), Err("Error: divisor es cero".to_string()));
    }
    
    #[test]
    fn test_evaluar_longitud() {
        assert_eq!(evaluar_longitud("Ada"), "El texto 'Ada' es corto");
        assert_eq!(evaluar_longitud("Lovelace"), "El texto 'Lovelace' es largo");
    }
}
