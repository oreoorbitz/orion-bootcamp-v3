# Lectura: Conversión de Centavos a Formato Monetario en Lua

En este ejercicio, implementamos una función en Lua que convierte una cantidad en centavos a un formato monetario. Aunque comparte la misma lógica que la versión en JavaScript, existen diferencias específicas en la sintaxis y ciertas funciones incorporadas. A continuación, se destacan las diferencias clave sin repetir los conceptos generales ya abordados en la Lectura 4.

---

## Diferencias Específicas para la Conversión Monetaria

### 1. Formateo de Números
- **JavaScript:**  
  - Se utiliza el método `toFixed(2)` para formatear un número a dos decimales.
  - Ejemplo:
    ```js
    const resultadoFormateado = (centavos / 100).toFixed(2)
    ```
- **Lua:**  
  - Se usa `string.format("%.2f", valor)` para lograr el mismo efecto.
  - Ejemplo:
    ```lua
    local resultadoFormateado = string.format("%.2f", resultado)
    ```

### 2. Concatenación de Cadenas
- **JavaScript:**  
  - Se pueden usar template literals o el operador `+` para concatenar strings.
  - Ejemplo:
    ```js
    return `${monedas[codigoMoneda]}${resultadoFormateado}`
    ```
- **Lua:**  
  - La concatenación se realiza con el operador `..`.
  - Ejemplo:
    ```lua
    return monedas[codigoMoneda] .. resultadoFormateado
    ```

### 3. Declaración de Funciones y Tablas
- **JavaScript:**  
  - Se declara la función mediante funciones flecha o declaraciones tradicionales.
  - Los objetos se definen con la sintaxis de llaves.
- **Lua:**  
  - Se usa `local function` para definir funciones.
  - Las tablas se definen con una sintaxis similar a los objetos, pero sin comas obligatorias al final de cada par clave-valor.
  - Ejemplo de tabla:
    ```lua
    local monedas = {
      USD = "$",
      EUR = "€",
      GBP = "£"
    }
    ```

---

## Resumen

- **Formateo de Números:**  
  Lua utiliza `string.format` en lugar de `toFixed` para dar formato a los números.
  
- **Concatenación:**  
  En Lua se usa `..` para unir cadenas, en contraste con la interpolación o el operador `+` en JavaScript.

- **Sintaxis de Funciones y Tablas:**  
  Lua emplea `local function` y define tablas con una sintaxis ligeramente distinta a los objetos de JavaScript.

Estas diferencias resaltan cómo la misma lógica puede implementarse en distintos lenguajes, adaptándose a las particularidades sintácticas de cada uno. ¡Sigue practicando para dominar estas variaciones y fortalecer tu capacidad de trasladar conceptos entre lenguajes!

