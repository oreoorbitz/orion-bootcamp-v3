# Lectura: Comparación de Ejercicio 5 en Rust vs JavaScript

En este ejercicio se convierte una cantidad en centavos a un formato monetario. Aunque la lógica es similar, existen diferencias importantes en la forma en que se estructuran los datos y se realiza el formateo de cadenas entre Rust y JavaScript.

- escrito por chatGPt, v1

---

## 1. Estructuras de Datos Tipo Objeto

### JavaScript:
- **Objetos Literales:**
  En JavaScript se utilizan objetos literales para mapear claves a valores. Por ejemplo, el objeto `monedas` contiene los símbolos de las monedas y se accede a ellos mediante `monedas[codigoMoneda]`.

  Ejemplo:
 ```
    const monedas = {
      USD: "$",
      EUR: "€",
      GBP: "£"
    };
    // Acceso:
    return monedas[codigoMoneda] + resultadoFormateado;
```

### Rust:
- **Mapeo con "match":**
  Rust no dispone de objetos literales dinámicos como JavaScript. En cambio, se utiliza una construcción `match` para mapear claves conocidas a sus valores correspondientes.

  Ejemplo:
  ```
    let simbolo = match codigo_moneda {
        "USD" => "$",
        "EUR" => "€",
        "GBP" => "£",
        _ => return String::from("Codigo de moneda invalido"),
    };
    // Luego se concatena con el valor formateado:
    format!("{}{}", simbolo, valor_formateado);


Esta diferencia muestra cómo Rust requiere definir de manera explícita cada caso posible, mientras que JavaScript permite estructuras más flexibles.

---

## 2. Formateo y Concatenación de Cadenas

### JavaScript:
- **Formateo:**
  Se utiliza el método `toFixed(2)` para formatear números a dos decimales.
- **Concatenación:**
  Se pueden usar template literals o el operador `+` para combinar el símbolo de la moneda con el valor formateado.

  Ejemplo:
  ```
    const resultadoFormateado = (centavos / 100).toFixed(2);
    return `${monedas[codigoMoneda]}${resultadoFormateado}`;

### Rust:
- **Formateo:**
  Se utiliza la macro `format!` con el especificador `"{:.2}"` para formatear el número a dos decimales.
- **Concatenación:**
  Se utiliza `format!` para construir el string final que une el símbolo y el valor formateado.

  Ejemplo:
  ```
    let valor_formateado = format!("{:.2}", valor);
    format!("{}{}", simbolo, valor_formateado);

---

## Conclusión

Las diferencias principales entre en Rust y en JavaScript para este ejercicio se centran en:

- **Estructuras de Datos:**  
  JavaScript usa objetos literales dinámicos, mientras que Rust utiliza un `match` para mapear claves a valores de manera explícita.

- **Formateo y Concatenación:**  
  Cada lenguaje emplea mecanismos distintos para formatear números y construir cadenas. JavaScript utiliza `toFixed(2)` y template literals o concatenación con `+`, mientras que Rust utiliza `format!`.

Estas diferencias reflejan la naturaleza de cada lenguaje: JavaScript ofrece mayor flexibilidad, mientras que Rust exige un manejo más explícito y seguro de los datos. ¡Sigue practicando para dominar estas variaciones y fortalecer tu habilidad para trasladar conceptos entre lenguajes!
