// EJERCICIO DE MÚLTIPLES FUNCIONES EN RUST
//
// Instrucciones:
// 1. Crea una función llamada `doble` que reciba un número y retorne el doble de ese número.
// 2. Crea una función llamada `triple` que reciba un número y retorne el triple de ese número.
// 3. Crea una función llamada `doble_mas_triple` que reciba un número y:
//    - Use las funciones `doble` y `triple`
//    - Retorne la suma del doble y el triple de ese número.
//
// Ejemplos:
// - doble(2) => 4
// - triple(3) => 9
// - doble_mas_triple(2) => 4 + 6 = 10

/// Función que devuelve el doble de un número
fn doble(numero: i32) -> i32 {
    numero * 2 // TODO: Reemplazar con la implementación correcta
}

/// Función que devuelve el triple de un número
fn triple(numero: i32) -> i32 {
   numero * 3  // TODO: Reemplazar con la implementación correcta
}

/// Función que devuelve la suma del doble y el triple de un número
fn doble_mas_triple(numero: i32) -> i32 {
    doble(numero) + triple(numero)  // TODO: Reemplazar con la implementación correcta
}

fn main() {
    let numero = 2;
    println!("doble({}) = {}", numero, doble(numero));
    println!("triple({}) = {}", numero, triple(numero));
    println!("doble_mas_triple({}) = {}", numero, doble_mas_triple(numero));
}

/// PRUEBAS UNITARIAS
/// Para ejecutar las pruebas, usa el comando:
/// ```sh
/// cargo test
/// ```
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_doble() {
        assert_eq!(doble(2), 4);
        assert_eq!(doble(5), 10);
        assert_eq!(doble(-3), -6);
        assert_eq!(doble(0), 0);
    }

    #[test]
    fn test_triple() {
        assert_eq!(triple(3), 9);
        assert_eq!(triple(4), 12);
        assert_eq!(triple(-2), -6);
        assert_eq!(triple(0), 0);
    }

    #[test]
    fn test_doble_mas_triple() {
        assert_eq!(doble_mas_triple(2), 10); // 4 + 6 = 10
        assert_eq!(doble_mas_triple(5), 25); // 10 + 15 = 25
        assert_eq!(doble_mas_triple(-3), -15); // -6 + -9 = -15
        assert_eq!(doble_mas_triple(0), 0); // 0 + 0 = 0
    }
}
