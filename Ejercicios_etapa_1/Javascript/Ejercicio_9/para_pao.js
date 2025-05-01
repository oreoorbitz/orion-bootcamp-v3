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
const regexUno = /\d{2,7}-\d{2}-\d/g;
const extraerCAS = (texto) => {
   const casExt = texto.match(regexUno);
   return casExt || [];
}

// ───────────────────────────────────────── TAREA B
// TODO: crea aquí la función extraerFormulas
const regexDos = /\b(?=[A-Za-z]*\d)(?:[A-Z][a-z]?\d*){2,}\b/g;
const extraerFormulas = (texto) => {
  const formExt = texto.match(regexDos);
  return formExt || [];
}

// ───────────────────────────────────────── TAREA C
// TODO: crea aquí la función analizarArticulo
const analizarArticulo = (texto) => {
  let resultados = [];

  // Verificar si hay al menos un número CAS
    const cas = extraerCAS(texto);
     if (cas.length >= 1) {
      resultados.push("CAS OK");
     }

  // Verificar si hay al menos dos fórmulas
    const formulas = extraerFormulas(texto);
     if (formulas.length >= 2) {
      resultados.push("Fórmulas OK");
     }

  // Verificar si aparece la palabra "catalyst" (case-insensitive) y el rendimiento es ≥ 90%
    const regexCatalyst = /catalyst/i;
    const catalystEncontrado = regexCatalyst.test(texto);

    const regexYield = /\b\d{1,3}(?:[.,]\d+)?\s?%/g;
    const yieldMatches = texto.match(regexYield);

  // Verificar si hay un rendimiento informado ≥ 90%
    let altoRendimiento = false;
     if (yieldMatches) {
      for (let match of yieldMatches) {
      // Eliminar el símbolo de porcentaje y espacios
      let porcentajeStr = match.replace('%', '').trim();
      // Reemplazar coma por punto para manejar decimales
      porcentajeStr = porcentajeStr.replace(',', '.');
      const porcentaje = parseFloat(porcentajeStr);
      if (!isNaN(porcentaje) && porcentaje >= 90) {
        altoRendimiento = true;
        break;
      }
    }
  }

  // Si se cumplen ambas condiciones, agregar "Alto rendimiento"
  if (catalystEncontrado && altoRendimiento) {
    resultados.push("Alto rendimiento");
  }

  // Devolver la concatenación de los resultados separados por " | "
    return resultados.join(" | ");
}

/*DEMO (descomenta al terminar)                                              */

const cas       = extraerCAS(ARTICULO);
const formulas  = extraerFormulas(ARTICULO);
const resumen   = analizarArticulo(ARTICULO);

console.log("CAS encontrados:", cas);
console.log("Fórmulas:", formulas);
console.log("Resultado:", resumen);
