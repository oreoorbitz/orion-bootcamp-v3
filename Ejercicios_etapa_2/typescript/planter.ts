import { DatabaseSync } from "node:sqlite";
import { products, collections, productCollections } from "./seedData.ts";

const db = new DatabaseSync("data.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT,
    handle TEXT,
    price INTEGER
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

function isTableEmpty(table: string): boolean {
  const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
  return result.count === 0;
}

if (isTableEmpty("products")) {
  const stmt = db.prepare("INSERT INTO products (id, title, handle, price) VALUES (?, ?, ?, ?)");
  for (const p of products) {
    stmt.run(p.id, p.title, p.handle, p.price);
  }
  console.log("✅ Productos insertados");
}

if (isTableEmpty("collections")) {
  const stmt = db.prepare("INSERT INTO collections (id, title, handle) VALUES (?, ?, ?)");
  for (const c of collections) {
    stmt.run(c.id, c.title, c.handle);
  }
  console.log("✅ Colecciones insertadas");
}

if (isTableEmpty("product_collections")) {
  const stmt = db.prepare("INSERT INTO product_collections (productId, collectionId) VALUES (?, ?)");
  for (const pc of productCollections) {
    stmt.run(pc.productId, pc.collectionId);
  }
  console.log("✅ Relaciones producto/colección insertadas");
}

db.close();
