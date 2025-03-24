# Lectura: Metatables, Bucles y Funciones de Orden Superior en Lua

En este ejercicio, estamos simulando algunas de las funcionalidades que en JavaScript se realizan con arrays y métodos de orden superior (como map, filter y reduce). A continuación, se explican algunas diferencias y similitudes entre Lua y JavaScript en estos aspectos.

---

## 1. Tablas y Metatables en Lua

- Tablas en Lua:
  En Lua, no existen arrays nativos; en su lugar se usan "tablas". Una tabla es una estructura de datos flexible que puede actuar como un array (usando claves numéricas) o como un objeto (usando claves de tipo string).
  Ejemplo de un "array" en Lua:
    local miArray = { "a", "b", "c" }
    print(miArray[1])  -- Imprime "a", ya que Lua es 1-indexado.

- Metatables:
  Las metatables permiten definir comportamientos personalizados para las tablas, como sobrecargar operadores o implementar herencia. Es importante notar que las metatables no son arrays, sino una herramienta avanzada para extender la funcionalidad de las tablas. En este ejercicio, no usamos metatables para simular métodos de orden superior, sino que implementamos esas funciones utilizando bucles tradicionales.

---

## 2. Funciones de Orden Superior en Lua

- Funciones de Orden Superior:
  A diferencia de JavaScript, Lua no incluye métodos incorporados como map, filter o reduce para tablas. Sin embargo, Lua soporta funciones como ciudadanos de primera clase, lo que permite pasar funciones como argumentos y retornarlas.
  
  Esto nos permite implementar nuestras propias versiones de estos métodos utilizando bucles for. Por ejemplo, en JavaScript se usa array.map(fn), mientras que en Lua creamos una función miMapa que recorre la tabla y aplica fn a cada elemento.

---

## 3. Bucles en Lua

- Bucle For en Lua:
  La sintaxis del bucle for en Lua es diferente a la de JavaScript. En Lua, se usa:
    for i = 1, #miArray do
        print(miArray[i])
    end
  
  Aquí, #miArray retorna la longitud de la tabla. Además, Lua es 1-indexado, lo que significa que el primer elemento de la tabla está en el índice 1, a diferencia de JavaScript, que es 0-indexado.

- Simulación de Funciones de Orden Superior:
  Dado que Lua no ofrece métodos integrados para mapear, filtrar o reducir tablas, implementamos estas funciones manualmente usando bucles for. Por ejemplo, en nuestra función miMapa, recorremos la tabla, aplicamos la función a cada elemento y guardamos el resultado en una nueva tabla. De forma similar, miFilter y miReduce se implementan utilizando bucles para recorrer cada elemento y construir el resultado deseado.

---

## Conclusión

En resumen, mientras que JavaScript tiene métodos incorporados para trabajar con arrays y funciones de orden superior, en Lua:
- Usamos tablas para simular arrays.
- Las metatables son una característica avanzada para modificar el comportamiento de las tablas, pero no son necesarias para este ejercicio.
- No existen métodos incorporados como map, filter o reduce, por lo que se implementan manualmente usando bucles.
- Lua utiliza un bucle for que es 1-indexado, a diferencia del 0-indexado en JavaScript.

Estas diferencias en el manejo de datos y bucles ofrecen una oportunidad para comprender mejor la flexibilidad y las particularidades de cada lenguaje. ¡Sigue practicando para dominar estas variaciones y fortalecer tu capacidad para trasladar conceptos entre diferentes entornos de programación!
