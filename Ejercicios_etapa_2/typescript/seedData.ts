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
