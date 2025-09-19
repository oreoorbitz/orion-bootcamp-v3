/**
 * EJERCICIO 4: EVALUACIÓN DE VALORES FALSY Y TRUTHY
 *
 * Ejemplos:
 *   falsosoVerdadoso(false) => "El elemento es el booleano false"
 *   falsosoVerdadoso(true) => "El elemento es el booleano true"
 *   falsosoVerdadoso(0) => "El elemento es falsy: true"
 *   falsosoVerdadoso("") => "El elemento es falsy: true"
 *   falsosoVerdadoso("Hola") => "El elemento es truthy: true"
 *   falsosoVerdadoso([]) => "El elemento es truthy: true"
 *
 * @param {*} elemento - Cualquier valor que se desea evaluar
 * @returns {string} Un mensaje indicando si el valor es falsy, booleano false, booleano true, o truthy.
 */
export const falsosoVerdadoso = (elemento) => {
    /* Requerimientos:
      Re-escribe tu codigo para que cumpla requerimientos:
      1. Usar el operador de ! para verificar si el elemento es falsy, no es nessecario explictamente checar todo los elementos falsies
      2. Crear una funcion para generar el sufijo de el return de booleanos.
      3. Usar typeoff para checar si elemento es un booleano, si los es, usa la funcion que creaste en el paso 2.
      4. Sigue usando una variable para el sufijo, pero cambailo a UPPER_SNAKE_CASE, ya que su valor es fijo.
      5. Optionalmente, crear una funcion para que sea mas facil logear el resultado

      No tienes que seguir la lista en orden.

      No te precoupes sobre NaN.
    */

   
    /*
        const subfix = 'El elemento es' 

        console.log(subfix, elemento)

        if (elemento === false) return (`${subfix} el booleano ${elemento}`)

        if (elemento === true) return (`${subfix} el booleano ${elemento}`)

        if (elemento === 0) return (`${subfix} falsy: ${elemento === 0}`)

        if (elemento === "") return (`${subfix} falsy: ${elemento === ""}`)

        if (elemento === null) return (`${subfix} falsy: ${elemento === null}`)

        if (elemento === undefined) return (`${subfix} falsy: ${elemento === undefined}`)

        if (elemento == []) return (`${subfix} truthy: ${elemento == []}`)

        if (typeof(elemento) == 'object') return (`${subfix} truthy: ${typeof(elemento) == 'object'}`)

        if ((typeof elemento !== "string") && isNaN(elemento)) return (`${subfix} falsy: ${isNaN(elemento)}`)

        return (`${subfix} truthy: true`)
   */


}
