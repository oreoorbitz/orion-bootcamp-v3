// @ts-check

/**
 * MÓDULO DE REPASO: EJERCICIOS EN TYPESCRIPT
 *
 * Este módulo contiene una revisión de todos los ejercicios previos del curso,
 * ahora adaptados para usar TypeScript.
 *
 * ❗IMPORTANTE:
 * - Los estudiantes deben:
 *   ✅ Escribir las funciones ellos mismos.
 *   ✅ Exportar las funciones correctamente para que puedan ser probadas.
 *   ✅ Escribir pruebas utilizando Deno (para todas las funciones excepto las asincrónicas).
 * - Las pruebas deben estar en un archivo separado llamado `index_test.ts`.
 *
 * NOTA:
 * - Las funciones asincrónicas pueden omitirse en los tests.
 * - El objetivo principal es reforzar la creación de funciones y el manejo de tipos en TypeScript.
 */

/* ============================
 * EJERCICIO 1: Edad en días
 * ============================
 *
 * TODO:
 * - Crear una función llamada `edadEnDias` que reciba un número `anios` y retorne
 *   la edad convertida a días.
 * - Asegúrate de tipar el parámetro y el valor de retorno.
 * - La función debe ser exportada para su prueba.
 *
 * @example
 * edadEnDias(1) // 365
 */

// TODO: Escribir la función aquí

function edadEnDias (anios: number) {
return anios*365
}

console.log(edadEnDias(1))

/* ============================
 * EJERCICIO 2: Generar un saludo
 * ============================
 *
 * TODO:
 * - Crear una función llamada `cualEsTuNombre` que reciba dos strings: `primerNombre` y `apellido`.
 * - Retornar un saludo en el formato "Hola, <primerNombre> <apellido>!".
 * - Asegúrate de tipar correctamente los parámetros y el valor de retorno.
 *
 * @example
 * cualEsTuNombre("Juan", "Pérez") // "Hola, Juan Pérez!"
 */

// TODO: Escribir la función aquí
function cualEsTuNombre (primerNombre: string, apellido: string) {
  return `Hola, ${primerNombre} ${apellido}!`
}

console.log(cualEsTuNombre("Paola", "Nava"))
/* ============================
 * EJERCICIO 3: Múltiples funciones
 * ============================
 *
 * TODO:
 * 1. Crear una función `doble` que reciba un número y retorne el doble.
 * 2. Crear una función `triple` que reciba un número y retorne el triple.
 * 3. Crear una función `dobleMasTriple` que reciba un número y retorne la suma del doble y el triple.
 *
 * @example
 * doble(2) // 4
 * triple(3) // 9
 * dobleMasTriple(2) // 4 + 6 = 10
 */

// TODO: Escribir las funciones aquí
function doble(x: number) {
  return x*2
}

function triple(x: number) {
  return x*3
}

function dobleMasTriple(x: number) {
  return (doble(x) + triple(x) )
}

console.log(doble(2))
console.log(triple(3))
console.log(dobleMasTriple(2))

/* ============================
 * EJERCICIO 4: Tipado y validaciones
 * ============================
 *
 * Parte 1: Validación de tipos
 * ----------------------------
 * TODO:
 * - Crear una función `checarTipoSeguro` que determine si una variable es un `string` o `number`.
 * - Retornar un mensaje indicando el tipo detectado.
 *
 * @example
 * checarTipoSeguro(21) // "Es un número con valor: 21"
 *
 *
 * Parte 2: Conversión segura de tipo
 * -----------------------------------
 * TODO:
 * - Crear una función `convertirANumero` que convierta un valor a número si es posible.
 * - Usar `Number()` para la conversión.
 * - Si no es convertible, retornar "No es un número válido".
 *
 * @example
 * convertirANumero("123") // 123
 */

// TODO: Escribir las funciones aquí
function checarTipoSeguro (variable: string|number) {
return `Es un ${typeof(variable)} con valor: ${variable}`
}
console.log(checarTipoSeguro(22))
console.log(checarTipoSeguro("22"))

function convertirANumero (variable: string) {
 let conversion = Number(variable)
  if (Number.isNaN(conversion))
  return "No es un número válido"
else
return conversion
}

console.log(convertirANumero("222"))
console.log(convertirANumero("t45"))
/* ============================
 * EJERCICIO 5: Conversión de moneda
 * ============================
 *
 * TODO:
 * - Crear una función llamada `convertirCentsAMoneda` que convierta centavos a formato monetario.
 * - Validar que la moneda sea válida (USD, EUR, GBP).
 * - Retornar el valor formateado como string.
 *
 * @example
 * convertirCentsAMoneda(1234, "USD") // "$12.34"
 */
