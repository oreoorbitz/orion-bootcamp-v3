/**
 * MÓDULO 15: REUTILIZAR Y REFACTORIZAR TU MOTOR DE PLANTILLAS
 *
 * 🧠 Concepto clave:
 * A medida que tu sistema crece, copiar y pegar archivos entre carpetas ya no es sostenible.
 * En este módulo, vas a **crear un archivo reutilizable** que contenga todas las funciones principales
 * de tu motor de plantillas y lo importarás en los ejercicios siguientes.
 *
 * Esto simula cómo los desarrolladores organizan librerías, reutilizan módulos, y preparan su código para crecer.
 *
 * 🎯 Objetivo:
 * Crear un archivo o una carpeta central donde vivan todas tus funciones relacionadas a:
 * - Motor de plantillas (`tokenizar`, `condicionales`, `filtros`, `bucles`, etc.)
 * - Parser de HTML (`tokenizarHTML`, `clasificarTokens`, `construirArbol`)
 * - Renderizador (`renderizarHTML`, `escapeTexto`)
 *
 * ✅ Instrucciones:
 * 1. Crea una nueva carpeta en el directorio padre del curso:
 *    `Ejercicios_etapa_2/plantilla_motor/`
 *
 * 2a. Si quieres usar un archivo central: dentro de esa carpeta, crea un archivo llamado `mod.ts` y organiza tus funciones ahí:
 *    - Usa `export` para cada función o tipo
 *    - Puedes dividir por secciones si lo deseas (parsing, rendering, liquid, etc.)
 * 2b. Si quieres crear una carpeta central: dentro de la carpeta coloca tus tres archivos por separado
 *    - Motor de plantillas (`tokenizar`, `condicionales`, `filtros`, `bucles`, etc.)
 *    - Parser de HTML (`tokenizarHTML`, `clasificarTokens`, `construirArbol`)
 *    - Renderizador (`renderizarHTML`, `escapeTexto`)
 *    No olvides:
 *    - Usa `export` para cada función o tipo
 *
 * 3. En cada carpeta de los próximos módulos (`ejercicio_{{n}}`), importa desde ahí:
 *    ```ts
 *    import { renderizarArchivoLiquid } from "../plantilla_motor/mod.ts";
 *    ```
 *    En caso de que estés usando una carpeta central asegurate de escribir bien la dirección del archivo y que los import esten escritos correctamente.
 *    ```ts
 *    import { renderizarArchivoLiquid } from "../plantilla_motor/motorDePlantillas.ts";
 *    ```
 * 4. Elige si este módulo tiene pruebas:
 *    - Puedes crear un `main.ts` para probar tu archivo central
 *    - Puedes decidir si ya estás satisfecho con las pruebas existentes
 *
 * 5. Haz una pequeña reflexión sobre tu código:
 *    - ¿Repetiste lógica innecesariamente?
 *    - ¿Tus funciones tienen responsabilidades claras?
 *    - ¿Deberías renombrar funciones para que sean más claras?
 *    - ¿Estás satisfecho con cómo estructuraste tu pipeline?
 *
 * ✅ Resultado esperado:
 * - Un archivo `mod.ts` con todo tu sistema de rendering.
 * - Los siguientes ejercicios ya no necesitaran copiar funciones previas porque ya se estará usando el motor creado en la carpeta.
 * - Posiblemente un pequeño `main_test.ts` o `demo.ts` para verificar que sigue funcionando.
 *
 * Consejo:
 * - Esta es una oportunidad para limpiar tu código antes de seguir construyendo sobre él.
 * - Piensa como si tu motor ya fuera una mini librería de verdad.
 * - Puedes incluir una sección de tipos al inicio del archivo para mantener todo bien organizado.
 */
