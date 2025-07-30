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

// 🔧 FUNCIÓN CORREGIDA: crearDrop con mejor manejo del Proxy
function crearDrop<T extends { handle: string }>(items: T[]): any {
  const mapa = new Map<string, T>();
  for (const item of items) {
    mapa.set(item.handle, item);
  }

  return new Proxy(mapa, {
    get(target, prop: string | symbol) {
      // 🔧 Propiedades especiales del Drop
      if (prop === 'isDrop') return true;
      if (prop === Symbol.iterator) return target[Symbol.iterator].bind(target);
      if (prop === 'size') return target.size;
      if (prop === 'keys') return target.keys.bind(target);
      if (prop === 'values') return target.values.bind(target);
      if (prop === 'entries') return target.entries.bind(target);
      if (prop === 'forEach') return target.forEach.bind(target);
      if (prop === 'has') return target.has.bind(target);
      if (prop === 'get') return target.get.bind(target);

      // 🔧 Para console.log y debug
      if (prop === Symbol.toStringTag) return 'Drop';
      if (prop === 'constructor') return Map;

      // 🔧 Acceso a propiedades por string
      if (typeof prop === 'string') {
        const value = target.get(prop);
        console.log(`🔍 Drop: Accediendo a '${prop}', encontrado:`, value);
        return value; // 🎯 NO retornar "" si es undefined, retornar el valor real
      }

      return target[prop as keyof Map<string, T>];
    },

    has(target, prop: string | symbol) {
      if (prop === 'isDrop') return true;
      if (typeof prop === 'string') return target.has(prop);
      return prop in target;
    },

    ownKeys(target) {
      const keys = Array.from(target.keys());
      keys.push('isDrop');
      return keys;
    },

    getOwnPropertyDescriptor(target, prop) {
      if (prop === 'isDrop') {
        return {
          enumerable: true,
          configurable: true,
          value: true
        };
      }
      if (typeof prop === 'string' && target.has(prop)) {
        return {
          enumerable: true,
          configurable: true,
          value: target.get(prop)
        };
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    }
  });
}

export async function crearContexto() {
  const data = JSON.parse(fs.readFileSync(path.join(rutaConfig, "settings_data.json"), "utf-8"));
  const current = data.current;

  const sections = data.current.sections;
  const settings = {};

  for (const key in current) {
    const obj = current[key];
    if (key !== "sections") {
      settings[key] = current[key];
    }
  }

  const coleccionesConProductos = await agruparProductos(products, collectionss, collectionsProducts);
  const collecciones = crearDrop(coleccionesConProductos);
  const todosProductos = crearDrop(products);

  /* // 🔍 DEBUG: Verificar que los drops funcionan
  console.log("🔍 DEBUG: Testing drops...");
  console.log("🔍 collections.isDrop:", collecciones.isDrop);
  console.log("🔍 collections keys:", Array.from(collecciones.keys()));
  console.log("🔍 soft-shirts collection:", collecciones.get("soft-shirts"));
  console.log("🔍 soft-shirts direct access:", collecciones["soft-shirts"]);

  if (collecciones["soft-shirts"]) {
    console.log("🔍 soft-shirts products:", collecciones["soft-shirts"].products);
  } */

  const contexto = {
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

  /* // 🔍 DEBUG: Verificar el contexto final
  console.log("🔍 DEBUG: Contexto final:");
  console.log("- shop:", contexto.shop);
  console.log("- settings:", contexto.settings);
  console.log("- sections:", Object.keys(contexto.sections));
  console.log("- collections type:", typeof contexto.collections);
  console.log("- collections isDrop:", contexto.collections.isDrop); */

  return contexto;
}

//Para probar que funciona
const contexto = await crearContexto();
console.log("🔍 Contexto completo:", contexto);
