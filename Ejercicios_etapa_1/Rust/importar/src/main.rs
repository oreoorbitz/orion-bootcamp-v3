// src/main.rs

// TODO: Importa get_product_handles_and_ids desde get_product_handles_and_ids.rs
// TODO: Importa el módulo utils también

mod utils;
mod get_product_handles_and_ids;

use get_product_handles_and_ids::get_product_handles_and_ids;

#[derive(Debug)]
pub struct Product {
    pub id: u32,
    pub handle: String,
}

fn main() {
    let products = vec![
        Product { id: 42, handle: "simple-tee".to_string() },
        Product { id: 256, handle: "casual-tee".to_string() },
    ];

    let resultado = get_product_handles_and_ids(&products);

    println!("Resultado: {:?}", resultado);
}
