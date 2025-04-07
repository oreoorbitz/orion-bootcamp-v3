// @ts-check


/**
 * Devuelve un elemento en el array según el índice.
 * @param {Array} arr - El array de donde se extraerá el elemento.
 * @param {number} index - El índice del elemento que se desea obtener.
 * @returns {*} El elemento en la posición indicada.
 */



let array = ['a', 2, 'c'];

export const accederArray = (arr, index) => {
  // TODO: Retorna el elemento en el índice dado.
    return arr[index]; // Reemplazar por la implementación correcta.
};

const resultadoDeAccederArray = accederArray(['a', 'b', 'c'], 2);
console.log(resultadoDeAccederArray);

/**
 * Manipula un array creando un nuevo array y agregando tres elementos.
 * Luego, retorna el elemento en la posición 1 (el segundo elemento) del array.
 * @param {Array} arr - Un array base (no se usará; crea un array nuevo).
 * @param {*} primerElemento - Primer elemento a agregar.
 * @param {*} segundoElemento - Segundo elemento a agregar.
 * @param {*} tercerElemento - Tercer elemento a agregar.
 * @returns {string|number} El segundo elemento del array.
 */


 // TODO: Declara un array vacío llamado "myArray".
 let myArray =[];

export const manipulaArray = (arr, primerElemento, segundoElemento, tercerElemento) => {
    // TODO: Agrega tres elementos al array usando el método push.
  arr.push(primerElemento, segundoElemento, tercerElemento)
    // TODO: Retorna el elemento en la posición 1 del array.
    return arr[1]; // Reemplazar por la implementación correcta.
};

export const resultadoDeManipularArray = manipulaArray(['a'], 1, 2, 3);
console.log(resultadoDeManipularArray);

/**
 * Suma los elementos de un array de números usando un for loop.
 * @param {number[]} numeros - El array de números.
 * @returns {number|string} La suma total de los elementos o "Datos inválidos" si la validación falla.
 */

export const sumarElementos = (numeros) => {
    // TODO: Verifica que todos los elementos son números. Si alguno no lo es, retorna "Datos inválidos".
  const sonNumeros = numeros.every(elemento => typeof(elemento) === 'number')
  if (!sonNumeros) return 'Datos inválidos'
    // TODO: Usa un for loop para sumar los elementos del array.
  let suma = 0;
    for(let i = 0; i< numeros.length; i++  ) {
      suma += numeros[i];
    }
  return suma // Reemplazar por la implementación correcta.
};

const resultadoSumarElementos = sumarElementos([200, 200, 20]);
console.log(resultadoSumarElementos);

/**
 * Genera un array que contiene el rango de 0 a n (incluyendo n).
 * @param {number} n - El número hasta el cual se genera el rango.
 * @returns {number[]|string} Un array con números desde 0 hasta n o "Datos inválidos" si n no es un número.
 */

export const generarRango = (n) => {
  let rango = [];


  console.log('n es:', n)

  // TODO: Verifica que n es un número. Si no, retorna "Datos inválidos".
  if (typeof(n) !== 'number') return 'Datos inválidos'
    // TODO: Declara un array vacío, por ejemplo: const rango = [];

  console.log('rango es', rango)
    // TODO: Usa un bucle for para recorrer desde 0 hasta n (incluyendo n) y agrega cada número al array.
  for(let i = 0; i<= n; i++) {
    console.log('Antes de empujar rango es', rango)
    console.log('estoy empujando', i)
    rango.push(i);
    console.log('después de empujar rango es', rango)
  }
    // TODO: Retorna el array.
    return rango; // Reemplazar por la implementación correcta.
};

const resultadoDeGenerarRango = generarRango(10);
console.log(resultadoDeGenerarRango);

/**
 * Toma un array y devuelve un objeto con dos propiedades: 'strings' y 'numbers'.
 * Cada propiedad contendrá un array con los elementos del array original, según su tipo.
 * @param {(number|string)[]} arr - El array de entrada.
 * @returns {object} Un objeto con las propiedades 'strings' y 'numbers'.
 */

