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

// 🛒 TIPOS ACTUALIZADOS PARA EL CARRITO CON PROPERTIES Y ATTRIBUTES
interface CartItem {
    id: number; // ✨ Usar solo 'id' para consistencia
    title: string;
    handle: string;
    price: number;
    quantity: number;
    properties?: { [k: string]: string }; // ✨ NUEVO: Properties por línea
}

interface Cart {
    items: CartItem[];
    attributes?: { [k: string]: string }; // ✨ NUEVO: Attributes globales del carrito
}

interface LiquidCart {
    token: string;
    items: CartItem[];
    attributes?: { [k: string]: string }; // ✨ NUEVO: Attributes en respuesta Liquid
    item_count: number;
    total_price: number;
}

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

// ✨ FUNCIÓN ACTUALIZADA: buildLiquidCart ahora incluye properties y attributes
function buildLiquidCart(token: string, cart: Cart): LiquidCart {
    const item_count = cart.items.reduce((total, item) => total + item.quantity, 0);
    const total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return {
        token,
        items: cart.items, // Ya incluyen properties si las tienen
        attributes: cart.attributes || {}, // ✨ NUEVO: Incluir attributes del carrito
        item_count,
        total_price
    };
}

// 🛒 FUNCIÓN MODIFICADA: crearContexto ahora recibe cartToken y cartsStorage
export async function crearContexto(cartToken?: string, cartsStorage?: Map<string, Cart>) {
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

  // ✨ CONSTRUIR EL OBJETO CART PARA LIQUID CON PROPERTIES Y ATTRIBUTES
  let cart: LiquidCart = {
    token: cartToken || '',
    items: [],
    attributes: {}, // ✨ Inicializar attributes vacíos
    item_count: 0,
    total_price: 0
  };

  // Si tenemos token y storage, obtener el carrito real
  if (cartToken && cartsStorage) {
    if (!cartsStorage.has(cartToken)) {
      cartsStorage.set(cartToken, { items: [], attributes: {} }); // ✨ Incluir attributes por defecto
    }
    const cartFromStorage = cartsStorage.get(cartToken)!;
    cart = buildLiquidCart(cartToken, cartFromStorage);

    console.log(`🛒 Carrito cargado en contexto: ${cart.item_count} items, total: $${cart.total_price}`);

    // 🏷️ Log adicional para properties y attributes si existen
    const itemsWithProperties = cart.items.filter(item => item.properties && Object.keys(item.properties).length > 0);
    if (itemsWithProperties.length > 0) {
      console.log(`🏷️ Items con properties: ${itemsWithProperties.length}`);
    }

    if (cart.attributes && Object.keys(cart.attributes).length > 0) {
      console.log(`🏷️ Cart attributes:`, Object.keys(cart.attributes));
    }
  }

  const contexto = {
    collections: collecciones,
    all_products: todosProductos,
    cart: cart, // 🛒 CARRITO AHORA INCLUYE PROPERTIES Y ATTRIBUTES
    Mockify: {
      locale: "es"
    },
    shop: {
       name: "Mi tienda"
    },
    sections,
    settings,
  };

  return contexto;
}

//Para probar que funciona (comentado para evitar ejecución en import)
// const contexto = await crearContexto();
// console.log("🔍 Contexto completo:", contexto);
