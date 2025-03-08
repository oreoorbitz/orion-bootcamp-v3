fn main() {
    // Llamamos a la función "generar_saludo" dentro del módulo "cual_es_tu_nombre"
    let saludo = cual_es_tu_nombre::generar_saludo("Pao", "Persona");
    println!("{}", saludo);
}

mod cual_es_tu_nombre {
    /// Genera un saludo utilizando el nombre de una persona.
    /// Debe devolver "Hola, <primerNombre> <apellido>!" (incluyendo la exclamación).
    ///
    /// # Ejemplo
    /// ```
    /// // Espera "Hola Juan Pérez!"
    /// // generar_saludo("Juan", "Pérez");
    /// ```
    pub fn generar_saludo(primer_nombre: &str, apellido: &str) -> String {
        "".to_string() // TODO: Reemplazar con la implementación correcta
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_juan_perez() {
        // Llamamos a "generar_saludo" a través del módulo "cual_es_tu_nombre"
        assert_eq!(
            cual_es_tu_nombre::generar_saludo("Juan", "Pérez"),
            "Hola Juan Pérez!"
        );
    }

    #[test]
    fn test_ana_gomez() {
        assert_eq!(
            cual_es_tu_nombre::generar_saludo("Ana", "Gómez"),
            "Hola Ana Gómez!"
        );
    }
}