/*borrar aquí
export const organizarPorTipo = (arr) => {
    // TODO: Declara dos arrays, uno para strings y otro para numbers.

    // TODO: Recorre el array de entrada y clasifica cada elemento en el array correspondiente.

    // TODO: Retorna un objeto con las propiedades 'strings' y 'numbers' conteniendo los arrays correspondientes.
    return {}; // Reemplazar por la implementación correcta.
};

const resultadoDeOrganizarPorTipo = organizarPorTipo([1, "hola", 3, "mundo"]);
console.log(resultadoDeOrganizarPorTipo);

/**
 * miMapa
 *
 * Esta función recibe un array y una función. Aplica la función a cada elemento del array y
 * retorna un nuevo array con los resultados.
 *
 * @param {Array} arreglo - El array de entrada.
 * @param {Function} fn - La función que se aplicará a cada elemento.
 * @returns {Array} Un nuevo array con los elementos transformados.
 */
/*Borrar aqui
export const miMapa = (arreglo, fn) => {
    return []
};

const doble = x => x * 2;
const resultadoDeMapiarDoble = miMapa([1, 2, 3, 4], doble)

console.log(resultadoDeMapiarDoble);

/**
* miFilter
*
* Esta función recibe un array y una función predicado. Aplica la función a cada elemento del array y
* retorna un nuevo array que contiene solo aquellos elementos para los cuales la función predicado retorna true.
*
* @param {Array} arreglo - El array de entrada.
* @param {Function} fn - La función predicado que se aplicará a cada elemento.
* @returns {Array} Un nuevo array con los elementos que cumplen la condición.
*/
/* borrar aqui
export const miFilter = (arreglo, fn) => {
    return []
}

const esPar = (num) => num % 2 === 0
const resultadoFiltrado = miFilter([1, 2, 3, 4, 5, 6], esPar)

console.log(resultadoFiltrado)

/**
 * miReduce
 *
 * Esta función recibe un array, una función reductora y un valor inicial. Aplica la función reductora acumulando
 * un resultado a lo largo de los elementos del array y retorna el resultado final.
 *
 * @param {Array} arreglo - El array de entrada.
 * @param {Function} fn - La función reductora que recibe dos argumentos: el acumulador y el elemento actual.
 * @param {*} valorInicial - El valor inicial del acumulador.
 * @returns {*} El resultado acumulado después de aplicar la función reductora a todos los elementos.
 */
/* borrar aqui
export const miReduce = (arreglo, fn, valorInicial) => {
    return ''
};


const sumar = (acumulador, valor) => acumulador + valor
const resultadoReducir = miReduce([1, 2, 3, 4], sumar, 0)
console.log(resultadoReducir)

/**
 * usaMap
 *
 * Esta función utiliza el método Array.prototype.map para transformar cada elemento del array
 * aplicando la función proporcionada y retorna un nuevo array con los resultados.
 *
 * @param {Array} arreglo - El array de entrada.
 * @param {Function} fn - La función que se aplicará a cada elemento.
 * @returns {Array} Un nuevo array con los elementos transformados.
 */
/*borrar aqui
export const usaMap = (arreglo, fn) => {
    return []; // Reemplazar por la implementación correcta.
};

const multiplicarPorTres = x => x * 3;
const resultadoMap = usaMap([1, 2, 3, 4], multiplicarPorTres);
console.log(resultadoMap); // Ejemplo: [3, 6, 9, 12]

/**
 * usaFilter
 *
 * Esta función utiliza el método Array.prototype.filter para filtrar los elementos del array
 * que cumplan con la condición especificada en la función predicado y retorna un nuevo array.
 *
 * @param {Array} arreglo - El array de entrada.
 * @param {Function} fn - La función predicado que determina si un elemento debe incluirse.
 * @returns {Array} Un nuevo array con los elementos que cumplen la condición.
 */
/* borrar aqui
export const usaFilter = (arreglo, fn) => {
    return []; // Reemplazar por la implementación correcta.
};

const esImparejo = (num) => num % 2 !== 0;
const resultadoFilter = usaFilter([1, 2, 3, 4, 5, 6], esImparejo);
console.log(resultadoFilter);

/**
 * usaReduce
 *
 * Esta función utiliza el método Array.prototype.reduce para acumular un resultado a partir de los elementos del array,
 * aplicando la función reductora y retornando el resultado final.
 *
 * @param {Array} arreglo - El array de entrada.
 * @param {Function} fn - La función reductora que recibe dos argumentos: el acumulador y el elemento actual.
 * @param {*} valorInicial - El valor inicial del acumulador.
 * @returns {*} El resultado acumulado después de aplicar la función reductora a todos los elementos.
 */
/* borrar aqui
export const usaReduce = (arreglo, fn, valorInicial) => {
    return '';
};

const multiplicar = (acumulador, valor) => acumulador * valor;
const resultadoReduce = usaReduce([1, 2, 3, 4], multiplicar, 0);
console.log(resultadoReduce);
*/