const monedas = {
    USD: "$",
    EUR: "€",
    GBP: "£",
}

// TODO: Escribir la función aquí
function convertirCentsAMoneda (centavos: number, codigoMoneda: string) {
  if (centavos < 0) return ('Valor invalido');

   if (!monedas[codigoMoneda]) return ("Codigo de moneda invalido")

  const valorEntero = (centavos/100).toFixed(2);
  const simboloMoneda = monedas[codigoMoneda]

  return (`${simboloMoneda}${valorEntero}`)
}

console.log(convertirCentsAMoneda(2566, "USD" ))
console.log(convertirCentsAMoneda(2566, "USd" ))

/* ============================
 * EJERCICIO 6: Manipulación de arrays
 * ============================
 *
 * Parte 1: Acceder a un índice
 * ----------------------------
 * TODO:
 * - Crear una función `accederArray` que retorne un elemento según su índice.
 *
 * Parte 2: Manipulación de array
 * -------------------------------
 * TODO:
 * - Crear una función `manipulaArray` que cree un array nuevo y retorne el segundo elemento agregado.
 *
 * Parte 3: Suma de elementos
 * ---------------------------
 * TODO:
 * - Crear una función `sumarElementos` que sume los valores numéricos de un array.
 *
 * @example
 * accederArray(['a', 'b', 'c'], 2) // 'c'
 * manipulaArray(['a'], 1, 2, 3) // 2
 * sumarElementos([1, 2, 3]) // 6
 */

// TODO: Escribir las funciones aquí
function accederArray<T> (arr:T[], index: number)  {
  return arr[index];
}

console.log(accederArray(['a', 'b', 'c'], 2))

function manipulaArray (arr: (string|number)[], primerElemento: string|number , segundoElemento: string|number , tercerElemento: string|number ): string|number {
  arr.push(primerElemento, segundoElemento, tercerElemento)
   return arr[1];
}

console.log(manipulaArray(['a'], 1, 2, 3))

/* ============================
 * EJERCICIO 7: Métodos personalizados
 * ============================
 *
 * Parte 1: Crear miMapa
 * ---------------------
 * TODO:
 * - Crear una función `miMapa` que reciba un array y una función y aplique esa función a cada elemento.
 *
 * Parte 2: Crear miFilter
 * -----------------------
 * TODO:
 * - Crear una función `miFilter` que reciba un array y filtre los elementos según una condición.
 *
 * Parte 3: Crear miReduce
 * -----------------------
 * TODO:
 * - Crear una función `miReduce` que reciba un array, una función reductora y un valor inicial.
 *
 * @example
 * miMapa([1, 2, 3], x => x * 2) // [2, 4, 6]
 * miFilter([1, 2, 3, 4], x => x % 2 === 0) // [2, 4]
 * miReduce([1, 2, 3, 4], (acc, x) => acc + x, 0) // 10
 */

// TODO: Escribir las funciones aquí
function miMapa<T, R>(arreglo: T[], fn: (item:T)=>R): R[] {
  let resultados: R[] = [];
  for(let i = 0; i<arreglo.length; i++){
      resultados.push(fn(arreglo[i]))
  }
  return resultados
}

console.log(miMapa([1, 2, 3], x => x * 2))

function miFilter<T>(arreglo:T[], fn: (item: T) => boolean): T[] {
  let resultados:T[] = [];
    for(let i = 0; i<arreglo.length; i++){
      if (fn(arreglo[i]) === true) {
        resultados.push(arreglo[i])
    }
  }
  return resultados
}

console.log(miFilter([1, 2, 3, 4], x => x % 2 === 0))


/* ============================
 * EJERCICIO 8: Programación orientada a objetos
 * ============================
 *
 * Parte 1: CrearUsuarioConPrototipo
 * ---------------------------------
 * TODO:
 * - Implementar una función `crearUsuarioConPrototipo` usando una función constructora y prototipos.
 *
 * Parte 2: Crear clase Usuario
 * -----------------------------
 * TODO:
 * - Crear una clase `Usuario` con propiedades `nombre` y `rol`, y un método `saludar()`.
 *
 * @example
 * const usuarioProto = crearUsuarioConPrototipo("Luis", "admin");
 * usuarioProto.saludar(); // "Hola, soy Luis y soy admin"
 *
 * const usuarioClase = new Usuario("Ana", "cliente");
 * usuarioClase.saludar(); // "Hola, soy Ana y soy cliente"
 */

