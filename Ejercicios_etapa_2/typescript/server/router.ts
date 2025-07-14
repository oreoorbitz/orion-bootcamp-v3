export const router = {
    resolve(path: string, context: any) {
        // Rutas estáticas simples
        if (path === "/") {
            return { template: "content_for_index" };
        }

        if (path === "/404") {
            return { template: "404" };
        }

        // Rutas dinámicas: /products/:handle
        if (path.startsWith("/products/")) {
            const handle = path.replace("/products/", "");
            const product = context.products.find((p: any) => p.handle === handle);
            if (product) {
                return { template: "product", object: product };
            }
        }

        // Rutas dinámicas: /collections/:handle
        if (path.startsWith("/collections/")) {
            const handle = path.replace("/collections/", "");
            const collection = context.collections.find((c: any) => c.handle === handle);
            if (collection) {
                return { template: "collection", object: collection };
            }
        }

        // Si no se encontró ninguna coincidencia
        return undefined;
    }
};
