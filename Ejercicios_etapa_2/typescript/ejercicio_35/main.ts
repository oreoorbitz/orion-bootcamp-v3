/**
 * MÓDULO 35: Comandos avanzados de CLI para gestión de temas

 * 🧠 Concepto clave:
 * En Shopify, cada tienda puede tener múltiples temas. Uno se usa para desarrollo (`theme dev`), mientras otros pueden estar publicados o almacenados como borradores.

 * En este módulo vas a replicar ese flujo, organizando temas por nombre y permitiendo:
 *   - Crear nuevos temas
 *   - Subir temas al servidor
 *   - Descargar temas del servidor
 *   - Tener una versión activa en desarrollo

 * 🎯 Objetivo:
 * Agregar 3 comandos a `Mockify` CLI:
 *   - `Mockify theme init`
 *   - `Mockify theme push`
 *   - `Mockify theme pull`

 * ✅ Estructura global:
 * ```
 * Ejercicios_etapa_2/
 * ├── Mapper.ts
 * ├── Mockify.ts
 * ├── server/
 * │   └── mystore.mymockify.com/
 * │       ├── themes/
 * │       │   ├── dev/
 * │       │   ├── tema-uno/
 * │       │   └── tema-dos/
 * │       └── dist/
 * ├── tema-uno/
 * ├── tema-dos/
 * ```

 * ✅ Instrucciones:

 * 1. **Comando: `Mockify theme init`**
 *    - Solicita al usuario el nombre del nuevo tema (por ejemplo: `tema-uno`)
 *    - Crea una carpeta `tema-uno/` en el directorio actual
 *    - Genera dentro la estructura mínima de un tema:
 *      - `assets/`, `config/`, `snippets/`, `sections/`, `templates/`, `layouts/`, `dist/`
 *    - Puedes incluir archivos iniciales vacíos si lo deseas

 * 2. **Comando: `Mockify theme push`**
 *    - Se ejecuta dentro de una carpeta de tema válida
 *    - Verifica que el tema cumpla con la estructura esperada
 *    - Usa `.storesettings.json` para saber a qué tienda subir el tema
 *    - Copia todos los archivos a: `server/<store>/themes/<nombre-tema>/`
 *    - Si ya existe, pide confirmación para sobrescribir

 * 3. **Comando: `Mockify theme pull`**
 *    - Muestra una lista de temas disponibles en el servidor para esa tienda
 *    - Permite al usuario elegir uno y lo descarga a una nueva carpeta local con el mismo nombre
 *    - Reemplaza si ya existe localmente (con confirmación)

 * 4. **Comando: `Mockify theme dev`**
 *    - Siempre sincroniza el tema actual (carpeta donde se ejecuta) con `server/<store>/themes/dev/`
 *    - Reemplaza el contenido de `dev/` completamente
 *    - Este tema es el que se renderiza en tiempo real con WebSocket + servidor local

 * ✅ Validaciones requeridas:
 * - Mockify debe asegurarse de que:
 *   - El tema tiene la estructura válida
 *   - Existe `.storesettings.json` con la tienda activa
 *   - Los nombres de carpeta sean únicos para los temas por tienda

 * ✅ Consejo:
 * Así como en Shopify usamos:
 *   - `shopify theme init` → crear nuevo tema
 *   - `shopify theme push` → subir al servidor
 *   - `shopify theme pull` → traer desde el servidor
 *   - `shopify theme dev` → entorno en vivo
 *
 * Tú ahora tienes un flujo equivalente con Mockify.

 */
