/**
 * MÓDULO 13: SIMULACIÓN DE PIPELINE DE BUILD ESTÁTICO
 *
 * Objetivo: Simular cómo un generador de sitios estáticos transforma datos en HTML final usando plantillas y componentes.
 *
 * Instrucciones:
 * 1. Simula una lista de datos de ejemplo (como un arreglo de productos o artículos)
 * 2. Usa un archivo de plantilla como base para cada elemento
 * 3. Genera una estructura DOM para cada entrada y renderízala como HTML
 * 4. Imprime o guarda los resultados como si fueran archivos individuales (`index.html`, `producto1.html`, etc.)
 *
 * Entrada de ejemplo:
 * datos:
 * [
 *   { titulo: "Producto 1", descripcion: "Este producto es genial" },
 *   { titulo: "Producto 2", descripcion: "Otro gran producto" }
 * ]
 *
 * plantilla:
 * "<article><h2>{{ titulo }}</h2><p>{{ descripcion }}</p></article>"
 *
 * Salida simulada:
 * - producto1.html → "<article><h2>Producto 1</h2><p>Este producto es genial</p></article>"
 * - producto2.html → "<article><h2>Producto 2</h2><p>Otro gran producto</p></article>"
 *
 * Consejo:
 * - Estructura funciones como si fueran pasos de una compilación:
 *   1. Preparar datos
 *   2. Procesar plantilla
 *   3. Parsear a árbol
 *   4. Renderizar a HTML
 *   5. Escribir en archivo (opcional en Deno)
 *
 * Desafío extra:
 * - Usa `Deno.writeTextFile()` para guardar el resultado en archivos reales
 */
