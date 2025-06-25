import { DatabaseSync } from "node:sqlite";

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