// TODO: Escribir las funciones/clases aquí
function crearUsuarioConPrototipo (nombre: string, rol:string) {
    function UsuarioProto(this: any, nombre:string, rol:string) {
      this.nombre = nombre
      this.rol = rol
    }
    UsuarioProto.prototype.saludar = function () {
    return `Hola, soy ${this.nombre} y soy ${this.rol}.`
  }

  return new (UsuarioProto as any)(nombre, rol);
}

const usuarioProto = crearUsuarioConPrototipo("Luis", "admin");
console.log(usuarioProto)


class Usuario {
  nombre: string;
  rol:string;

 constructor(nombre: string, rol:string) {
  this.nombre = nombre;
  this.rol = rol;
 }

 saludar(): string {
  return `Hola, soy ${this.nombre} y soy ${this.rol}`;
 }
}

const usuarioClase = new Usuario("Ana", "cliente")
console.log(usuarioClase)
/* ============================
 * EJERCICIO 9: Promesas y async/await
 * ============================
 *
 * Parte 1: Proceso logístico con Promesas
 * ---------------------------------------
 * TODO:
 * - Implementar una función `procesarEnvio` usando `.then()` y `.catch()`.
 *
 * Parte 2: Proceso logístico con async/await
 * ------------------------------------------
 * TODO:
 * - Implementar una función `procesarEnvioAsync` usando `async/await`.
 *
 * ❗IMPORTANTE:
 * - Estas funciones no requieren tests.
 *
 * @example
 * procesarEnvio(); // Simulación de proceso logístico
 * await procesarEnvioAsync(); // Simulación de proceso logístico
 */

// TODO: Escribir las funciones aquí
const CONTENIDO_LIBRO = "libro";
const ESTADO_EN_TRANSITO = "en tránsito";
const ERROR_PAQUETE_PERDIDO = "El paquete se perdió en tránsito";

const LOG_BODEGA = "📍 En la bodega central: revisando el paquete...";
const LOG_CAMINO = "🚚 En camino al centro de distribución...";
const LOG_ENTREGA = "📬 Entregando al destinatario...";
const LOG_FIN = "🔁 Fin del proceso logístico.";
const LOG_PAQUETE_RECIBIDO = "📦 El destinatario recibió el paquete:";

const ERROR_ENTREGA = "❌ Error en la entrega:";

type Paquete = {
  contenido: string;
  estado: string;
  tiempo: number;
}

const paquete: Promise<Paquete> = new Promise((resolve, reject) => {
    const tiempoDeEntrega = Math.floor(Math.random() * 3000) + 1000;
    setTimeout(() => {
        const exitoso = Math.random() > 0.2; // 80% de probabilidad de éxito
        if (exitoso) {
            resolve(
              {
                contenido: CONTENIDO_LIBRO,
                estado: ESTADO_EN_TRANSITO,
                tiempo: tiempoDeEntrega
              }
            );
        } else {
            reject(new Error(ERROR_PAQUETE_PERDIDO));
        }
    }, tiempoDeEntrega);

});

const entregarAlDestinatario = (paquete: Paquete): void => {
    paquete.estado = "entregado";
    console.log(`${LOG_PAQUETE_RECIBIDO} ${CONTENIDO_LIBRO}. Estado: ${paquete.estado}`);
};

const procesarEnvioAsync = async (paquete: Promise<Paquete>): Promise<void> => {
    // TODO: Implementa el proceso logístico usando async/await, try/catch/finally.
  try {
    const paqueteRecibido = await paquete;
    paqueteRecibido.estado = "revisado";
    console.log(`${LOG_BODEGA}, contenido: ${CONTENIDO_LIBRO}. Estado: ${paqueteRecibido.estado}`);

    await new Promise(resolve => {
      paqueteRecibido.estado = "centro de distribución";
      console.log(`${LOG_CAMINO}, contenido: ${CONTENIDO_LIBRO}. Estado: ${ESTADO_EN_TRANSITO}`);
      resolve(paqueteRecibido)
    });

    entregarAlDestinatario(paqueteRecibido);

  } catch (error: any) {
        console.error(`${ERROR_ENTREGA} ${error.message}`);
    } finally {
        console.log(LOG_FIN);
    }
};

procesarEnvioAsync(paquete);
