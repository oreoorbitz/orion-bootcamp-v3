/**
 * EJERCICIO 9-BIS: ANÁLISIS DE UN TEXTO CIENTÍFICO (QUÍMICA) MEDIANTE REGEX
 *
 * En este reto trabajarás con **expresiones regulares** para extraer información
 * típica de un artículo científico de química.
 *
 * 🔔 **IMPORTANTE**  
 * - Las funciones NO se van a importar en un archivo de pruebas.  
 * - Simplemente créalas en este mismo fichero y llámalas en la sección “DEMO”.
 * - Usa `console.log` para mostrar los resultados y verificar tu solución.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. TEXTO DE ENTRADA
 * ─────────────────────────────────────────────────────────────────────────────
 *   • `ARTICULO` es la cadena que simula el resumen (abstract) de un paper.  
 *   • Contiene, entre otras cosas:
 *       – Uno o varios **números CAS**      → formato «123-45-6»
 *       – Varias **fórmulas moleculares**    → ej. «C₂H₅OH», «H₂SO₄»
 *       – Palabras clave como *“catalyst”*, *“yield”*, etc.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 2. TAREAS
 * ─────────────────────────────────────────────────────────────────────────────
 *   A. `extraerCAS( texto ) → string[]`
 *      Devuelve un array con TODOS los números CAS únicos encontrados.
 *
 *   B. `extraerFormulas( texto ) → string[]`
 *      Devuelve un array con TODAS las fórmulas moleculares únicas.
 *      • Una fórmula sencilla sigue el patrón:  
 *        – Mayúscula  
 *        – Opcional minúscula  
 *        – Opcional número (1-3 dígitos)  
 *        – Repite lo anterior (≥2 veces)
 *      • Ej.: «C2H5OH», «NaCl», «Fe2O3»
 *
 *   C. `analizarArticulo( texto ) → string`
 *      Usa condicionales + las funciones anteriores:
 *        – Si hay ≥1 número CAS        → añade «CAS OK».
 *        – Si hay ≥2 fórmulas          → añade «Fórmulas OK».
 *        – Si aparece la palabra *catalyst* (case-insensitive)
 *          **y** el rendimiento (*yield*) informado es ≥ 90 %  → «Alto rendimiento».
 *      - Devuelve la concatenación separada por « | », por ej.:  
 *        "CAS OK | Fórmulas OK | Alto rendimiento"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 3. DEMO
 * ─────────────────────────────────────────────────────────────────────────────
 *   • Al final del archivo:
 *       const cas   = extraerCAS(ARTICULO);
 *       const fmts  = extraerFormulas(ARTICULO);
 *       const info  = analizarArticulo(ARTICULO);
 *       console.log(cas, fmts, info);
 *
 * ¡Recuerda que es habitual “googlear” la expresión regular y adaptarla! 📚
 */

// ───────────────────────────────────────── TEXTO DE PRUEBA
const ARTICULO = `
The novel catalyst (CAS 123-45-6) based on Fe2O3–SiO2 was evaluated for the
selective hydrogenation of 3-nitrophenol. A second batch used a palladium
nanoparticle system registered under CAS 98765-43-2. High yields (92 %) were
obtained in ethanol (C2H5OH) as solvent, while control reactions in water
(H2O) dropped below 50 % yield. Additional tests with sulfuric acid (H2SO4)
showed no significant improvement.
`;

// ───────────────────────────────────────── TAREA A
// TODO: crea aquí la función extraerCAS

// ───────────────────────────────────────── TAREA B
// TODO: crea aquí la función extraerFormulas

// ───────────────────────────────────────── TAREA C
// TODO: crea aquí la función analizarArticulo

/* ---------------------------------------------------------------------------*/
/* DEMO (descomenta al terminar)                                              */
/*
const cas       = extraerCAS(ARTICULO);
const formulas  = extraerFormulas(ARTICULO);
const resumen   = analizarArticulo(ARTICULO);

console.log("CAS encontrados:", cas);
console.log("Fórmulas:", formulas);
console.log("Resultado:", resumen);
*/
/* ---------------------------------------------------------------------------*/
