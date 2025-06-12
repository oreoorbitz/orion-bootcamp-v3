import { drizzle } from "https://deno.land/x/drizzle_orm@0.30.7/mod.ts";
import { sqliteTable, integer, text } from "https://deno.land/x/drizzle_orm@0.30.7/sqlite/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { seedProducts, seedCollections, seedProductCollections } from "../seedData.ts";
const db = new DB("database.sqlite");
const products = sqliteTable("products", {
    id: integer("id").primaryKey(),
    title: text("title"),
    handle: text("handle"),
    precio: integer("precio")
});

const collections = sqliteTable("collections", {
    id: integer("id").primaryKey(),
    title: text("title"),
    handle: text("handle")
});

const productCollections = sqliteTable("productCollections", {
    productId: integer("productId").references(() => products.id),
    collectionId: integer("collectionId").references(() => collections.id)
});

//Poblar tablas
async function poblarBaseDeDatos(db: DB) {
    const countProducts = await db.select(products).all();
    if (countProducts.length === 0) {
        console.log("📥 Insertando productos y colecciones en la base de datos...");
        await db.insert(products).values(seedProducts);
        await db.insert(collections).values(seedCollections);
        await db.insert(productCollections).values(seedProductCollections);
        console.log("📊 Datos en 'products':", await db.select(products).all());
        console.log("📊 Datos en 'collections':", await db.select(collections).all());
        console.log("📊 Datos en 'productCollections':", await db.select(productCollections).all());
    } else {
        console.log("✅ La base de datos ya tiene datos, no es necesario poblarla.");
    }
}

poblarBaseDeDatos(db)



/* export const context = {
settings:{
  titulo: "Rosita"
},
products,
collections,
productCollections
}; */
