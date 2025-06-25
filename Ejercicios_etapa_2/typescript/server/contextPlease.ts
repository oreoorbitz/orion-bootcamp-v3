import { DatabaseSync } from "node:sqlite";
import { seedProducts, seedCollections, seedProductCollections } from "../seedData.ts";

const db = new DatabaseSync("test.db");

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT,
    handle TEXT,
    precio INTEGER
  );
  
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY,
    title TEXT,
    handle TEXT
  );

  CREATE TABLE IF NOT EXISTS product_collections (
    productId INTEGER,
    collectionId INTEGER
  );
`);

// Insertar datos solo si la tabla está vacía
function isTableEmpty(tableName: string): boolean {
  const result = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
  return result.count === 0;
}

if (isTableEmpty("products")) {
  const stmt = db.prepare("INSERT INTO products (id, title, handle, precio) VALUES (?, ?, ?, ?)");
  for (const p of seedProducts) {
    stmt.run(p.id, p.title, p.handle, p.precio);
  }
}

if (isTableEmpty("collections")) {
  const stmt = db.prepare("INSERT INTO collections (id, title, handle) VALUES (?, ?, ?)");
  for (const c of seedCollections) {
    stmt.run(c.id, c.title, c.handle);
  }
}

if (isTableEmpty("product_collections")) {
  const stmt = db.prepare("INSERT INTO product_collections (productId, collectionId) VALUES (?, ?)");
  for (const pc of seedProductCollections) {
    stmt.run(pc.productId, pc.collectionId);
  }
}

// ✅ Verificar que los datos fueron insertados correctamente
console.log("🛍️ Productos:");
console.table(db.prepare("SELECT * FROM products").all());

console.log("🗂️ Colecciones:");
console.table(db.prepare("SELECT * FROM collections").all());

console.log("🔗 Relaciones producto/colección:");
console.table(db.prepare("SELECT * FROM product_collections").all());

export const context = {
  settings: {
    titulo: "Rosita",
  },
  // Este objeto se reemplazará más adelante por una consulta real
  products: seedProducts,
  collections: seedCollections,
  productCollections: seedProductCollections,
};
