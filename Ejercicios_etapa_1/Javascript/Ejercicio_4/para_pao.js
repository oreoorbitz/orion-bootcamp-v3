const checkBool = element => typeof(element) === 'boolean'


/**
 * @param {*} element - Cualquier valor que se desea evaluar
 * @returns {string} Un mensaje indicando si el valor es falsy, booleano false, booleano true, o truthy.
 */
export const falsosoVerdadoso = (element) => {
  const SUBFIX_BOOL = 'El elemento es el booleano'
  const SUBFIX = 'El elemento es'


  if (checkBool(element)) return (`${SUBFIX_BOOL} ${element}`)

  //[truthy / falsy]
  if (!element) return (`${SUBFIX} falsy: ${!element}`)

  return (`${SUBFIX} truthy: true`)


    /* Requerimientos:
      5. Optionalmente, crear una funcion para que sea mas facil logear el resultado
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


console.log('1',falsosoVerdadoso(false));  // "El elemento es el booleano false"
console.log('2',falsosoVerdadoso(true));   // "El elemento es el booleano true"
console.log('3',falsosoVerdadoso(0));      // "El elemento es falsy: true"
console.log('4',falsosoVerdadoso(""));     // "El elemento es falsy: true"
console.log('5',falsosoVerdadoso(null));   // "El elemento es falsy: true"
console.log('6',falsosoVerdadoso(undefined)); // "El elemento es falsy: true"
   // "El elemento es falsy: true"
console.log('8',falsosoVerdadoso(42));     // "El elemento es truthy: true"
console.log('9',falsosoVerdadoso("Hola")); // "El elemento es truthy: true"
console.log('10',falsosoVerdadoso([]));     // "El elemento es truthy: true"
console.log('11',falsosoVerdadoso({}));     // "El elemento es truthy: true"
