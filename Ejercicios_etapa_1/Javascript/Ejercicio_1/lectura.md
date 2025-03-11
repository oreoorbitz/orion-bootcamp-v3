# **📚 Introducción a JavaScript y Conceptos Clave del Ejercicio 1**

## **¿Qué es JavaScript?**
JavaScript es un lenguaje de programación creado en los años 90 para hacer que las páginas web fueran interactivas. Con el tiempo, ha evolucionado hasta convertirse en uno de los lenguajes **más utilizados en el mundo**, expandiéndose más allá de los navegadores hacia servidores, aplicaciones móviles y desarrollo de software en general.

Aunque JavaScript fue diseñado para ejecutarse en navegadores, **en este curso lo ejecutaremos en la terminal usando Node.js**. Node.js es un entorno que permite ejecutar JavaScript fuera del navegador, ampliando sus capacidades y convirtiéndolo en un lenguaje **de propósito general**.

---

## **📌 ¿Qué Aprendemos en Este Ejercicio?**
Este ejercicio introduce varios conceptos fundamentales de JavaScript:

### **1️⃣ Tipado Dinámico**
JavaScript es un **lenguaje de tipado dinámico**, lo que significa que **no es necesario declarar el tipo de dato de una variable**. En este ejercicio, la función recibe un número (`anios`), pero no necesitamos especificar que es un número; JavaScript lo determina automáticamente.

En otros lenguajes como **Rust o Java**, tendríamos que declarar el tipo explícitamente.

---

### **2️⃣ Comentarios con JSDoc**
Para ayudar a los programadores y editores como **VS Code** a entender el código, usamos **JSDoc**, un sistema de comentarios estructurados. 

Ejemplo del JSDoc en este ejercicio:
```js
/**
 * @param {} años - La edad en años
 * @returns {} La edad en días
 */
```
- Esto permite que **VS Code nos muestre advertencias** si usamos la función incorrectamente.
- En proyectos grandes, ayuda a los equipos de desarrollo a entender cómo usar cada función.

---

### **3️⃣ `console.log()`: Imprimir en la Consola**
En este ejercicio usamos:
```js
console.log(resultado);
```
- En los navegadores, `console.log()` se usa para imprimir información en la **consola del desarrollador**.
- **Gracias a Node.js**, podemos usar `console.log()` para imprimir en la **terminal** en lugar del navegador.

Esto nos permite probar y depurar código JavaScript sin necesidad de una página web.

---

### **4️⃣ Funciones en JavaScript**
Este ejercicio introduce **funciones en JavaScript**, que son bloques de código reutilizables.  
Aquí declaramos una función con la palabra clave `function`:
```js
export function edadEnDias(anios) { ... }
```
- La función toma un número (`anios`) como argumento.
- Calcula la cantidad de días multiplicándolo por **365**.
- Retorna el resultado.

Las funciones en JavaScript pueden ser **declaraciones de función**, **expresiones de función** o **arrow functions** (`()=>{}`). Aprenderemos más sobre esto en ejercicios futuros.

---

## **📌 Conclusión**
En este ejercicio:
✅ **Ejecutamos JavaScript en la terminal con Node.js**.  
✅ **Exploramos el tipado dinámico** (sin declarar tipos explícitos).  
✅ **Usamos `console.log()` para ver el resultado** en la terminal.  
✅ **Usamos comentarios JSDoc para mejorar la documentación**.  
✅ **Escribimos una función sencilla** para calcular valores numéricos.

🚀 **¡Sigue practicando y pronto dominarás los fundamentos de JavaScript!**
