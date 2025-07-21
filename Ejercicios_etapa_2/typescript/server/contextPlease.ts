import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data.db");

const products = db.prepare('SELECT * FROM products ORDER BY id').all();
const collectionss = db.prepare('SELECT * FROM collections ORDER BY id').all();
const collectionsProducts = db.prepare('SELECT * FROM product_collections ORDER BY productId').all();

type Producto = { id: number; title: string; handle: string; precio: number; [key: string]: any };
type Coleccion = { id: number; title: string; handle: string; [key: string]: any };
type Relacion = { productId: number; collectionId: number };

async function agruparProductos(
  productos: Producto[],
  colecciones: Coleccion[],
  relaciones: Relacion[]
): Promise<(Coleccion & { products: Producto[] })[] | undefined> {
  try {
    const resultado: (Coleccion & { products: Producto[] })[] = [];

    for (let i = 0; i < colecciones.length; i++) {
      const coleccion = { ...colecciones[i], products: [] as Producto[] };

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
  } catch (error) {
    console.log(error);
  }
}


function crearDrop<T extends { handle: string }>(items: T[]): any {
  const mapa = new Map<string, T>();
  for (const item of items) {
    mapa.set(item.handle, item);
  }

  const drop = new Proxy(mapa, {
    get(target, prop: string) {
      if (prop === 'isDrop') return true;
      if (typeof prop === 'string') {
        return target.get(prop) ?? "";
      }
      return undefined;
    },

    has(target, prop: string) {
      return target.has(prop as string);
    },

    ownKeys(target) {
      return Array.from(target.keys());
    },

    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      };
    }
  });

  return drop;
}

const coleccionesConProductos = await agruparProductos(products, collectionss, collectionsProducts);

export const context = {
  collections: crearDrop(coleccionesConProductos ?? []),
  all_products: crearDrop(products),
  header_menu_data:{
    section: {
      settings: {
        heading: "Menú principal",
        link_1_label: "Camisas suaves",
        link_1_url: "/collections/soft-shirts",
        link_2_label: "Camisa suave A",
        link_2_url: "/products/camisa-suave-a"
      }
    }
  },
};
