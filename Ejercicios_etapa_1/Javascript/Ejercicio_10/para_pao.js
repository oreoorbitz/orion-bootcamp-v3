// @ts-check
/*******************************************************************************************
 * -----------------------------------------------------------------------------------------
 * Contexto
 * ---------
 * Estás construyendo una pequeña aplicación interna para un laboratorio de química.
 * El «API» del laboratorio tarda ≈ 1 s en responder y devuelve un lote de muestras
 * que deben analizarse.  Para practicar asincronía **NO** haremos peticiones reales:
 * simularemos la latencia con `setTimeout` y Promesas.
 *
 * -----------------------------------------------------------------------------------------
 * 1.  MOCK API
 *     👇 No modifiques esta función. Simula la llamada HTTP a un “servidor”.
 *******************************************************************************************/
function obtenerMuestrasDelServidor () {
    /** @type {{ id:number, nombre:string, ph:number, concentracion:number, temper:number }[]} */
    const MOCK_MUESTRAS = [
      { id: 1, nombre: "Solución Acética",  ph: 3.5,  concentracion: 0.1, temper: 21 },
      { id: 2, nombre: "Tampón Fosfato",   ph: 7.2,  concentracion: 0.05, temper: 22 },
      { id: 3, nombre: "Solución Amónica", ph: 11.1, concentracion: 0.2, temper: 19 },
      { id: 4, nombre: "Agua Desionizada", ph: 7.0,  concentracion: 0.0,  temper: 20 }
    ];
  
    return new Promise(resolve => {
      // Simula 1 s de latencia de red/servidor
      setTimeout(() => resolve(MOCK_MUESTRAS), 1000);
    });
  }
  
  /*******************************************************************************************
   * 2.  TU MISIÓN
   * -----------------------------------------------------------------------------------------
   * A) Crea la función **`obtenerMuestras()`**  (async)
   *    - Debe invocar a `obtenerMuestrasDelServidor()` usando `await`.
   *    - Debe devolver el array de muestras.
   *
   * B) Crea la función **`filtrarPorPH(muestras, rango)`**
   *    - `muestras` es el array recibido.
   *    - `rango` es un objeto `{ min:number, max:number }`.
   *    - Devuelve sólo las muestras cuyo pH esté en el rango (incluyendo límites).
   *
   * C) Crea la función **`calcularPromedioConcentracion(muestras)`**
   *    - Calcula y devuelve el promedio de la propiedad `concentracion`.
   *    - Usa `Array.prototype.reduce`.
   *
   * D) Crea la función **`procesarEnsayo()`** (async)
   *    - 1 . Llama a `obtenerMuestras()` y espera la respuesta.
   *    - 2 . Filtra las muestras con pH entre **6** y **8**.
   *    - 3 . Muestra en consola:
   *          "🔬 Muestras neutras/ligeramente ácidas/alcalinas: <N>"
   *    - 4 . Calcula el promedio de concentración de TODO el lote recibido
   *          y muestra en consola:
   *          "📊 Promedio de concentración: <valor>%"
   *
   * -----------------------------------------------------------------------------------------
   * 3.  SUGERENCIAS
   *    •  Usa `try/catch` dentro de funciones async para capturar errores.
   *    •  Emplea **`async` / `await`** en lugar de `.then()` para mayor legibilidad.
   *    •  El ejercicio simula un único “endpoint”; en un escenario real tendrías
   *       varios `fetch` hacia distintas URLs.
   *
   * 4.  DEMO
   *    Al final del archivo invoca `procesarEnsayo()` para ver el flujo completo.
   *******************************************************************************************/
  
  // TODO: A) Implementa aquí `obtenerMuestras`
  
  // TODO: B) Implementa aquí `filtrarPorPH`
  
  // TODO: C) Implementa aquí `calcularPromedioConcentracion`
  
  // TODO: D) Implementa aquí `procesarEnsayo`
  
  // -----------------------------------------------------------------------------
  // LÍNEA DE EJECUCIÓN: cuando termines las funciones, descomenta la siguiente:
  // procesarEnsayo();
  