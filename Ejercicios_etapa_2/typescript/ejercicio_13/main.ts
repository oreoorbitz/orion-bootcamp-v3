/**
 * MÓDULO 12: INTEGRAR PLANTILLA + ÁRBOL DE NODOS
 *
 * Objetivo: Tomar una plantilla con placeholders, rellenarla con datos, parsearla a estructura JS, y luego renderizarla como HTML.
 *
 * Instrucciones:
 * 1. Usa tu sistema de plantillas del Proyecto 2 (hasta filtros).
 * 2. Usa tu parser del Proyecto 1 para transformar el HTML procesado en una estructura de árbol.
 * 3. Usa `renderizarHTML()` para convertir el árbol en una cadena HTML final.
 * 4. Define una función principal como:
 *    `generarHTMLDesdePlantilla(template: string, contexto: Record<string, any>): string`
 *
 * Flujo esperado:
 * - Plantilla + datos → renderizado con variables
 * - Resultado se tokeniza y convierte en árbol DOM JS
 * - Árbol se renderiza a HTML con escape de texto
 *
 * Consejo:
 * - Mantén la separación entre partes: renderizado de plantilla, parsing, renderizado final
 * - Usa ejemplos simples como:
 *
 * template:
 * "<h1>{{ titulo }}</h1><p>{{ descripcion }}</p>"
 *
 * contexto:
 * { titulo: "Hola", descripcion: "Texto <seguro>" }
 *
 * resultado:
 * "<h1>Hola</h1><p>Texto &lt;seguro&gt;</p>"
 */
