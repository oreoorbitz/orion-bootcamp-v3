import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ruta correcta a la carpeta config dentro de server/themes/dev
const rutaConfig = path.resolve(__dirname, "themes/dev/config");

const db = new DatabaseSync("data.db");

// 🆕 CONSULTAS ACTUALIZADAS PARA INCLUIR VARIANTES, OPCIONES E IMÁGENES
const products = db.prepare('SELECT * FROM products ORDER BY id').all();
const collectionss = db.prepare('SELECT * FROM collections ORDER BY id').all();
const collectionsProducts = db.prepare('SELECT * FROM product_collections ORDER BY productId').all();

// 🆕 CONSULTAS PARA VARIANTES Y OPCIONES
const variants = db.prepare('SELECT * FROM variants ORDER BY productId, id').all();
const productOptions = db.prepare('SELECT * FROM product_options ORDER BY productId, position').all();
const productOptionValues = db.prepare('SELECT * FROM product_option_values ORDER BY productId, position').all();

// 🖼️ NUEVAS CONSULTAS PARA IMÁGENES
const collectionImages = db.prepare('SELECT * FROM collection_images ORDER BY collectionId').all();
const productImages = db.prepare('SELECT * FROM product_images ORDER BY productId, position').all();
const variantImages = db.prepare('SELECT * FROM variant_images ORDER BY variantId').all();

type Producto = { id: number; title: string; handle: string; precio: number; [key: string]: any };
type Coleccion = { id: number; title: string; handle: string; [key: string]: any };
type Relacion = { productId: number; collectionId: number };

// Interfaces
interface ImageObject {
  small: string;
  medium: string;
  large: string;
  alt: string;
  width: number;
  height: number;
}

interface CollectionImage {
  id: number;
  collectionId: number;
  small: string;
  medium: string;
  large: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductImage {
  id: number;
  productId: number;
  position: number;
  small: string;
  medium: string;
  large: string;
  alt: string;
  width: number;
  height: number;
}

interface VariantImage {
  id: number;
  variantId: number;
  small: string;
  medium: string;
  large: string;
  alt: string;
  width: number;
  height: number;
}

// 🛒 TIPOS ACTUALIZADOS PARA EL CARRITO CON PROPERTIES, ATTRIBUTES E IMÁGENES
interface CartItem {
    id: number; // ✨ Usar solo 'id' para consistencia (variant_id)
    title: string;
    handle: string;
    price: number;
    quantity: number;
    properties?: { [k: string]: string }; // ✨ Properties por línea
    image?: ImageObject; // 🖼️ NUEVO: Imagen de la variante en el carrito
}

interface Cart {
    items: CartItem[];
    attributes?: { [k: string]: string }; // ✨ Attributes globales del carrito
}

interface LiquidCart {
    token: string;
    items: CartItem[];
    attributes?: { [k: string]: string }; // ✨ Attributes en respuesta Liquid
    item_count: number;
    total_price: number;
}

// Tipos
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
  image?: ImageObject; // 🖼️ NUEVO: Imagen de la variante
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

type Drop<T extends { handle: string }> = {
  isDrop: true;
  size: number;
  get(key: string): T | undefined;
  has(key: string): boolean;
  keys(): IterableIterator<string>;
  values(): IterableIterator<T>;
  entries(): IterableIterator<[string, T]>;
  forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void): void;
  [Symbol.iterator](): IterableIterator<[string, T]>;
} & {
  [K in T['handle']]: T extends { handle: K } ? T : never;
}



// 🖼️ NUEVA FUNCIÓN: Agrupar imágenes de colecciones
function agruparImagenesColecciones(imagenes: CollectionImage[]): Map<number, ImageObject> {
  const mapa = new Map<number, ImageObject>();

  for (const img of imagenes) {
    const imageObject: ImageObject = {
      small: img.small,
      medium: img.medium,
      large: img.large,
      alt: img.alt,
      width: img.width,
      height: img.height
    };
    mapa.set(img.collectionId, imageObject);
  }

  return mapa;
}

// 🖼️ NUEVA FUNCIÓN: Agrupar imágenes de productos (imagen destacada = position 1)
function agruparImagenesProductos(imagenes: ProductImage[]): Map<number, ImageObject> {
  const mapa = new Map<number, ImageObject>();

  for (const img of imagenes) {
    // Solo tomar la imagen con position = 1 (imagen destacada)
    if (img.position === 1) {
      const imageObject: ImageObject = {
        small: img.small,
        medium: img.medium,
        large: img.large,
        alt: img.alt,
        width: img.width,
        height: img.height
      };
      mapa.set(img.productId, imageObject);
    }
  }

  return mapa;
}

