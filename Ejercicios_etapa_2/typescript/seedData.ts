export const products = [
  { id: 1, title: "Camisa suave A", handle: "camisa-suave-a", price: 2500 },
  { id: 2, title: "Camisa suave B", handle: "camisa-suave-b", price: 2600 },
  { id: 3, title: "Camisa dura C", handle: "camisa-dura-c", price: 1800 },
  { id: 4, title: "Pantalón casual D", handle: "pantalon-casual-d", price: 3200 },
  { id: 5, title: "Sudadera con capucha E", handle: "sudadera-capucha-e", price: 4500 },
  { id: 6, title: "Chaqueta ligera F", handle: "chaqueta-ligera-f", price: 5800 },
  { id: 7, title: "Vestido de verano G", handle: "vestido-verano-g", price: 3800 },
  { id: 8, title: "Jeans ajustados H", handle: "jeans-ajustados-h", price: 4200 },
  { id: 9, title: "Blusa floral I", handle: "blusa-floral-i", price: 2900 },
  { id: 10, title: "Camisa manga larga J", handle: "camisa-manga-larga-j", price: 3100 },
  { id: 11, title: "Falda midi K", handle: "falda-midi-k", price: 2800 },
  { id: 12, title: "Shorts deportivos L", handle: "shorts-deportivos-l", price: 2200 },
  { id: 13, title: "Parka invernal M", handle: "parka-invernal-m", price: 6500 },
  { id: 14, title: "Camiseta básica N", handle: "camiseta-basica-n", price: 1900 },
  { id: 15, title: "Vestido de noche O", handle: "vestido-noche-o", price: 5200 },
  { id: 16, title: "Chaleco P", handle: "chaleco-p", price: 2600 },
  { id: 17, title: "Mono Q", handle: "mono-q", price: 4800 },
  { id: 18, title: "Camisa de seda R", handle: "camisa-seda-r", price: 4200 },
  { id: 19, title: "Pantalón chino S", handle: "pantalon-chino-s", price: 3500 },
  { id: 20, title: "Blazer T", handle: "blazer-t", price: 5500 },
  { id: 21, title: "Vestido de lana U", handle: "vestido-lana-u", price: 4900 }
];

export const collections = [
  { id: 1, title: "Camisas suaves", handle: "soft-shirts" },
  { id: 2, title: "Promociones", handle: "sale" }
];

export const productCollections = [
  { productId: 1, collectionId: 1 },
  { productId: 2, collectionId: 1 },
  { productId: 3, collectionId: 2 },
  { productId: 3, collectionId: 3 }, // none existing collection, to verify the code won't break if prsent
  { productId: 4, collectionId: 1 }, // none existing product, to verify the code won't break if prsent
  { productId: 1, collectionId: 1 }, // duplicate, to verify the code won't break if prsent
];

/**
 * Product options
 * - Solo 1–3 tienen opciones; 4–21 no tienen (quedan con "Default Title").
 */
export const productOptions = [
  // Product 1: Color + Talla
  { productId: 1, position: 1, name: "Color", values: ["Rojo", "Azul"] },
  { productId: 1, position: 2, name: "Talla", values: ["S", "M", "L"] },

  // Product 2: Color + Talla
  { productId: 2, position: 1, name: "Color", values: ["Negro", "Blanco"] },
  { productId: 2, position: 2, name: "Talla", values: ["S", "M"] },

  // Product 3: Talla
  { productId: 3, position: 1, name: "Talla", values: ["S", "M", "L"] },
];

/**
 * Variants
 * - `title`: valores de opciones unidos por " / " en orden de position.
 * - Sin opciones → `title = "Default Title"`.
 * - id = productId * 1000 + index
 * - available: 1 | 0
 */
