import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ruta correcta a la carpeta config dentro de server/themes/dev
const rutaConfig = path.resolve(__dirname, "themes/dev/config");

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
): Promise<(Coleccion & { products: Producto[] })[]> {
  const resultado: (Coleccion & { products: Producto[] })[] = [];

  for (const coleccion of colecciones) {
    const agrupada = { ...coleccion, products: [] as Producto[] };

    for (const relacion of relaciones) {
      if (relacion.collectionId === coleccion.id) {
        const producto = productos.find(p => p.id === relacion.productId);
        if (producto) agrupada.products.push(producto);
      }
    }

    resultado.push(agrupada);
  }

  return resultado;
}

function crearDrop<T extends { handle: string }>(items: T[]): any {
  const mapa = new Map<string, T>();
  for (const item of items) {
    mapa.set(item.handle, item);
  }

  return new Proxy(mapa, {
    get(target, prop: string) {
      if (prop === 'isDrop') return true;
      if (typeof prop === 'string') return target.get(prop) ?? "";
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
}

export async function crearContexto() {
  const data = JSON.parse(fs.readFileSync(path.join(rutaConfig, "settings_data.json"), "utf-8"));
  const current = data.current
  //console.log(current)

  const sections = data.current.sections
  //console.log(sections)
  const settings={}

  for (const key in current) {
    const obj = current[key]
    if (key !== "sections") {
      settings[key] = current[key]
    }
  }

  const coleccionesConProductos = await agruparProductos(products, collectionss, collectionsProducts);
  const collecciones = crearDrop(coleccionesConProductos);
  const todosProductos = crearDrop(products);

  return {
    collections: collecciones,
    all_products: todosProductos,
    Mockify: {
      locale: "es"
    },
    shop: {
       name: "Mi tienda"
    },
    sections,
    settings,
  };
}

//Para probar que funciona
const contexto = await crearContexto();
console.log(contexto)