// 🖼️ NUEVA FUNCIÓN: Agrupar imágenes de variantes
function agruparImagenesVariantes(imagenes: VariantImage[]): Map<number, ImageObject> {
  const mapa = new Map<number, ImageObject>();

  for (const img of imagenes) {
    const imageObject: ImageObject = {
      small: img.small,
      medium: img.medium,
      large: img.large,
      alt: img.alt,
      width: img.width,
      height: img.height
    };
    mapa.set(img.variantId, imageObject);
  }

  return mapa;
}

// 🆕 FUNCIÓN ACTUALIZADA: Agrupar variantes por producto CON IMÁGENES
function agruparVariantesPorProducto(
  variantes: Variante[],
  imagenesVariantes: Map<number, ImageObject>
): Map<number, Variante[]> {
  const mapa = new Map<number, Variante[]>();

  for (const variante of variantes) {
    if (!mapa.has(variante.productId)) {
      mapa.set(variante.productId, []);
    }

    // 🖼️ Agregar imagen de la variante si existe
    const imagen = imagenesVariantes.get(variante.id);

    mapa.get(variante.productId)!.push({
      ...variante,
      available: Boolean(variante.available), // Convertir 0/1 a boolean
      image: imagen // 🖼️ NUEVO: Incluir imagen de la variante
    });
  }

  return mapa;
}

// 🆕 FUNCIÓN ACTUALIZADA: Agrupar opciones por producto (sin cambios)
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

// 🔧 FUNCIÓN ACTUALIZADA: Enriquecer productos con variantes, opciones E IMÁGENES
function enriquecerProductosConVariantes(
  productos: Producto[],
  variantesMap: Map<number, Variante[]>,
  opcionesMap: Map<number, any[]>,
  imagenesProductos: Map<number, ImageObject>
): Producto[] {
  return productos.map(producto => {
    const variantes = variantesMap.get(producto.id) || [];
    const opciones = opcionesMap.get(producto.id) || [];
    const imagen = imagenesProductos.get(producto.id); // 🖼️ NUEVO: Imagen del producto

    console.log(`🔍 Producto: ${producto.title} (ID: ${producto.id})`);
    console.log(`   📦 Variantes: ${variantes.length}`);
    console.log(`   ⚙️ Opciones: ${opciones.length}`);
    console.log(`   🖼️ Imagen: ${imagen ? 'Sí' : 'No'}`);

    if (variantes.length > 0) {
      console.log(`   📋 Variantes detalle:`, variantes.map(v =>
        `${v.title} ($${v.price/100}) disponible:${v.available} imagen:${v.image ? 'Sí' : 'No'}`
      ));
    }

    return {
      ...producto,
      variants: variantes,
      options: opciones,
      image: imagen, // 🖼️ NUEVO: Imagen destacada del producto
      // Para compatibilidad, mantener el precio del producto como el precio de la primera variante disponible
      price: variantes.find(v => v.available)?.price || producto.precio || 0
    };
  });
}