export const variants = [
  // ===== Product 1: Camisa suave A (Color x Talla) =====
  { id: 1001, productId: 1, title: "Rojo / S",  option1: "Rojo", option2: "S", option3: null, price: 2500, sku: "CAMISA-SUAVE-A-ROJO-S", available: 1 },
  { id: 1002, productId: 1, title: "Rojo / M",  option1: "Rojo", option2: "M", option3: null, price: 2550, sku: "CAMISA-SUAVE-A-ROJO-M", available: 1 },
  { id: 1003, productId: 1, title: "Rojo / L",  option1: "Rojo", option2: "L", option3: null, price: 2550, sku: "CAMISA-SUAVE-A-ROJO-L", available: 0 },
  { id: 1004, productId: 1, title: "Azul / S",  option1: "Azul", option2: "S", option3: null, price: 2500, sku: "CAMISA-SUAVE-A-AZUL-S", available: 1 },
  { id: 1005, productId: 1, title: "Azul / M",  option1: "Azul", option2: "M", option3: null, price: 2550, sku: "CAMISA-SUAVE-A-AZUL-M", available: 1 },
  { id: 1006, productId: 1, title: "Azul / L",  option1: "Azul", option2: "L", option3: null, price: 2550, sku: "CAMISA-SUAVE-A-AZUL-L", available: 1 },

  // ===== Product 2: Camisa suave B (Color x Talla) =====
  { id: 2001, productId: 2, title: "Negro / S",  option1: "Negro", option2: "S", option3: null, price: 2600, sku: "CAMISA-SUAVE-B-NEGRO-S", available: 1 },
  { id: 2002, productId: 2, title: "Negro / M",  option1: "Negro", option2: "M", option3: null, price: 2650, sku: "CAMISA-SUAVE-B-NEGRO-M", available: 1 },
  { id: 2003, productId: 2, title: "Blanco / S", option1: "Blanco", option2: "S", option3: null, price: 2600, sku: "CAMISA-SUAVE-B-BLANCO-S", available: 1 },
  { id: 2004, productId: 2, title: "Blanco / M", option1: "Blanco", option2: "M", option3: null, price: 2650, sku: "CAMISA-SUAVE-B-BLANCO-M", available: 1 },

  // ===== Product 3: Camisa dura C (Talla) =====
  { id: 3001, productId: 3, title: "S", option1: "S", option2: null, option3: null, price: 1800, sku: "CAMISA-DURA-C-S", available: 1 },
  { id: 3002, productId: 3, title: "M", option1: "M", option2: null, option3: null, price: 1800, sku: "CAMISA-DURA-C-M", available: 1 },
  { id: 3003, productId: 3, title: "L", option1: "L", option2: null, option3: null, price: 1850, sku: "CAMISA-DURA-C-L", available: 1 },

  // ===== Defaults for products 4–21 (sin opciones) =====
  { id: 4001,  productId: 4,  title: "Default Title", option1: null, option2: null, option3: null, price: 3200, sku: "PANTALON-CASUAL-D-DEFAULT", available: 1 },
  { id: 5001,  productId: 5,  title: "Default Title", option1: null, option2: null, option3: null, price: 4500, sku: "SUDADERA-CAPUCHA-E-DEFAULT", available: 1 },
  { id: 6001,  productId: 6,  title: "Default Title", option1: null, option2: null, option3: null, price: 5800, sku: "CHAQUETA-LIGERA-F-DEFAULT", available: 1 },
  { id: 7001,  productId: 7,  title: "Default Title", option1: null, option2: null, option3: null, price: 3800, sku: "VESTIDO-VERANO-G-DEFAULT", available: 1 },
  { id: 8001,  productId: 8,  title: "Default Title", option1: null, option2: null, option3: null, price: 4200, sku: "JEANS-AJUSTADOS-H-DEFAULT", available: 1 },
  { id: 9001,  productId: 9,  title: "Default Title", option1: null, option2: null, option3: null, price: 2900, sku: "BLUSA-FLORAL-I-DEFAULT", available: 1 },
  { id: 10001, productId: 10, title: "Default Title", option1: null, option2: null, option3: null, price: 3100, sku: "CAMISA-MANGA-LARGA-J-DEFAULT", available: 1 },
  { id: 11001, productId: 11, title: "Default Title", option1: null, option2: null, option3: null, price: 2800, sku: "FALDA-MIDI-K-DEFAULT", available: 1 },
  { id: 12001, productId: 12, title: "Default Title", option1: null, option2: null, option3: null, price: 2200, sku: "SHORTS-DEPORTIVOS-L-DEFAULT", available: 1 },
  { id: 13001, productId: 13, title: "Default Title", option1: null, option2: null, option3: null, price: 6500, sku: "PARKA-INVERNAL-M-DEFAULT", available: 1 },
  { id: 14001, productId: 14, title: "Default Title", option1: null, option2: null, option3: null, price: 1900, sku: "CAMISETA-BASICA-N-DEFAULT", available: 1 },
  { id: 15001, productId: 15, title: "Default Title", option1: null, option2: null, option3: null, price: 5200, sku: "VESTIDO-NOCHE-O-DEFAULT", available: 1 },
  { id: 16001, productId: 16, title: "Default Title", option1: null, option2: null, option3: null, price: 2600, sku: "CHALECO-P-DEFAULT", available: 1 },
  { id: 17001, productId: 17, title: "Default Title", option1: null, option2: null, option3: null, price: 4800, sku: "MONO-Q-DEFAULT", available: 1 },
  { id: 18001, productId: 18, title: "Default Title", option1: null, option2: null, option3: null, price: 4200, sku: "CAMISA-SEDA-R-DEFAULT", available: 1 },
  { id: 19001, productId: 19, title: "Default Title", option1: null, option2: null, option3: null, price: 3500, sku: "PANTALON-CHINO-S-DEFAULT", available: 1 },
  { id: 20001, productId: 20, title: "Default Title", option1: null, option2: null, option3: null, price: 5500, sku: "BLAZER-T-DEFAULT", available: 1 },
  { id: 21001, productId: 21, title: "Default Title", option1: null, option2: null, option3: null, price: 4900, sku: "VESTIDO-LANA-U-DEFAULT", available: 1 },
];

