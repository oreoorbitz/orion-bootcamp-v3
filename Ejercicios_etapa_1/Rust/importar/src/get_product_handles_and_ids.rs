// src/get_product_handles_and_ids.rs

// TODO: Importa `get_product_handles` y `get_product_ids` desde utils.rs

use crate::Product; // Importamos la estructura Product

pub fn get_product_handles_and_ids(products: &[Product]) -> Vec<(u32, String)> {
    let handles = get_product_handles(products);
    let ids = get_product_ids(products);

    ids.into_iter()
        .zip(handles.into_iter())
        .collect()
}
