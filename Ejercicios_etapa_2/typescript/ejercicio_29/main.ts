/**
 * MÓDULO 29: RUTEO Y PLANTILLAS DINÁMICAS PARA PRODUCTOS Y COLECCIONES

 * 🧠 Concepto clave:
 * En cualquier sitio web dinámico (como una tienda), las rutas definen qué contenido mostrar:
 * - `/products/gold-necklace` debería mostrar un producto específico
 * - `/collections/sale` debería mostrar una colección con productos

 * Este módulo conecta:
 * - Tu sistema de rutas (servidor)
 * - Tu base de datos SQLite (vía Drizzle)
 * - Tu motor de plantillas Liquid personalizado

 * 📁 Estructura esperada en cada proyecto de tema:
 * ```
 * templates/
 * ├── product.liquid
 * └── collection.liquid
 * ```

 * ✅ Objetivo:
 * Conectar tu base de datos a tu sistema de ruteo y generar HTML real usando plantillas dinámicas.

 * ✅ Instrucciones:

 * 1. Dentro del proyecto del tema (`ejercicio_29` o similar), crea una carpeta:
 *    ```
 *    templates/
 *    ├── product.liquid
 *    └── collection.liquid
 *    ```

 * 2. En tu módulo del servidor (por ejemplo, `slightlyLate.ts`):
 *    - Agrega soporte para rutas dinámicas:
 *      - `/products/:handle` → renderiza `product.liquid` con el producto que tenga ese `handle`
 *      - `/collections/:handle` → renderiza `collection.liquid` con la colección correspondiente

 * 3. Usa Drizzle para consultar la base de datos SQLite:
 *    - Productos y colecciones deben tener una columna `handle` única
 *    - Cuando se accede a una ruta, realiza la consulta a la base de datos
 *    - Si no existe el producto o colección, devuelve un mensaje de error o una página 404 simple

 * 4. Agrega al contexto dentro del motor de plantillas:
 *    - Para producto: `{ product: objetoDelProducto }`
 *    - Para colección: `{ collection: objetoDeLaColeccion }`

 * 5. Asegúrate de que la plantilla pueda acceder a los datos como:
 *    ```liquid
 *    <h1>{{ product.title }}</h1>
 *    <p>{{ product.description }}</p>
 *    ```

 * 6. Usa tu pipeline existente para:
 *    - Cargar la plantilla desde `templates/`
 *    - Pasarle el contexto apropiado (producto o colección)
 *    - Renderizar el HTML y enviarlo como respuesta al navegador
 *    - (opcional) Guardarlo en la carpeta `dist/` si estás en modo build

 * 🧪 Ejemplo de flujo:

 * URL accedida: `/products/gold-necklace`

 * En base de datos:
 * {
 *   id: 1,
 *   title: "Gold Necklace",
 *   description: "Handmade with real gold.",
 *   handle: "gold-necklace"
 * }

 * Plantilla `product.liquid`:
 * ```
 * <h1>{{ product.title }}</h1>
 * <p>{{ product.description }}</p>
 * ```

 * Resultado renderizado:
 * ```
 * <h1>Gold Necklace</h1>
 * <p>Handmade with real gold.</p>
 * ```

 * 🛠 Consejo:
 * - Este patrón es el mismo que usan Shopify y otros sistemas:
 *   - Tienen rutas dinámicas basadas en `handle`
 *   - Cargan los datos desde una base (MySQL, SQLite, GraphQL)
 *   - Renderizan el contenido con un motor de plantillas

 * - Puedes comenzar con rutas simples (solo `product` y `collection`) y extender en el futuro

 * 🔁 Verifica:
 * - Que tu servidor reciba la ruta desde el navegador
 * - Que se consulte correctamente la base de datos usando el `handle`
 * - Que el archivo de plantilla (`product.liquid` o `collection.liquid`) exista en `templates/`
 * - Que el HTML generado se renderice correctamente con los datos inyectados
 * - Que el CLI `Mockify` también valide:
 *    - Que la carpeta `templates/` exista
 *    - Que los archivos requeridos estén presentes:
 *        - `product.liquid`
 *        - `collection.liquid`
 *    - Si falta alguno, debe mostrar un mensaje de advertencia o error y detener la ejecución
