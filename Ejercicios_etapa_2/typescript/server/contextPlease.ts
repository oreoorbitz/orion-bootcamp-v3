/*const coleccionesprueba=db.prepare('SELECT * FROM product_collections FULL JOIN products ON product_collections.productId=products.id FULL JOIN collections ON product_collections.collectionId=collections.id').all();
console.log(coleccionesprueba);*/
import { DatabaseSync } from "node:sqlite";
import { CollateCharsetOptions } from "sequelize";
const db = new DatabaseSync("data.db");

const products= db.prepare('SELECT * FROM products ORDER BY id').all();
const collections = db.prepare('SELECT * FROM collections ORDER BY id').all();
const coleccionesProductos=db.prepare('SELECT * FROM product_collections ORDER BY productId').all();

const collectionsUnidas = collections.map( collection => {
  //console.log(collection)
  const productosCollectionFiltrado = coleccionesProductos.filter( cp => collection.id === cp.collectionId )
  //console.log(productosDlaColeccion)
  const productoJuntos = productosCollectionFiltrado.map( pc => products.find(producto => producto.id === pc.productId ))
  //console.log(productoJuntos)
  return {
    ...collection,
    products: productoJuntos
  }
} )
console.log(collectionsUnidas)



export const context = {
settings:{
  titulo: "Rosita"
},
products,
collectionsUnidas
};