// 🔧 FUNCIÓN ACTUALIZADA: Enriquecer colecciones CON IMÁGENES
function enriquecerColeccionesConImagenes(
  colecciones: Coleccion[],
  imagenesColecciones: Map<number, ImageObject>
): Coleccion[] {
  return colecciones.map(coleccion => {
    const imagen = imagenesColecciones.get(coleccion.id);

    console.log(`🏷️ Colección: ${coleccion.title} (ID: ${coleccion.id}) imagen: ${imagen ? 'Sí' : 'No'}`);

    return {
      ...coleccion,
      image: imagen // 🖼️ NUEVO: Imagen de la colección
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

// 🔧 FUNCIÓN CORREGIDA: crearDrop con mejor manejo del Proxy (sin cambios)
function crearDrop<T extends { handle: string }>(items: T[]): Drop<T> {
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
  })  as unknown as Drop<T>;
}

// ✨ FUNCIÓN ACTUALIZADA: buildLiquidCart ahora incluye properties, attributes E IMÁGENES
function buildLiquidCart(
  token: string,
  cart: Cart,
  imagenesVariantes: Map<number, ImageObject>
): LiquidCart {
    const item_count = cart.items.reduce((total, item) => total + item.quantity, 0);
    const total_price = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // 🖼️ NUEVO: Enriquecer items del carrito con imágenes de variantes
    const itemsConImagenes = cart.items.map(item => {
      const imagen = imagenesVariantes.get(item.id); // item.id es el variant_id
      return {
        ...item,
        image: imagen // 🖼️ Agregar imagen de la variante al line item
      };
    });

    return {
        token,
        items: itemsConImagenes, // 🖼️ Items ahora incluyen imágenes
        attributes: cart.attributes || {},
        item_count,
        total_price
    };
}

// 🔧 FUNCIÓN PRINCIPAL ACTUALIZADA: crearContexto con variantes, opciones E IMÁGENES
export async function crearContexto(cartToken?: string, cartsStorage?: Map<string, Cart>) {
  console.log("🚀 Iniciando creación de contexto con variantes e imágenes...");

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

  // 🖼️ PROCESAR IMÁGENES PRIMERO
  console.log("🖼️ Procesando imágenes...");
  const imagenesColeccionesMap = agruparImagenesColecciones(collectionImages as CollectionImage[]);
  const imagenesProductosMap = agruparImagenesProductos(productImages as ProductImage[]);
  const imagenesVariantesMap = agruparImagenesVariantes(variantImages as VariantImage[]);
  console.log(`✅ Imágenes procesadas: ${imagenesColeccionesMap.size} colecciones, ${imagenesProductosMap.size} productos, ${imagenesVariantesMap.size} variantes`);

  // 🆕 PROCESAR VARIANTES Y OPCIONES CON IMÁGENES
  console.log("📦 Procesando variantes...");
  const variantesMap = agruparVariantesPorProducto(variants as Variante[], imagenesVariantesMap);
  console.log(`✅ Variantes agrupadas para ${variantesMap.size} productos`);

  console.log("⚙️ Procesando opciones...");
  const opcionesMap = agruparOpcionesPorProducto(productOptions as OpcionProducto[], productOptionValues as ValorOpcion[]);
  console.log(`✅ Opciones agrupadas para ${opcionesMap.size} productos`);

  // 🔧 ENRIQUECER COLECCIONES CON IMÁGENES
  const coleccionesEnriquecidas = enriquecerColeccionesConImagenes(collectionss as Coleccion[], imagenesColeccionesMap);
  console.log(`✅ ${coleccionesEnriquecidas.length} colecciones enriquecidas con imágenes`);

  // 🔧 ENRIQUECER PRODUCTOS CON VARIANTES, OPCIONES E IMÁGENES
  const productosEnriquecidos = enriquecerProductosConVariantes(
    products as Producto[],
    variantesMap,
    opcionesMap,
    imagenesProductosMap
  );
  console.log(`✅ ${productosEnriquecidos.length} productos enriquecidos con variantes e imágenes`);

  const coleccionesConProductos = await agruparProductos(productosEnriquecidos, coleccionesEnriquecidas, collectionsProducts);
  const collecciones = crearDrop(coleccionesConProductos);
  const todosProductos = crearDrop(productosEnriquecidos);

  // ✨ CONSTRUIR EL OBJETO CART PARA LIQUID CON PROPERTIES, ATTRIBUTES E IMÁGENES
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
    cart = buildLiquidCart(cartToken, cartFromStorage, imagenesVariantesMap); // 🖼️ Pasar imágenes de variantes

    console.log(`🛒 Carrito cargado en contexto: ${cart.item_count} items, total: $${cart.total_price}`);

    // 🏷️ Log adicional para properties, attributes e imágenes
    const itemsWithProperties = cart.items.filter(item => item.properties && Object.keys(item.properties).length > 0);
    if (itemsWithProperties.length > 0) {
      console.log(`🏷️ Items con properties: ${itemsWithProperties.length}`);
    }

    const itemsWithImages = cart.items.filter(item => item.image);
    if (itemsWithImages.length > 0) {
      console.log(`🖼️ Items con imágenes: ${itemsWithImages.length}`);
    }

    if (cart.attributes && Object.keys(cart.attributes).length > 0) {
      console.log(`🏷️ Cart attributes:`, Object.keys(cart.attributes));
    }
  }

  const contexto = {
    collections: collecciones, // 🖼️ Ahora incluyen imágenes
    all_products: todosProductos, // 🖼️ Ahora incluyen imágenes y variantes con imágenes
    cart: cart, // 🛒 CARRITO AHORA INCLUYE PROPERTIES, ATTRIBUTES E IMÁGENES
    Mockify: {
      locale: "es"
    },
    shop: {
       name: "Mi tienda"
    },
    sections,
    settings,
  };

  console.log("✅ Contexto creado exitosamente con imágenes");
  return contexto;
}

// Para probar que funciona (comentado para evitar ejecución en import)
// const contexto = await crearContexto();
// console.log("🔍 Contexto completo:", contexto);
