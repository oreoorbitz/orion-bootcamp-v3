export const router = {
    resolve(path: string) {
        const routes = {
            "/": "content_for_index",
        };
        return routes[path];
    }
}