/** ---------- NEW: Images ---------- **/

// One featured image per collection
export const collectionImages = [
  {
    collectionId: 1,
    small:  "/images/collections/soft-shirts-small.jpg",
    medium: "/images/collections/soft-shirts-medium.jpg",
    large:  "/images/collections/soft-shirts-large.jpg",
    alt: "Colección Camisas suaves",
    width: 1600,
    height: 900
  },
  {
    collectionId: 2,
    small:  "/images/collections/sale-small.jpg",
    medium: "/images/collections/sale-medium.jpg",
    large:  "/images/collections/sale-large.jpg",
    alt: "Colección Promociones",
    width: 1600,
    height: 900
  }
];

// At least one image per product (position = 1 as featured)
export const productImages = [
  // You can add more per product (position 2,3...), but at least one featured exists
  ...products.map(p => ({
    productId: p.id,
    position: 1,
    small:  `/images/products/${p.id}-1-small.jpg`,
    medium: `/images/products/${p.id}-1-medium.jpg`,
    large:  `/images/products/${p.id}-1-large.jpg`,
    alt: p.title,
    width: 1200,
    height: 1200
  }))
];

// Exactly one image per variant (required by the exercise, no empty checks)
export const variantImages = [
  // For simplicity, file names based on variant id
  ...variants.map(v => ({
    variantId: v.id,
    small:  `/images/variants/${v.id}-small.jpg`,
    medium: `/images/variants/${v.id}-medium.jpg`,
    large:  `/images/variants/${v.id}-large.jpg`,
    alt: `${products.find(p => p.id === v.productId)?.title || "Producto"} - ${v.title}`,
    width: 1200,
    height: 1200
  }))
];
