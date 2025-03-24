# Lectura: Diferencias entre los Ejercicios en Rust y JavaScript

En este ejercicio se implementan dos funciones en Rust: `division_segura` y `valor_seguro`. Estas funciones tienen objetivos similares a los ejercicios en JavaScript, pero las diferencias en el sistema de tipos y el manejo de errores de Rust introducen conceptos distintos. A continuación, se explican las diferencias clave:

---

## 1. Sistema de Tipos Estático vs. Dinámico

### JavaScript:
- **Sistema Dinámico:**  
  Los tipos se determinan en tiempo de ejecución. Por ello, es común usar `typeof` para comprobar el tipo de una variable, y los valores pueden ser "truthy" o "falsy".  
- **Comparaciones de Tipos:**  
  JavaScript permite comparaciones implícitas y coerción de tipos (por ejemplo, `==` vs `===`), lo que puede llevar a resultados inesperados.

### Rust:
- **Sistema Estático y Estricto:**  
  Los tipos se conocen en tiempo de compilación, lo que elimina la necesidad de comprobaciones de tipo en tiempo de ejecución.  
- **Conversión y Validación:**  
  Rust utiliza el sistema de resultados (`Result<T, E>`) y las opciones (`Option<T>`) para manejar errores y casos donde el valor puede estar ausente. Esto evita problemas comunes en lenguajes dinámicos, como la coerción implícita.

---

## 2. Manejo de Errores

### JavaScript:
- Los errores a menudo se manejan devolviendo strings de error o usando excepciones.
- Las funciones pueden retornar valores como `"Error: ..."` directamente, y el manejo se hace mediante condicionales.

### Rust:
- **Resultados y Early Return:**  
  En Rust, se utiliza el tipo `Result<T, E>` para manejar operaciones que pueden fallar. Esto obliga a que se manejen los casos de error explícitamente en tiempo de compilación.
  - En `division_segura`, se devuelve `Err(String)` cuando el divisor es 0.
- **Opciones para Valores Ausentes:**  
  El uso de `Option<T>` permite representar valores que pueden o no estar presentes. La función `valor_seguro` usa `Option` para diferenciar entre un valor presente (`Some`) y la ausencia de valor (`None`).

---

## 3. Evaluación de Condiciones y Early Returns

### JavaScript:
- Se utilizan if/else con comparaciones de tipos y validaciones para controlar el flujo del programa.
- El concepto de "early return" se implementa mediante sentencias `if` que retornan un valor de error antes de continuar.

### Rust:
- **Early Return en Rust:**  
  Se utiliza de manera similar a JavaScript. Si se detecta una condición no válida (como el divisor siendo 0), se retorna inmediatamente con `Err(...)`.
- **No Existe Concepto de Truthy/Falsy:**  
  En Rust, solo se aceptan valores booleanos (`true` o `false`) en condiciones. No hay conversión implícita de otros tipos a booleanos, lo que hace que las evaluaciones sean más explícitas y seguras.

---

## 4. Ejemplo Comparativo

- **En JavaScript:**  
  Se podría implementar una función para dividir números y manejar errores devolviendo strings.  
- **En Rust:**  
  La función `division_segura` utiliza `Result<f64, String>` para garantizar que se manejen correctamente los casos de error, eliminando ambigüedades.

Asimismo, la función `valor_seguro` en Rust usa un `match` sobre una `Option<T>`, lo que es equivalente a manejar `null` o `undefined` en JavaScript, pero de forma mucho más segura y explícita.

---

## Conclusión

Debido a su sistema de tipos estático y estrictamente comprobado en tiempo de compilación, Rust evita muchas de las trampas comunes en JavaScript relacionadas con la coerción de tipos y la evaluación implícita de valores. Los mecanismos de manejo de errores y de valores ausentes (`Result` y `Option`) hacen que el código en Rust sea más predecible y robusto, aunque requieren un enfoque más explícito en la gestión de errores y validaciones.

Esta diferencia fundamental en el diseño y la filosofía de cada lenguaje es clave para entender por qué ciertos conceptos (como `typeof`, truthy/falsy, y coerción implícita) no son necesarios en Rust, mientras que se utilizan extensamente en JavaScript.
