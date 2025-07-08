export const router = {
  routes: {
    "/": "content_for_index",
  },
  resolve(path: string): string | undefined {
    return router.routes[path];
  }
};
