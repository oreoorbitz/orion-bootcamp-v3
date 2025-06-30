import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data.db");

const products= db.prepare('SELECT * FROM products ORDER BY id').all();

const collectionss = db.prepare('SELECT * FROM collections ORDER BY id').all();

const collectionsProducts=db.prepare('SELECT * FROM product_collections ORDER BY productId').all();

type Producto = { id: number; title: string; handle:string; precio: number; [key: string]: any };
type Coleccion = { id: number; title: string; handle:string; [key: string]: any };
type Relacion = { productId: number; collectionId: number };

async function agruparProductos (
  productos: Producto[],
  colecciones: Coleccion[],
  relaciones: Relacion[]
): Promise <(Coleccion & { products: Producto[] })[]|undefined> {
 try{
  const resultado: (Coleccion & { products: Producto[] })[] = [];

  for (let i = 0; i < colecciones.length; i++) {
    const coleccion = { ...colecciones[i] };
    coleccion.products = [];

    for (let j = 0; j < relaciones.length; j++) {
      if (relaciones[j].collectionId === coleccion.id) {
        for (let k = 0; k < productos.length; k++) {
          if (productos[k].id === relaciones[j].productId) {
            coleccion.products.push(productos[k]);
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

const collections= (await agruparProductos(products, collectionss, collectionsProducts));

export const context = {
settings:{
  titulo: "Rosita"
},
products,
collections
};
//console.log(context)
/*OTRA FORMA DE HACERLO
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
console.log(collectionsUnidas)*/
