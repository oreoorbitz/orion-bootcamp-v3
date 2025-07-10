export const router = {
  routes: {
    "/": "content_for_index",
    "/product/": "product",
    "/products/": "product",
    "/collection/": "collection",
    "/collections/": "collection"
  },

  resolve(path: string): { type: string; handle?: string; directory?: string } | undefined {
    // Ruta exacta para la página principal
    if (path === "/") {
      return { type: "content_for_index" };
    }

    // Rutas dinámicas de productos (singular y plural)
    if (path.startsWith("/product/")) {
      const handle = path.replace("/product/", "");
      if (handle) {
        return {
          type: "product",
          handle,
          directory: "products"
        };
      }
    }

    if (path.startsWith("/products/")) {
      const handle = path.replace("/products/", "");
      if (handle) {
        return {
          type: "product",
          handle,
          directory: "products"
        };
      }
    }

    // Rutas dinámicas de colecciones (singular y plural)
    if (path.startsWith("/collection/")) {
      const handle = path.replace("/collection/", "");
      if (handle) {
        return {
          type: "collection",
          handle,
          directory: "collections"
        };
      }
    }

    if (path.startsWith("/collections/")) {
      const handle = path.replace("/collections/", "");
      if (handle) {
        return {
          type: "collection",
          handle,
          directory: "collections"
        };
      }
    }

    // Si no coincide con ninguna ruta
    return undefined;
  }
};
