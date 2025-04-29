// Este archivo toma nuestros modulos, data, y utilidades y los une para cumplir la funcionalidad intencionada de este proyecto. Los imports en este archivo estan faltando. En algunos de los archivos, faltan les faltan exports.

// importa el objecto products de product.js
import products from "./data/products.js";
// importa getProductHandlesAndIds
import getProductHandlesAndIds from "./modules/get-product-handles-and-ids.js";

const resultado = getProductHandlesAndIds(products)
console.log(resultado)
