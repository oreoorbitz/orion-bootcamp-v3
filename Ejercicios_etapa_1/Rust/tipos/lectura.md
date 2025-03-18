---
# **📚 Diferencias en el Manejo de Tipos: JavaScript vs. Rust**

En este ejercicio, exploraremos cómo cada lenguaje maneja los **tipos de datos** y qué implica su uso en la programación. Aunque ambos lenguajes permiten realizar operaciones matemáticas y trabajar con cadenas, difieren significativamente en la manera en que se gestionan los tipos.

---

## **1. Tipado Dinámico vs. Tipado Estático**

### **JavaScript: Tipado Dinámico**
- No es necesario declarar el tipo de una variable.
- Una misma variable puede cambiar de tipo en tiempo de ejecución.
- Se utiliza el operador `typeof` para obtener el tipo de un valor en tiempo de ejecución.
- Ejemplo conceptual:
  - Una variable puede empezar siendo un número y luego convertirse en una cadena, lo que aporta flexibilidad pero también puede introducir errores inesperados.

### **Rust: Tipado Estático**
- Cada variable debe tener un **tipo definido** en tiempo de compilación.
- Una vez asignado, el tipo de una variable no puede cambiar.
- Rust no tiene un operador equivalente a `typeof` en tiempo de ejecución; en su lugar, el compilador verifica y garantiza la consistencia de tipos.
- Ejemplo conceptual:
  - Si declaras una variable como un entero (`i32`), siempre será un entero, y cualquier intento de cambiar su tipo causará un error de compilación.

---

## **2. Declaración de Variables**

### **JavaScript**
- Se pueden declarar variables con `var`, `let` o `const`.
- `var` tiene alcance de función, mientras que `let` y `const` tienen alcance de bloque.
- La declaración de variables es flexible, lo que permite cambios de tipo sin advertencia.

### **Rust**
- Se declara una variable con `let` y, si es mutable, se utiliza `mut`.
- Las variables son **inmutables por defecto**, lo que ayuda a prevenir errores.
- Ejemplo conceptual:
  - `let x = 10;` asigna un entero y `x` no puede cambiar de tipo ni valor (a menos que se use `mut`).

---

## **3. Conversión de Tipos y Seguridad**

### **JavaScript**
- Permite conversiones implícitas de tipos; por ejemplo, `"5" * 2` se convierte en `10`.
- Esta conversión automática puede generar comportamientos inesperados.
- Se deben utilizar funciones de conversión explícitas para mayor seguridad.

### **Rust**
- No permite conversiones implícitas; todas las conversiones deben ser explícitas usando el operador `as`.
- Esto aumenta la **seguridad en el código** al evitar errores de conversión inesperados.
- Ejemplo conceptual:
  - Convertir un entero a decimal requiere escribir algo como `valor as f64`, lo que hace evidente la intención del programador.

---

## **4. Comparación de Operadores de Tipos**

### **JavaScript**
- Utiliza `typeof` para consultar el tipo en tiempo de ejecución.
- Los operadores de comparación (`==` vs. `===`) pueden dar resultados confusos debido a la coerción de tipos.
- Ejemplo conceptual:
  - `"5" == 5` es `true`, mientras que `"5" === 5` es `false`.

### **Rust**
- El sistema de tipos es verificado en tiempo de compilación, evitando errores comunes.
- No se necesita un operador como `typeof` porque el compilador ya garantiza la coherencia.
- Comparar valores de distintos tipos simplemente no compila, evitando errores lógicos.

---

## **5. Manejo de Memoria y Valores Nulos**

### **JavaScript**
- Posee un recolector de basura (garbage collector) que administra la memoria automáticamente.
- Tiene dos conceptos para la ausencia de valor: `null` (ausencia intencional) y `undefined` (valor no asignado).

### **Rust**
- No tiene un garbage collector; utiliza el sistema de **propiedad y préstamo (ownership & borrowing)** para gestionar la memoria de forma segura.
- En lugar de `null` o `undefined`, Rust utiliza el enum `Option<T>` para representar la presencia o ausencia de un valor, forzando al programador a manejar explícitamente los casos en los que un valor podría estar ausente.

---

## **6. Conclusión**
- **JavaScript** es flexible y permite escribir código rápidamente, pero esta flexibilidad puede conducir a errores inesperados debido a la conversión implícita de tipos y la falta de chequeo en tiempo de compilación.
- **Rust**, con su tipado estático y gestión de memoria segura, obliga a los desarrolladores a ser explícitos con los tipos, lo que resulta en un código más robusto y menos propenso a errores, aunque con una curva de aprendizaje inicial más pronunciada.

🚀 **¡Entender estas diferencias te ayudará a aplicar los conceptos universales de tipado y seguridad en la programación, y te dará una base sólida para utilizar cada lenguaje de manera efectiva!**
---
