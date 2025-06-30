export const products = [
    { id: 1, title: "Camisa suave A", handle: "camisa-suave-a", precio: 2500 },
    { id: 2, title: "Camisa suave B", handle: "camisa-suave-b", precio: 2600 },
    { id: 3, title: "Camisa dura C", handle: "camisa-dura-c", precio: 1800 }
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