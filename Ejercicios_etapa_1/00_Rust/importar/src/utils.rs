// src/utils.rs

// Esta función extrae los handles de los productos.
pub fn get_product_handles(products: &[Product]) -> Vec<String> {
    products.iter().map(|p| p.handle.clone()).collect()
}

// Esta función extrae los ids de los productos.
pub fn get_product_ids(products: &[Product]) -> Vec<u32> {
    products.iter().map(|p| p.id).collect()
}
