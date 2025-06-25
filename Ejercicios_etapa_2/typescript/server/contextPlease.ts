import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("data.db");

const productos= db.prepare('SELECT * FROM products ORDER BY id').all();
const colecciones= db.prepare('SELECT * FROM collections ORDER BY id').all();
const coleccionesProductos=db.prepare('SELECT * FROM product_collections ORDER BY productId').all();
console.log(typeof productos, productos);
console.log(typeof colecciones, colecciones);
console.log (typeof coleccionesProductos, coleccionesProductos);

/*const organizar = arr =>{
  let suave = [];
  let promociones =[];
  //Recorremos
  for (let i= 0; i <arr.length ; i++ ) {
    let contenido = arr[i];
    if (typeof(contenido) === 'string') {
      strings.push(contenido)
    } else if (typeof(contenido) === 'number') {
      numbers.push(contenido)
    }
  }
}

/* const organizarPorTipo = (arr) => {
    // TODO: Declara dos arrays, uno para strings y otro para numbers.
  let strings = [];
  let numbers = [];
    // TODO: Recorre el array de entrada y clasifica cada elemento en el array correspondiente.
  for (let i= 0; i <arr.length ; i++ ) {
    let contenido = arr[i];
    if (typeof(contenido) === 'string') {
      strings.push(contenido)
    } else if (typeof(contenido) === 'number') {
      numbers.push(contenido)
    }
  }
    // TODO: Retorna un objeto con las propiedades 'strings' y 'numbers' conteniendo los arrays correspondientes.
    return {strings, numbers}; // Reemplazar por la implementación correcta.
};

/* export const context = {
settings:{
  titulo: "Rosita"
},
products,
collections,
productCollections
}; */
