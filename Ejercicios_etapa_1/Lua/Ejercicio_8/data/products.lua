-- data/products.lua
-- Datos simulados de productos

-- TODO: exporta la tabla products

local products = {
    {
        id      = 42,
        handle  = "simple-tee",
        vendor  = "Velocity",
        title   = "Camiseta Simple",
        price   = 19.99,
        tags    = { "ropa", "camiseta", "oferta" }
    },
    {
        id      = 256,
        handle  = "casual-tee",
        vendor  = "Velocity",
        title   = "Camiseta Casual",
        price   = 19.99,
        tags    = { "ropa", "camiseta" }
    }
}

-- Aquí debe ir el return de products
return {
  products
}
