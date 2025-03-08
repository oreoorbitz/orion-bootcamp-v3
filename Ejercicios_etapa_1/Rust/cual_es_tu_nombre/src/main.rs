fn main() {
    // Llamamos a la función para ver su salida en la consola
    let saludo = cual_es_tu_nombre("Pao", "Persona");
    println!("{}", saludo);
}

/// Genera un saludo utilizando el nombre de una persona.
/// Debe devolver "Hola, <primerNombre> <apellido>!" (con exclamación final).
///
/// # Ejemplo
/// Para "Juan" y "Pérez", se espera "Hola Juan Pérez!"
fn cual_es_tu_nombre(primer_nombre: &str, apellido: &str) -> String {
    "".to_string() // TODO: Reemplazar con la implementación correcta
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_juan_perez() {
        // Espera "Hola Juan Pérez!"
        assert_eq!(cual_es_tu_nombre("Juan", "Pérez"), "Hola Juan Pérez!");
    }

    #[test]
    fn test_ana_gomez() {
        // Espera "Hola Ana Gómez!"
        assert_eq!(cual_es_tu_nombre("Ana", "Gómez"), "Hola Ana Gómez!");
    }
}
