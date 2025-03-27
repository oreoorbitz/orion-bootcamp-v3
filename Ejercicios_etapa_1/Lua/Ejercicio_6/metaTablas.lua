--[[
EJERCICIO 6: CREAR Y MANIPULAR ARRAYS EN LUA

Instrucciones:
  1. Crea una función llamada "accederArray" que reciba dos parámetros:
       - arr: una tabla (array) de donde se extraerá el elemento.
       - index: el índice del elemento que se desea obtener.
     La función debe retornar el elemento en la posición indicada.
  
  2. Crea una función llamada "manipulaArray" que realice lo siguiente:
       a. Declara una tabla vacía llamada "myArray".
       b. Agrega tres elementos a la tabla usando table.insert.
       c. Retorna el elemento en la posición 2 (el segundo elemento) de la tabla.
  
  3. Crea una función llamada "sumarElementos" que sume todos los elementos de una tabla de números usando un bucle for.
       Si alguno de los elementos no es un número, retorna "Datos inválidos".
  
  4. Crea una función llamada "generarRango" que genere una tabla con números desde 0 hasta n (incluyendo n).
       Si n no es un número, retorna "Datos inválidos".
  
  5. Crea una función llamada "organizarPorTipo" que reciba una tabla y devuelva una tabla con dos campos:
       - strings: una tabla con todos los elementos de tipo string.
       - numbers: una tabla con todos los elementos de tipo number.
  
  6. Crea funciones que simulen los métodos de alto orden map, filter y reduce:
       a. "miMapa": recibe una tabla y una función; aplica la función a cada elemento y retorna una nueva tabla.
       b. "miFilter": recibe una tabla y una función predicado; retorna una nueva tabla con los elementos que cumplen la condición.
       c. "miReduce": recibe una tabla, una función reductora y un valor inicial; acumula un resultado a lo largo de los elementos y lo retorna.

Nota: Recuerda que en Lua las tablas son 1-indexadas y que no existen métodos incorporados para map, filter o reduce, por lo que deberás implementarlos utilizando bucles.
]]--

--- Devuelve un elemento en la tabla según el índice.
-- @param arr table: La tabla de donde se extraerá el elemento.
-- @param index number: El índice del elemento a obtener.
-- @return *: El elemento en la posición indicada.
function accederArray(arr, index)
    -- TODO: Retorna el elemento en la posición 'index' de 'arr'.
    return nil -- Reemplazar por la implementación correcta.
end

local resultadoDeAccederArray = accederArray({'a', 'b', 'c'}, 2)
print("accederArray:", resultadoDeAccederArray)

--- Manipula una tabla creando una nueva tabla, agregando tres elementos y retornando el segundo elemento.
-- @param arr table: Una tabla base (no se usará; se creará una nueva).
-- @param primerElemento any: Primer elemento a agregar.
-- @param segundoElemento any: Segundo elemento a agregar.
-- @param tercerElemento any: Tercer elemento a agregar.
-- @return any: El elemento en la posición 2 (segundo elemento) de la tabla resultante.
function manipulaArray(arr, primerElemento, segundoElemento, tercerElemento)
    -- TODO: Declara una tabla vacía llamada "myArray".
    
    -- TODO: Agrega los tres elementos usando table.insert.
    
    -- TODO: Retorna el elemento en la posición 2 de "myArray".
    return nil -- Reemplazar por la implementación correcta.
end

local resultadoDeManipularArray = manipulaArray({}, 1, 2, 3)
print("manipulaArray:", resultadoDeManipularArray)

--- Suma los elementos de una tabla de números usando un bucle for.
-- @param numeros table: Una tabla de números.
-- @return number|string: La suma de los elementos o "Datos inválidos" si algún elemento no es un número.
function sumarElementos(numeros)
    -- TODO: Verifica que todos los elementos sean números. Si no, retorna "Datos inválidos".
    
    -- TODO: Usa un bucle for para sumar los elementos.
    return nil -- Reemplazar por la implementación correcta.
end

local resultadoSumarElementos = sumarElementos({200, 200, 20})
print("sumarElementos:", resultadoSumarElementos)

--- Genera una tabla con números desde 0 hasta n (incluyendo n).
-- @param n number: El número hasta el cual se genera el rango.
-- @return table|string: Una tabla con números desde 0 hasta n o "Datos inválidos" si n no es un número.
function generarRango(n)
    -- TODO: Verifica que n es un número. Si no, retorna "Datos inválidos".
    
    -- TODO: Declara una tabla vacía (por ejemplo, rango).
    
    -- TODO: Usa un bucle for para recorrer desde 0 hasta n y agrega cada número a la tabla.
    
    -- TODO: Retorna la tabla.
    return nil -- Reemplazar por la implementación correcta.
end

local resultadoDeGenerarRango = generarRango(10)
print("generarRango:", resultadoDeGenerarRango)

--- Toma una tabla y devuelve un objeto (tabla) con dos campos: 'strings' y 'numbers'.
-- Cada campo contendrá una tabla con los elementos originales según su tipo.
-- @param arr table: La tabla de entrada.
-- @return table: Una tabla con las propiedades 'strings' y 'numbers'.
function organizarPorTipo(arr)
    -- TODO: Declara dos tablas, una para strings y otra para numbers.
    
    -- TODO: Recorre la tabla 'arr' y clasifica cada elemento en la tabla correspondiente.
    
    -- TODO: Retorna una tabla con las propiedades 'strings' y 'numbers'.
    return nil -- Reemplazar por la implementación correcta.
