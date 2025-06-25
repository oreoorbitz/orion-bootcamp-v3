import { DB } from "https://deno.land/x/sqlite/mod.ts";

import { seedProducts, seedCollections, seedProductCollections } from "../seedData.ts";

export const context = {
settings:{
  titulo: "Rosita"
},
products: seedProducts,
collections: seedCollections,
productCollections: seedProductCollections
};
