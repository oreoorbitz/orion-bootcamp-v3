/*const coleccionesprueba=db.prepare('SELECT * FROM product_collections FULL JOIN products ON product_collections.productId=products.id FULL JOIN collections ON product_collections.collectionId=collections.id').all();
console.log(coleccionesprueba);*/
import { DatabaseSync } from "node:sqlite";
import { CollateCharsetOptions } from "sequelize";
const db = new DatabaseSync("data.db");

const products= db.prepare('SELECT * FROM products ORDER BY id').all();
//console.log(products)
//console.log(products[0].id)
//console.log(products[1].id)
//console.log(products[2].id)
const collections = db.prepare('SELECT * FROM collections ORDER BY id').all();
//console.log(collections)
//console.log(collections[0].id)
//console.log(collections[1].id)
const collectionsProducts=db.prepare('SELECT * FROM product_collections ORDER BY productId').all();
//console.log(coleccionesProductos)
//console.log(coleccionesProductos[0].productId)
//console.log(coleccionesProductos[1].productId)
//console.log(coleccionesProductos[2].productId)
type Producto = { id: number; title: string; handle:string; precio: number; [key: string]: any };
type Coleccion = { id: number; title: string; handle:string; [key: string]: any };
type Relacion = { productId: number; collectionId: number };

async function agruparProductos (
  productos: Producto[],
  colecciones: Coleccion[],
  relaciones: Relacion[]
): Promise <(Coleccion & { productos: Producto[] })[]> {
 try{
  const resultado: (Coleccion & { productos: Producto[] })[] = [];

  for (let i = 0; i < colecciones.length; i++) {
    const coleccion = { ...colecciones[i] };
    coleccion.productos = [];

    for (let j = 0; j < relaciones.length; j++) {
      if (relaciones[j].collectionId === coleccion.id) {
        for (let k = 0; k < productos.length; k++) {
          if (productos[k].id === relaciones[j].productId) {
            coleccion.productos.push(productos[k]);
          }
        }
      }
    }

    resultado.push(coleccion);
  }

  return resultado;
}  catch(error) {
  console.log(error)
 }
}

console.log(await agruparProductos(products, collections, collectionsProducts));

/*const collectionsUnidas = collections.map( collection => {
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
};*/