end

local resultadoDeOrganizarPorTipo = organizarPorTipo({1, "hola", 3, "mundo"})
print("organizarPorTipo:", resultadoDeOrganizarPorTipo)

--- miMapa
-- Esta función recibe una tabla y una función; aplica la función a cada elemento de la tabla y retorna una nueva tabla con los resultados.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función que se aplicará a cada elemento.
-- @return table: Una nueva tabla con los elementos transformados.
function miMapa(arreglo, fn)
    -- TODO: Declara una tabla vacía.
    
    -- TODO: Recorre 'arreglo' y aplica 'fn' a cada elemento, insertando el resultado en la nueva tabla.
    return nil -- Reemplazar por la implementación correcta.
end

local doble = function(x) return x * 2 end
local resultadoDeMapiarDoble = miMapa({1,2,3,4}, doble)
print("miMapa:", resultadoDeMapiarDoble)

--- miFilter
-- Esta función recibe una tabla y una función predicado; aplica la función a cada elemento de la tabla y retorna una nueva tabla
-- con aquellos elementos que cumplan la condición.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función predicado que determina si un elemento debe incluirse.
-- @return table: Una nueva tabla con los elementos que cumplen la condición.
function miFilter(arreglo, fn)
    -- TODO: Declara una tabla vacía.
    
    -- TODO: Recorre 'arreglo' y, para cada elemento, si 'fn(elemento)' es true, inserta el elemento en la nueva tabla.
    return nil -- Reemplazar por la implementación correcta.
end

local esPar = function(num) return num % 2 == 0 end
local resultadoFiltrado = miFilter({1,2,3,4,5,6}, esPar)
print("miFilter:", resultadoFiltrado)

--- miReduce
-- Esta función recibe una tabla, una función reductora y un valor inicial. Aplica la función reductora acumulando un resultado
-- a lo largo de los elementos de la tabla y retorna el resultado final.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función reductora que recibe dos argumentos: el acumulador y el elemento actual.
-- @param valorInicial any: El valor inicial del acumulador.
-- @return any: El resultado acumulado tras aplicar la función reductora.
function miReduce(arreglo, fn, valorInicial)
    -- TODO: Declara una variable 'acumulador' e inicialízala con 'valorInicial'.
    
    -- TODO: Usa un bucle for para recorrer 'arreglo' y actualiza 'acumulador' aplicando 'fn'.
    return nil -- Reemplazar por la implementación correcta.
end

local sumar = function(acumulador, valor) return acumulador + valor end
local resultadoReducir = miReduce({1,2,3,4}, sumar, 0)
print("miReduce:", resultadoReducir)

--- usaMap
-- Esta función utiliza el método equivalente a .map para transformar cada elemento de la tabla,
-- aplicando la función proporcionada y retornando una nueva tabla con los resultados.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función que se aplicará a cada elemento.
-- @return table: Una nueva tabla con los elementos transformados.
function usaMap(arreglo, fn)
    -- TODO: Usa un bucle for para aplicar 'fn' a cada elemento de 'arreglo' y guarda el resultado en una nueva tabla.
    return nil -- Reemplazar por la implementación correcta.
end

local multiplicarPorTres = function(x) return x * 3 end
local resultadoMap = usaMap({1,2,3,4}, multiplicarPorTres)
print("usaMap:", resultadoMap)

--- usaFilter
-- Esta función utiliza el método equivalente a .filter para filtrar los elementos de la tabla
-- que cumplan con la condición especificada en la función predicado y retorna una nueva tabla.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función predicado que determina si un elemento debe incluirse.
-- @return table: Una nueva tabla con los elementos que cumplen la condición.
function usaFilter(arreglo, fn)
    -- TODO: Usa un bucle for para recorrer 'arreglo' y filtra los elementos usando 'fn', guardando los que cumplen la condición en una nueva tabla.
    return nil -- Reemplazar por la implementación correcta.
end

local esImparejo = function(num) return num % 2 ~= 0 end
local resultadoFilter = usaFilter({1,2,3,4,5,6}, esImparejo)
print("usaFilter:", resultadoFilter)

--- usaReduce
-- Esta función utiliza el método equivalente a .reduce para acumular un resultado a partir de los elementos de la tabla,
-- aplicando la función reductora y retornando el resultado final.
-- @param arreglo table: La tabla de entrada.
-- @param fn function: La función reductora que recibe dos argumentos: el acumulador y el elemento actual.
-- @param valorInicial any: El valor inicial del acumulador.
-- @return any: El resultado acumulado tras aplicar la función reductora.
function usaReduce(arreglo, fn, valorInicial)
    -- TODO: Usa un bucle for para recorrer 'arreglo' y acumula el resultado usando 'fn'.
    return nil -- Reemplazar por la implementación correcta.
end

local multiplicar = function(ac, val) return ac * val end
local resultadoReduce = usaReduce({1,2,3,4}, multiplicar, 1)
print("usaReduce:", resultadoReduce)
