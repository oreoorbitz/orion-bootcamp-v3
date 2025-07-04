import { DatabaseSync } from "node:sqlite";
<<<<<<< HEAD

const normalizeObject = (obj: any) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value])
    );
};

const db = new DatabaseSync("data.db"); // ← use the same DB name as planter.ts

// Obtener productos
const products = db.prepare("SELECT id, title, handle, precio FROM products").all()
  .map((row) => ({ ...row }));

// Obtener colecciones
const collectionsRaw = db.prepare("SELECT id, title, handle FROM collections").all()
  .map((row) => ({ ...row }));

// Obtener relaciones producto-colección
const productCollections = db.prepare("SELECT productId, collectionId FROM product_collections").all()
  .map((row) => ({ ...row }));

// Asociar productos a colecciones
const collections = collectionsRaw.map((collection) => {
  const productosDeLaColeccion = productCollections
    .filter((pc) => pc.collectionId === collection.id)
    .map((pc) => products.find((p) => p.id === pc.productId))
    .filter(Boolean); // elimina posibles undefined si hay inconsistencias

  return {
    ...collection,
    products: productosDeLaColeccion,
  };
});

// Exportar el contexto
export const context = {
  settings: {
    titulo: "Rojito",
  },
  products,
  collections,
};
=======

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
>>>>>>> Paola
