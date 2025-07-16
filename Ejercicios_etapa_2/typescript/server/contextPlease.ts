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

// 🧩 CLASE DROP BASE
class Drop {
  isDrop = true;
  protected data: Record<string, any> = {};

  constructor(items: any[], handleKey: string = 'handle') {
    // Indexar los elementos por su handle
    for (const item of items) {
      if (item && item[handleKey]) {
        this.data[item[handleKey]] = item;
      }
    }
  }

  // Método para acceder por handle
  get(handle: string) {
    const result = this.data[handle];
    console.log(`🔍 Drop.get('${handle}') = ${result ? 'encontrado' : 'no encontrado'}`);
    return result || null;
  }

  // Método para verificar si existe un handle
  has(handle: string): boolean {
    return handle in this.data;
  }

  // Prevenir iteración directa
  [Symbol.iterator]() {
    return {
      next() {
        return { done: true, value: undefined };
      }
    };
  }
}

// 🧩 DROP ESPECÍFICO PARA PRODUCTOS
class ProductsDrop extends Drop {
  constructor(productos: Producto[]) {
    super(productos, 'handle');
    console.log('🏗️ ProductsDrop creado con handles:', Object.keys(this.data));
  }
}

// 🧩 DROP ESPECÍFICO PARA COLECCIONES
class CollectionsDrop extends Drop {
  constructor(colecciones: (Coleccion & { products: Producto[] })[]) {
    super(colecciones, 'handle');
    console.log('🏗️ CollectionsDrop creado con handles:', Object.keys(this.data));
  }
}

// Obtener las colecciones agrupadas
const collections = await agruparProductos(products, collectionss, collectionsProducts);

// 🎯 CREAR LOS DROPS
const productsDrop = new ProductsDrop(products);
const collectionsDrop = new CollectionsDrop(collections || []);

// 🎯 CORRECCIÓN: Usar 'all_products' en lugar de 'products' para coincidir con la plantilla
export const context = {
  settings: {
    titulo: "Rosita"
  },
  all_products: productsDrop,  // ✅ Cambio clave: usar 'all_products'
  collections: collectionsDrop
};

console.log('🎯 Contexto final creado:', {
  all_products: 'ProductsDrop',
  collections: 'CollectionsDrop'
});

// Debug: Verificar que los drops funcionan correctamente
console.log('🔍 Verificando drops:');
console.log('- all_products["camisa-suave-a"]:', productsDrop.get('camisa-suave-a'));
console.log('- collections["soft-shirts"]:', collectionsDrop.get('soft-shirts'));
