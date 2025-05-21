/**
 * MÓDULO 31: OBJETOS `settings` Y EL MÓDULO `Mapper`
 *
 * 🧠 Concepto clave:
 * En Shopify, las secciones y los ajustes globales de un tema están definidos por archivos de configuración.
 * Estos archivos permiten que una interfaz admin (como el editor de temas) entienda qué datos se pueden modificar,
 * y cómo deberían mostrarse en la interfaz visual.
 *
 * En este módulo, implementarás:
 * - Un sistema de configuración de ajustes globales (`settings`)
 * - Un lector de configuración que inyecte estos valores en tu motor de plantillas
 * - Un módulo especial llamado `Mapper` que será el puente entre tus esquemas, datos y renderizado
 *
 * 📁 Estructura esperada:
 * - `config/settings_schema.json` → define la forma del objeto `settings`
 * - `config/settings_data.json` → contiene los valores reales usados en el sitio
 *
 * Ejemplo `settings_schema.json`:
 * ```json
 * {
 *   "name": "Configuración global del tema",
 *   "settings": [
 *     { "type": "text", "id": "marca", "label": "Nombre de marca" },
 *     { "type": "text", "id": "eslogan", "label": "Eslogan del sitio" }
 *   ]
 * }
 * ```
 *
 * Ejemplo `settings_data.json`:
 * ```json
 * {
 *   "global": {
 *     "marca": "Mi tienda",
 *     "eslogan": "Siempre contigo"
 *   },
 *   "sections": {}
 * }
 * ```

 * ✅ Instrucciones:

 * 1. Crea una carpeta `config/` dentro del directorio del tema.
 *    - Agrega `settings_schema.json` para definir los campos globales.
 *    - Agrega `settings_data.json` para los valores reales de cada configuración.

 * 2. Crea un módulo en el nivel raíz del curso llamado `Mapper.ts`.
 *    Este módulo se encargará de:
 *    - Leer `config/settings_schema.json` y `config/settings_data.json`
 *    - Construir el objeto `settings` que se pasará al render engine
 *    - Leer todas las secciones del tema, identificar su bloque `{% schema %}`, y también mapear sus datos desde `settings_data.json.sections`
 *    - Retornar un objeto `contextoFinal` que incluirá:
 *      - settings globales: `settings`
 *      - datos para cada sección: `section.settings`

 * 3. Actualiza tu CLI (`Mockify`) para que valide:
 *    - Que existe el archivo `config/settings_schema.json`
 *    - Que existe el archivo `config/settings_data.json`

 * 4. Asegúrate de que tu motor de plantillas entienda la variable global `settings`.

 * 🎯 Objetivo:
 * Tener disponible un objeto `settings` global dentro del contexto de renderizado, accesible desde Liquid como `{{ settings.marca }}`, y objetos `section.settings.id` cuando apliquen.

 * 🔁 Consejo:
 * - En esta fase los datos aún se modifican a mano.
 * - En la última parte del curso crearás una interfaz visual para editar estos archivos como hace Shopify.

 */
