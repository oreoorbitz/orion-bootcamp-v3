# Lectura: Comparación de Ejercicio 7 en Rust vs. JavaScript

Este ejercicio explora el patrón Factory y el patrón PubSub en dos lenguajes muy distintos: JavaScript y Rust. Aunque ambos ejercicios cumplen funciones similares, existen diferencias fundamentales en la implementación debido a la naturaleza de cada lenguaje. A continuación se explican los conceptos y métodos clave necesarios para completar el ejercicio en Rust, comparándolos con la versión en JavaScript.

## 1. Creación de Objetos y Patrones Factory

**JavaScript:**
- Utiliza funciones constructoras y prototipos o, en versiones modernas, clases para crear objetos.
- El patrón Factory se implementa mediante una función que retorna un nuevo objeto con propiedades (por ejemplo, nombre y rol) y métodos definidos en el prototipo.
- Ejemplo: Se crea un objeto Usuario con un método "saludar" que retorna "Hola, soy <nombre> y soy <rol>".

**Rust:**
- Se usan structs para definir la estructura de los datos y bloques impl para definir métodos asociados.
- La función factory se implementa creando una función (por ejemplo, `crear_usuario_con_factory`) que retorna una instancia de un struct `Usuario`.
- En Rust, la creación de objetos es más explícita porque se deben especificar los tipos de los campos y se utilizan métodos como `new` para instanciar.

## 2. Patrón PubSub

**JavaScript:**
- Se implementa usando clases y prototipos.
- El objeto PubSub contiene una propiedad (por ejemplo, TOPICS) y métodos como `suscribirse` y `publicar` que manejan callbacks para eventos.
- La suscripción retorna un objeto con un método `remover` para cancelar la suscripción.

**Rust:**
- Se utiliza un struct (por ejemplo, `PubSub`) para almacenar los eventos y sus escuchadores en una estructura como un HashMap.
- Los métodos de PubSub se definen en un bloque impl. Los escuchadores se almacenan como closures (usando Box<dyn Fn(&Info)>).
- La suscripción retorna una estructura (por ejemplo, `Suscripcion`) que contiene la información necesaria para eliminar el escuchador posteriormente.
- Se utilizan métodos como `new`, `suscribirse` y `publicar` para lograr la misma funcionalidad.
- Rust requiere manejar de forma explícita la mutabilidad y los tipos de datos, lo que aporta seguridad en tiempo de compilación.

## 3. Conceptos Clave y Métodos en Rust

- **Structs e Impl:**  
  Definir estructuras de datos (como `Usuario` y `PubSub`) y asociar métodos usando bloques `impl`. Esto reemplaza el uso de prototipos y clases en JavaScript.

- **Tipos y Seguridad:**  
  Rust es un lenguaje estáticamente tipado, lo que significa que todos los campos y métodos deben tener tipos explícitos. Esto mejora la seguridad del código pero requiere una definición más detallada.

- **Closures y Box:**  
  Para almacenar funciones (escuchadores) en el patrón PubSub, se usan closures encapsulados en `Box<dyn Fn(&Info)>`, permitiendo almacenar funciones de diferentes orígenes en una misma colección.

- **HashMap:**  
  Se usa para mapear eventos (keys) a vectores de escuchadores (values). Esto permite simular la lista de eventos (topics) similar a un objeto en JavaScript.

- **Manejo de Mutabilidad:**  
  En Rust, se debe definir explícitamente la mutabilidad (por ejemplo, en el struct PubSub, la tabla de temas se modifica durante las suscripciones y publicaciones).

- **Pruebas Unitarias Integradas:**  
  Rust permite incluir pruebas en el mismo archivo usando módulos marcados con `#[cfg(test)]`, lo que facilita la verificación del comportamiento de la implementación, similar a los frameworks de pruebas en JavaScript (como Jest o Vitest).

## Conclusión

La versión en Rust del ejercicio de patrón Factory y PubSub ilustra cómo se pueden implementar conceptos de programación orientada a objetos y patrones de diseño en un lenguaje fuertemente tipado y compilado. Mientras que en JavaScript se apoya en la flexibilidad de los prototipos y clases, en Rust se utilizan structs, bloques impl y colecciones como HashMap para lograr funcionalidad similar. Esta diferencia destaca la importancia de entender las particularidades de cada lenguaje para adaptar patrones de diseño de manera efectiva.
