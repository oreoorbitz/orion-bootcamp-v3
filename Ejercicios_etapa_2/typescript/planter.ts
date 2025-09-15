import { DatabaseSync } from "node:sqlite";
import {
  products,
  collections,
  productCollections,
  productOptions,
  variants,
  collectionImages, // NEW
  productImages,    // NEW
  variantImages     // NEW
} from "./seedData.ts";

const db = new DatabaseSync("data.db");

// Create tables (idempotent)
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

  -- Options
  CREATE TABLE IF NOT EXISTS product_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS product_option_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    value TEXT NOT NULL
  );

  -- Variants
  CREATE TABLE IF NOT EXISTS variants (
    id INTEGER PRIMARY KEY,
    productId INTEGER NOT NULL,
    title TEXT NOT NULL,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    price INTEGER NOT NULL,
    sku TEXT,
    available INTEGER NOT NULL
  );

  -- IMAGES: featured image per collection
  CREATE TABLE IF NOT EXISTS collection_images (
    collectionId INTEGER PRIMARY KEY,
    small TEXT, medium TEXT, large TEXT,
    alt TEXT,
    width INTEGER, height INTEGER
  );

  -- IMAGES: product gallery (at least position=1 featured)
  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    small TEXT, medium TEXT, large TEXT,
    alt TEXT,
    width INTEGER, height INTEGER
  );

  -- IMAGES: exactly one image per variant
  CREATE TABLE IF NOT EXISTS variant_images (
    variantId INTEGER PRIMARY KEY,
    small TEXT, medium TEXT, large TEXT,
    alt TEXT,
    width INTEGER, height INTEGER
  );
`);

function isTableEmpty(table: string): boolean {
  const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
  return result.count === 0;
}

db.exec("BEGIN");

try {
  if (isTableEmpty("products")) {
    const stmt = db.prepare("INSERT INTO products (id, title, handle, price) VALUES (?, ?, ?, ?)");
    for (const p of products) stmt.run(p.id, p.title, p.handle, p.price);
    console.log("✅ Productos insertados");
  }

  if (isTableEmpty("collections")) {
    const stmt = db.prepare("INSERT INTO collections (id, title, handle) VALUES (?, ?, ?)");
    for (const c of collections) stmt.run(c.id, c.title, c.handle);
    console.log("✅ Colecciones insertadas");
  }

  if (isTableEmpty("product_collections")) {
    const stmt = db.prepare("INSERT INTO product_collections (productId, collectionId) VALUES (?, ?)");
    for (const pc of productCollections) stmt.run(pc.productId, pc.collectionId);
    console.log("✅ Relaciones producto/colección insertadas");
  }

  // Options + values
  if (Array.isArray(productOptions) && productOptions.length) {
    if (isTableEmpty("product_options")) {
      const insOpt = db.prepare("INSERT INTO product_options (productId, name, position) VALUES (?, ?, ?)");
      for (const opt of productOptions) insOpt.run(opt.productId, opt.name, opt.position);
      console.log("✅ Opciones de producto insertadas");
    }
    if (isTableEmpty("product_option_values")) {
      const insVal = db.prepare("INSERT INTO product_option_values (productId, position, value) VALUES (?, ?, ?)");
      for (const opt of productOptions) {
        if (Array.isArray(opt.values)) for (const v of opt.values) insVal.run(opt.productId, opt.position, v);
      }
      console.log("✅ Valores de opciones insertados");
    }
  }

  // Variants
  if (Array.isArray(variants) && variants.length && isTableEmpty("variants")) {
    const insVar = db.prepare(`
      INSERT INTO variants (id, productId, title, option1, option2, option3, price, sku, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const v of variants) {
      insVar.run(
        v.id, v.productId, v.title,
        v.option1 ?? null, v.option2 ?? null, v.option3 ?? null,
        v.price, v.sku ?? null, v.available
      );
    }
    console.log("✅ Variantes insertadas");
  }

  // IMAGES: collections (featured)
  if (Array.isArray(collectionImages) && collectionImages.length && isTableEmpty("collection_images")) {
    const ins = db.prepare(`
      INSERT INTO collection_images (collectionId, small, medium, large, alt, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const img of collectionImages) {
      ins.run(img.collectionId, img.small, img.medium, img.large, img.alt, img.width, img.height);
    }
    console.log("✅ Imágenes de colecciones insertadas");
  }

  // IMAGES: products
  if (Array.isArray(productImages) && productImages.length && isTableEmpty("product_images")) {
    const ins = db.prepare(`
      INSERT INTO product_images (productId, position, small, medium, large, alt, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const img of productImages) {
      ins.run(img.productId, img.position, img.small, img.medium, img.large, img.alt, img.width, img.height);
    }
    console.log("✅ Imágenes de productos insertadas");
  }

  // IMAGES: variants
  if (Array.isArray(variantImages) && variantImages.length && isTableEmpty("variant_images")) {
    const ins = db.prepare(`
      INSERT INTO variant_images (variantId, small, medium, large, alt, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const img of variantImages) {
      ins.run(img.variantId, img.small, img.medium, img.large, img.alt, img.width, img.height);
    }
    console.log("✅ Imágenes de variantes insertadas");
  }

  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  console.error("❌ Error al sembrar la base de datos:", err);
  throw err;
} finally {
  db.close();
}
