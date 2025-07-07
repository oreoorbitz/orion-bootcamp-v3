/**
 * 🧩 MÓDULO 30: Crear módulo de rutas y manejar 404s
 *
 * 🧠 Concepto clave:
 * En este módulo comenzarás a estructurar el manejo de rutas, como lo harías en un servidor real.
 * Crearás un módulo de rutas personalizado (parecido a un `Router` de Oak o Express) y establecerás
 * un comportamiento base para cuando una ruta no se encuentre (404).
 *
 * 🎯 Objetivo:
 * - Crear un archivo `router.ts` en `server/` que contenga una tabla de rutas
 * - Implementar una función `resolve(path)` que retorne el nombre del template asociado a una ruta
 * - Crear una plantilla `404.liquid` para rutas no encontradas
 * - Generar `404.html` y `index.html` como salida en el `dist/`
 * - Simular comportamiento de servidor con manejo de rutas no encontradas
 *
 * ✅ Instrucciones:
 *
 * 1. **Prepara tu carpeta de ejercicio**
 *
 *    Copia tu tema a `typescript/ejercicio_30/` desde el ejercicio anterior (`ejercicio_29`).
 *    Asegúrate de incluir:
 *    - `layout/`
 *    - `templates/`
 *    - `assets/`
 *    - `main.ts`
 *
 *    Verifica que `templates/` contenga `content_for_index.liquid`.
 *
 * 2. **Crea el archivo `router.ts` en `server/`**
 *
 *    Este módulo vivirá del lado del servidor.
 *
 *    - Crea `typescript/server/router.ts`
 *    - Exporta una función u objeto `router` con una función `resolve(path: string)`
 *    - Esta función debe devolver el nombre del template asociado (por ejemplo: `"content_for_index"` para la ruta `/`)
 *
 *    En próximos módulos, este archivo se expandirá para admitir handles dinámicos.
 *
 * 3. **Crea la plantilla `404.liquid`**
 *
 *    Dentro de `templates/`, crea un nuevo archivo:
 *    ```
 *    templates/404.liquid  ← ✅ nuevo archivo
 *    ```
 *    Copia el contenido desde `typescript/liquid_snippets/404.liquid`.
 *
 * 4. **Actualiza tu lógica de renderizado para usar el router**
 *
 *    - Importa `router` desde `server/router.ts`
 *    - Llama a `router.resolve(path)` para determinar el nombre del template
 *    - Si `resolve()` devuelve `undefined`, usa `"404"` como fallback
 *    - Renderiza ese template con tu motor Liquid como hiciste con `content_for_index.liquid`
 *    - Inyecta el resultado como `content_for_layout` en el layout
 *    - Escribe el HTML final en `themes/dev/dist/`
 *
 *    > ⚠️ Recuerda: si antes solo estabas procesando un solo template (`content_for_index.liquid`), ahora deberías asegurarte
 *    > de que tu sistema de generación puede manejar múltiples archivos `.liquid` desde `templates/`.
 *
 * 5. **Organiza tus rutas y plantillas**
 *
 *    - Si aún no lo has hecho, considera crear una función como `getTemplatePath(nombre: string)` para ubicar templates fácilmente.
 *    - Esto será útil a medida que agregues más archivos como `product.liquid`, `collection.liquid`, etc.
 *
 * 6. **Modifica tu función `iniciarServidor()` en `slightlyLate.ts`**
 *
 *    - Ajusta la función para servir el archivo correspondiente desde `themes/dev/dist/`
 *    - Si la ruta solicitada no existe en disco, sirve `404.html` con status `404`
 *    - Puedes seguir usando `Deno.readTextFile()` como hasta ahora
 *
 *    Esto simulará un comportamiento de servidor real con manejo de errores por rutas no encontradas.
 *
 * 📁 Estructura esperada:
 * Ejercicios_etapa_2/
 * ├── typescript/
 * │   ├── ejercicio_30/
 * │   │   ├── layout/
 * │   │   ├── templates/
 * │   │   │   ├── content_for_index.liquid
 * │   │   │   └── 404.liquid        ← ✅ nuevo archivo
 * │   │   ├── assets/
 * │   │   ├── main.ts
 * │   └── server/
 * │       ├── controller.ts
 * │       ├── contextPlease.ts
 * │       ├── router.ts           ← ✅ nuevo archivo de este módulo
 * │       ├── slightlyLate.ts
 * │       ├── wsServer.ts
 * │       └── themes/
 * │           └── dev/
 * │               ├── layout/
 * │               ├── templates/
 * │               ├── dist/
 * │               │   ├── content_for_index.html
 * │               │   ├── 404.html           ← ✅ nuevo archivo generado
 * │               │   └── assets/
 * │               │       └── theme.css
 *
 * 🎯 Resultado esperado:
 * - Tienes un `router.ts` funcional que resuelve rutas a templates
 * - Puedes renderizar tanto `content_for_index.liquid` como `404.liquid`
 * - Se generan correctamente `content_for_index.html` y `404.html` en `dist/`
 * - Tu servidor en `iniciarServidor()` sirve `404.html` con status 404 cuando la ruta no existe
 * - Estás listo para soportar rutas dinámicas como `/products/:handle` en el próximo módulo
 */
