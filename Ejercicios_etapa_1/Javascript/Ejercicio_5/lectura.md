# Lecture: Conversión de Centavos a Formato Monetario y Conceptos Clave en JavaScript

Este documento repasa algunos conceptos clave que te ayudarán a entender y resolver el desafío de convertir una cantidad en centavos a un formato monetario. Se organiza en dos secciones: **Nuevos Temas** y **Temas Previamente Cubiertos**.

---

## Nuevos Temas

### 1. Operador de Negación (Reverse Operator)
- **Qué es:** El operador de negación (`-`) se utiliza para cambiar el signo de un número.
- **Uso en el desafío:** Aunque en este reto no se utiliza explícitamente para invertir un número, es importante saberlo para comprender operaciones matemáticas y transformaciones en datos.

### 2. Operadores de Comparación
- **Qué son:** Permiten comparar valores usando operadores como `<`, `>`, `===`, etc.
- **Uso en el desafío:** Se usan para verificar si un número (por ejemplo, centavos) es menor que 0 o para determinar si un código de moneda existe dentro del objeto `monedas`.
- **Ejemplo:** `if (centavos < 0) { ... }`

### 3. Objetos en JavaScript
- **Qué son:** Estructuras que agrupan datos en pares de clave-valor.
- **Uso en el desafío:** El objeto `monedas` mapea códigos de moneda (como `"USD"`, `"EUR"`, `"GBP"`) a sus respectivos símbolos. Es importante entender cómo acceder a sus propiedades.

### 4. Notación de Punto y Notación Literal para Acceder a Valores de Objetos
- **Notación de Punto:** Permite acceder a una propiedad de un objeto utilizando un punto, por ejemplo, `monedas.USD`.
- **Notación Literal (o de Corchetes):** Se usa cuando la clave es dinámica o no es un identificador válido, por ejemplo, `monedas[codigoMoneda]`.
- **Uso en el desafío:** Se utiliza para obtener el símbolo correcto según el `codigoMoneda` recibido como parámetro.

### 5. Método `toFixed`
- **Qué es:** Un método de los objetos `Number` que formatea un número utilizando notación de punto fijo.
- **Uso en el desafío:** Se emplea para asegurarse de que el resultado (después de dividir los centavos entre 100) tenga dos decimales, lo cual es esencial para representar valores monetarios.
- **Ejemplo:** `(centavos / 100).toFixed(2)`

### 6. Concepto de "Early Return" con un Mensaje Temprano
- **Qué es:** Es una técnica en la que se interrumpe la ejecución de una función tan pronto como se cumple una condición específica.
- **Uso en el desafío:** Se utiliza para devolver un mensaje de error de forma inmediata si la entrada no es válida, por ejemplo, si `centavos` es negativo o el código de moneda no existe en el objeto `monedas`.
- **Beneficio:** Mejora la legibilidad del código y evita la ejecución innecesaria de código cuando se detecta un error.

---

## Temas Previamente Cubiertos

### 1. Interpolación de Cadenas (String Interpolation)
- **Qué es:** Permite insertar variables dentro de cadenas usando plantillas literales (backticks) y `${}`.
- **Uso en el desafío:** Se utiliza para formar el string final que combina el símbolo de la moneda y el valor formateado.

### 2. Operación de División
- **Qué es:** Una operación aritmética básica que divide dos números.
- **Uso en el desafío:** Se utiliza para convertir centavos a unidades monetarias dividiendo por 100.

### 3. Palabra Clave `return`
- **Qué es:** Permite que una función devuelva un valor y termine su ejecución.
- **Uso en el desafío:** Es fundamental en la función para devolver resultados o mensajes de error.

### 4. Funciones en JavaScript
- **Parámetros y Argumentos:** Las funciones pueden recibir datos a través de parámetros y se les pasan argumentos cuando se llaman.
- **Funciones Flecha (Fat Arrow Functions):** Una sintaxis concisa para escribir funciones.
- **Uso en el desafío:** La función `convertirCentsAMoneda` se define utilizando una función flecha, recibiendo `centavos` y `codigoMoneda` como parámetros.

### 5. Constantes
- **Qué son:** Variables cuyo valor no se puede modificar una vez asignado.
- **Uso en el desafío:** Se declara el objeto `monedas` como una constante, ya que sus valores son fijos y no deben cambiar.

---

## Conclusión

Este desafío integra tanto nuevos conceptos como aquellos ya aprendidos. Es fundamental que:
- Entiendas cómo y cuándo utilizar operadores de comparación y el método `toFixed`.
- Sepas acceder y manipular objetos en JavaScript utilizando las notaciones adecuada.
- Reconozcas la importancia de validar datos tempranamente con un "early return" para evitar errores posteriores.
- Apliques de forma correcta los conceptos previamente cubiertos, como la interpolación de cadenas y la estructura de las funciones en JavaScript.

Estos conocimientos te permitirán no solo resolver este reto, sino también afrontar desafíos más complejos en el futuro. ¡Buena suerte y sigue practicando!
