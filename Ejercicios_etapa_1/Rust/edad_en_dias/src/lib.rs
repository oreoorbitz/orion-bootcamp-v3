/// Calcula la edad en días dada una cantidad de años.
/// No se permite usar objetos Date.
/// Fórmula: años * 365 (ignoramos años bisiestos)
///
/// # Ejemplos
///
/// ```
/// assert_eq!(edad_en_dias(1), 365);
/// assert_eq!(edad_en_dias(0), 0);
/// assert_eq!(edad_en_dias(10), 3650);
/// ```
pub fn edad_en_dias(anios: u32) -> u32 {
    0 // Reemplazar por la implementación correcta
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_edad_en_dias_1_anio() {
        assert_eq!(edad_en_dias(1), 365);
    }

    #[test]
    fn test_edad_en_dias_0_anios() {
        assert_eq!(edad_en_dias(0), 0);
    }

    #[test]
    fn test_edad_en_dias_10_anios() {
        assert_eq!(edad_en_dias(10), 3650);
    }

    #[test]
    fn test_edad_en_dias_26_anios() {
        assert_eq!(edad_en_dias(26), 9490);
    }
}
