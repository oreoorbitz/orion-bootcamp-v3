export const router = {
    resolve(path: string) {
        const routes: Record<string, string> = {
            "/": "content_for_index",
            "/404": "404",
        };

        return routes[path];
    },
};