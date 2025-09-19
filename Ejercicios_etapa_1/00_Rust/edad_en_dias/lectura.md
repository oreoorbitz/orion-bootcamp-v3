# **📚 Diferencias entre JavaScript y Rust: Una Introducción**

JavaScript y Rust son dos lenguajes de programación muy distintos, tanto en su **sintaxis** como en su **modelo de ejecución** y **tipado**. Mientras que JavaScript es un lenguaje **dinámico e interpretado**, Rust es **estático y compilado**, lo que introduce diferencias fundamentales en cómo se manejan las variables, funciones y memoria.

A pesar de estas diferencias, explorar Rust nos permite entender mejor los conceptos de **tipado estático**, **gestión de memoria** y **seguridad en el código**, elementos que pueden ayudar a escribir mejor código en JavaScript.

---

## **📌 1. Declaración de Funciones**
Tanto **JavaScript** como **Rust** usan la palabra clave `fn` para definir funciones, pero hay diferencias importantes:

- **JavaScript** permite definir funciones con `function`, `const nombre = function() {}`, o `const nombre = () => {}`.
- **Rust** usa `fn nombre()` y requiere definir **tipos de parámetros y de retorno** de manera explícita.

En JavaScript, los tipos son **dinámicos** y no se especifican. En Rust, cada parámetro y el valor de retorno deben tener un **tipo estático** como `i32` o `String`.

Otra diferencia es que en **JavaScript**, `return` es opcional en funciones de una línea con `=>`, mientras que en Rust **el último valor evaluado se retorna automáticamente si no hay `;`**.

---

## **📌 2. Declaración de Variables**
JavaScript permite definir variables con `var`, `let`, y `const`, mientras que en Rust se usa `let`:

- **JavaScript**:
  - `var nombre = "Juan"` (obsoleto, alcance de función)
  - `let nombre = "Juan"` (recomendado, alcance de bloque)
  - `const nombre = "Juan"` (constante, no puede reasignarse)

- **Rust**:
  - `let nombre = "Juan";` (mutable por defecto si se usa `mut`)
  - `const NOMBRE: &str = "Juan";` (debe declararse con tipo explícito)

Una diferencia clave es que en **Rust las variables son inmutables por defecto**, lo que significa que no pueden cambiar su valor a menos que se agregue `mut` (`let mut nombre = "Juan";`).

---

## **📌 3. Tipado Estático vs. Tipado Dinámico**
JavaScript **no requiere declarar tipos** y permite cambiar el tipo de una variable en cualquier momento:

```js
let edad = 25;
edad = "veinticinco"; // Esto es válido en JavaScript
```

Rust, en cambio, **tiene tipado estático**, lo que significa que el tipo de cada variable se define en tiempo de compilación y no puede cambiar:

```rust
let edad: i32 = 25;
// edad = "veinticinco"; // ❌ Error en Rust: no se puede cambiar de i32 a string
```

El **tipado fuerte de Rust evita errores** que JavaScript permite, como comparar números con strings (`"5" == 5` es `true` en JavaScript debido a la conversión implícita).

---

## **📌 4. Comentarios**
La sintaxis de comentarios es similar en ambos lenguajes:

- **JavaScript**:
  - `// Comentario de una línea`
  - `/* Comentario de varias líneas */`

- **Rust**:
  - `// Comentario de una línea`
  - `/* Comentario de varias líneas */`
  - `/// Comentario para documentación de funciones`

Rust tiene `///`, que se usa para generar documentación automática con `cargo doc`.

---

## **📌 5. Retorno de Valores en Funciones**
En JavaScript, las funciones siempre necesitan `return` si queremos devolver un valor:

```js
function sumar(a, b) {
    return a + b;
}
```

En Rust, el `return` es opcional si la última línea de la función **no tiene `;`**:

```rust
fn sumar(a: i32, b: i32) -> i32 {
    a + b // Devuelve implícitamente sin `return`
}
```

Si agregamos `;`, Rust lo trataría como una instrucción sin valor de retorno y daría un error.

---

## **📌 6. Imprimir en la Consola**
Para imprimir valores en la consola:

- **JavaScript** usa `console.log()`.
- **Rust** usa `println!()`.

Ejemplo:

```js
console.log("Hola, mundo!");
```

```rust
println!("Hola, mundo!");
```

Rust usa `!` en `println!()`, porque en realidad es **una macro, no una función**.

---

## **📌 7. Pruebas Unitarias**
Ambos lenguajes tienen soporte para **pruebas unitarias**:

- **JavaScript** usa `Vitest`, `Jest` u otros frameworks.
- **Rust** tiene un sistema de pruebas **incorporado**.

Prueba en JavaScript con **Vitest**:

```js
import { expect, test } from "vitest";

test("sumar", () => {
  expect(sumar(2, 3)).toBe(5);
});
```

Prueba en Rust:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_suma() {
        assert_eq!(sumar(2, 3), 5);
    }
}
```

Rust incluye las pruebas dentro del mismo archivo usando `#[cfg(test)]`.

---

## **📌 8. Manejo de Memoria**
Uno de los aspectos más importantes que diferencia **Rust de JavaScript** es el **manejo de memoria**:

- **JavaScript** tiene un **recolector de basura (garbage collector)** que administra la memoria automáticamente.
- **Rust** usa **propiedad y préstamo de memoria** (`ownership & borrowing`), lo que evita fugas de memoria sin necesidad de un garbage collector.

Ejemplo de **propiedad en Rust**:

```rust
fn main() {
    let texto = String::from("Hola");
    let nuevo_texto = texto; // texto ya no es válido aquí
}
```

En JavaScript, podríamos asignar variables sin preocuparnos por la propiedad:

```js
let texto = "Hola";
let nuevoTexto = texto; // No hay problemas de propiedad
```

Este sistema de **propiedad** en Rust previene errores de acceso a memoria y mejora la seguridad.

---

## **📌 9. ¿Qué Hace a JavaScript Especial?**
JavaScript es **más flexible y dinámico**, pero Rust es **más seguro y eficiente**.  
Ambos tienen sus ventajas:

✅ **JavaScript es más accesible**: No necesita compilación y se ejecuta en cualquier navegador.  
✅ **Rust es más rápido**: Se compila a código máquina y ofrece alto rendimiento sin un garbage collector.  
✅ **JavaScript es asincrónico**: Tiene `async/await` y `setTimeout()`, mientras que Rust usa `tokio` para asincronía.  
✅ **Rust es seguro en memoria**: Evita `null` y fugas de memoria sin un garbage collector.

---

## **📌 Conclusión**
JavaScript y Rust son lenguajes poderosos, pero con **enfoques opuestos**:

- **JavaScript** es dinámico, flexible y fácil de usar en la web.
- **Rust** es estricto, eficiente y seguro en memoria.

Si bien JavaScript permite escribir código rápido sin preocuparse por la memoria, Rust ofrece herramientas más avanzadas para controlar el rendimiento y evitar errores comunes.

🚀 **¡Dominar ambos lenguajes te dará una visión más profunda de la programación
