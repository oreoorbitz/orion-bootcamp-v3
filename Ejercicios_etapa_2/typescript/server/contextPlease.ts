import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ruta correcta a la carpeta config dentro de server/themes/dev
const rutaConfig = path.resolve(__dirname, "themes/dev/config");

const db = new DatabaseSync("data.db");

// 🆕 CONSULTAS ACTUALIZADAS PARA INCLUIR VARIANTES Y OPCIONES
const products = db.prepare('SELECT * FROM products ORDER BY id').all();
const collectionss = db.prepare('SELECT * FROM collections ORDER BY id').all();
const collectionsProducts = db.prepare('SELECT * FROM product_collections ORDER BY productId').all();

// 🆕 NUEVAS CONSULTAS PARA VARIANTES Y OPCIONES
const variants = db.prepare('SELECT * FROM variants ORDER BY productId, id').all();
const productOptions = db.prepare('SELECT * FROM product_options ORDER BY productId, position').all();
const productOptionValues = db.prepare('SELECT * FROM product_option_values ORDER BY productId, position').all();

type Producto = { id: number; title: string; handle: string; precio: number; [key: string]: any };
type Coleccion = { id: number; title: string; handle: string; [key: string]: any };
type Relacion = { productId: number; collectionId: number };

// 🆕 NUEVOS TIPOS PARA VARIANTES Y OPCIONES
type Variante = {
  id: number;
  productId: number;
  title: string;
  option1?: string;
  option2?: string;
  option3?: string;
  price: number;
  sku?: string;
  available: number; // 0 o 1 en SQLite
};

type OpcionProducto = {
  id: number;
  productId: number;
  name: string;
  position: number;
};

type ValorOpcion = {
  id: number;
  productId: number;
  position: number;
  value: string;
};

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

// 🆕 FUNCIÓN NUEVA: Agrupar variantes por producto
function agruparVariantesPorProducto(variantes: Variante[]): Map<number, Variante[]> {
  const mapa = new Map<number, Variante[]>();

  for (const variante of variantes) {
    if (!mapa.has(variante.productId)) {
      mapa.set(variante.productId, []);
    }
    mapa.get(variante.productId)!.push({
      ...variante,
      available: Boolean(variante.available) // Convertir 0/1 a boolean
    });
  }

  return mapa;
}

// 🆕 FUNCIÓN NUEVA: Agrupar opciones por producto
function agruparOpcionesPorProducto(opciones: OpcionProducto[], valores: ValorOpcion[]): Map<number, any[]> {
  const mapa = new Map<number, any[]>();

  for (const opcion of opciones) {
    if (!mapa.has(opcion.productId)) {
      mapa.set(opcion.productId, []);
    }

    // Encontrar valores para esta opción
    const valoresOpcion = valores
      .filter(v => v.productId === opcion.productId && v.position === opcion.position)
      .map(v => v.value);

    mapa.get(opcion.productId)!.push({
      name: opcion.name,
      position: opcion.position,
      values: valoresOpcion
    });
  }

  // Ordenar opciones por posición
  for (const opciones of mapa.values()) {
    opciones.sort((a, b) => a.position - b.position);
  }

  return mapa;
}

// 🔧 FUNCIÓN ACTUALIZADA: Enriquecer productos con variantes y opciones
function enriquecerProductosConVariantes(
  productos: Producto[],
  variantesMap: Map<number, Variante[]>,
  opcionesMap: Map<number, any[]>
): Producto[] {
  return productos.map(producto => {
    const variantes = variantesMap.get(producto.id) || [];
    const opciones = opcionesMap.get(producto.id) || [];

    console.log(`🔍 Producto: ${producto.title} (ID: ${producto.id})`);
    console.log(`   📦 Variantes: ${variantes.length}`);
    console.log(`   ⚙️ Opciones: ${opciones.length}`);

    if (variantes.length > 0) {
      console.log(`   📋 Variantes detalle:`, variantes.map(v => `${v.title} ($${v.price/100}) disponible:${v.available}`));
    }

    return {
      ...producto,
      variants: variantes,
      options: opciones,
      // Para compatibilidad, mantener el precio del producto como el precio de la primera variante disponible
      price: variantes.find(v => v.available)?.price || producto.precio || 0
    };
  });
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

// 🔧 FUNCIÓN PRINCIPAL ACTUALIZADA: crearContexto con variantes y opciones
export async function crearContexto(cartToken?: string, cartsStorage?: Map<string, Cart>) {
  console.log("🚀 Iniciando creación de contexto con variantes...");

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

  // 🆕 PROCESAR VARIANTES Y OPCIONES
  console.log("📦 Procesando variantes...");
  const variantesMap = agruparVariantesPorProducto(variants as Variante[]);
  console.log(`✅ Variantes agrupadas para ${variantesMap.size} productos`);

  console.log("⚙️ Procesando opciones...");
  const opcionesMap = agruparOpcionesPorProducto(productOptions as OpcionProducto[], productOptionValues as ValorOpcion[]);
  console.log(`✅ Opciones agrupadas para ${opcionesMap.size} productos`);

  // 🔧 ENRIQUECER PRODUCTOS CON VARIANTES Y OPCIONES
  const productosEnriquecidos = enriquecerProductosConVariantes(products as Producto[], variantesMap, opcionesMap);
  console.log(`✅ ${productosEnriquecidos.length} productos enriquecidos con variantes`);

  const coleccionesConProductos = await agruparProductos(productosEnriquecidos, collectionss, collectionsProducts);
  const collecciones = crearDrop(coleccionesConProductos);
  const todosProductos = crearDrop(productosEnriquecidos);

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

  console.log("✅ Contexto creado exitosamente");
  return contexto;
}

// Para probar que funciona (comentado para evitar ejecución en import)
// const contexto = await crearContexto();
// console.log("🔍 Contexto completo:", contexto);
