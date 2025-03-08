fn main() {
    // Llamamos a la función para probar su salida en la consola
    let resultado = edad_en_dias::edad_en_dias(26);
    println!("{}", resultado);
}

// Importamos la función del archivo lib.rs
mod edad_en_dias {
    pub fn edad_en_dias(anios: u32) -> u32 {
        0 // Stub: to be replaced
    }
}
