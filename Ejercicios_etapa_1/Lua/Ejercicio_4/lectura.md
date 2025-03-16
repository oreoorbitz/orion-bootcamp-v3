# **📚 Diferencias entre JavaScript y Lua: Tipos y Condicionales**

Tanto **JavaScript** como **Lua** son lenguajes dinámicos, pero tienen diferencias clave en cómo manejan **tipos de datos**, **valores falsy y truthy**, **operadores de comparación**, y **manejo de errores**. Este ejercicio refuerza el conocimiento de estos conceptos fundamentales, permitiendo comparar ambos lenguajes.

---

## **📌 1. Tipos de Datos y `typeof` en JavaScript vs `type()` en Lua**
Ambos lenguajes tienen un sistema de **tipado dinámico**, lo que significa que no es necesario declarar el tipo de una variable. Sin embargo, JavaScript y Lua tienen algunas diferencias en su sistema de tipos.

- **JavaScript** usa `typeof` para obtener el tipo de un valor.
- **Lua** usa `type()` para obtener el tipo de un valor.

Ejemplo:
```javascript
console.log(typeof 42) // "number"
console.log(typeof "Hola") // "string"
console.log(typeof true) // "boolean"
```
```lua
print(type(42)) -- "number"
print(type("Hola")) -- "string"
print(type(true)) -- "boolean"
```

🚀 **Diferencia clave**:  
JavaScript tiene `undefined` y `null`, pero en **Lua no existe `undefined`**, solo `nil`, que representa la ausencia de un valor.

---

## **📌 2. Valores Falsy y Truthy**
Uno de los conceptos más confusos para nuevos programadores es **cuáles valores se evalúan como falsos o verdaderos en una condición**.

### 🔹 **JavaScript: Falsy vs. Truthy**
JavaScript considera los siguientes valores como **falsy**:
- `false`
- `0`
- `""` (string vacía)
- `null`
- `undefined`
- `NaN`

Todos los demás valores son **truthy**, incluyendo:
- `"Hola"`
- `[]` (arreglo vacío)
- `{}` (objeto vacío)

Ejemplo en JavaScript:
```javascript
if (0) {
  console.log("Esto NO se ejecuta");
} else {
  console.log("0 es falsy en JavaScript");
}
```

### 🔹 **Lua: Solo `false` y `nil` son falsy**
En Lua, **solo `false` y `nil` son falsy**.  
Todos los demás valores, incluyendo `0` y `""`, son truthy.

Ejemplo en Lua:
```lua
if 0 then
  print("0 es truthy en Lua")
else
  print("Esto no se ejecuta")
end
```
✔️ **Diferencia clave**: En **JavaScript `0` es falsy**, pero en **Lua `0` es truthy**.

---

## **📌 3. Comparación de Valores (`==` vs `===` en JavaScript y `==` en Lua)**
Los operadores de comparación funcionan de forma similar en ambos lenguajes, pero JavaScript tiene **coerción de tipos implícita** en `==`, lo que puede causar resultados inesperados.

### 🔹 **JavaScript: `==` vs `===`**
```javascript
console.log(0 == false) // true (coerción de tipo)
console.log(0 === false) // false (sin coerción)
console.log(null == undefined) // true
console.log(null === undefined) // false
```
- `==` en JavaScript convierte valores antes de compararlos.
- `===` es más seguro porque no hace conversión implícita.

### 🔹 **Lua: Solo Usa `==`**
```lua
print(0 == false) -- false (sin coerción)
print(nil == nil) -- true
print(0 == 0) -- true
```
Lua **no convierte tipos automáticamente en comparaciones**, por lo que es más predecible que JavaScript en este aspecto.

---

## **📌 4. Manejo de `nil` en Lua y `null`/`undefined` en JavaScript**
### 🔹 **JavaScript**
- `undefined`: Una variable declarada pero no inicializada.
- `null`: Representa la ausencia intencional de un valor.

```javascript
let x
console.log(x) // undefined
x = null
console.log(x) // null
```

### 🔹 **Lua**
- **Lua NO tiene `undefined`**, solo `nil`.
- `nil` es el equivalente de `null` en JavaScript.

```lua
local x
print(x) -- nil
x = nil
print(x) -- nil
```

**Diferencia clave**: **JavaScript tiene `undefined` y `null`, mientras que Lua solo tiene `nil`.**

---

## **📌 5. Early Return en JavaScript y Lua**
Ambos lenguajes permiten **"early return"**, un patrón donde la función **retorna antes de ejecutar más código** si se detecta un error o condición inválida.

Ejemplo en **JavaScript**:
```javascript
function dividir(a, b) {
  if (b === 0) {
    return "Error: No se puede dividir por 0";
  }
  return a / b;
}
console.log(dividir(10, 2)) // 5
console.log(dividir(10, 0)) // "Error: No se puede dividir por 0"
```

Ejemplo en **Lua**:
```lua
local function dividir(a, b)
    if b == 0 then
        return "Error: No se puede dividir por 0"
    end
    return a / b
end
print(dividir(10, 2)) -- 5
print(dividir(10, 0)) -- "Error: No se puede dividir por 0"
```
✔️ **La sintaxis es diferente, pero la lógica de "early return" funciona igual en ambos lenguajes.**

---

## **📌 6. Operadores Lógicos: `||`, `&&` y `??` en JavaScript vs. `or` y `and` en Lua**
### 🔹 **JavaScript**
```javascript
console.log(null || "Valor por defecto") // "Valor por defecto"
console.log(null ?? "Valor por defecto") // "Valor por defecto" (solo para null y undefined)
console.log(0 || "Valor por defecto") // "Valor por defecto" (porque 0 es falsy)
```

### 🔹 **Lua**
Lua usa `or` y `and` en lugar de `||` y `&&`.
```lua
print(nil or "Valor por defecto") -- "Valor por defecto"
print(0 or "Valor por defecto") -- 0 (porque 0 es truthy en Lua)
```
✔️ **Diferencia clave**: **JavaScript usa `||`, `&&`, y `??`, mientras que Lua usa `or` y `and`.**

---

## **📌 Conclusión**
JavaScript y Lua tienen muchas similitudes en su naturaleza dinámica, pero con diferencias importantes:
✅ **Lua NO tiene `undefined`, solo `nil`.**  
✅ **En JavaScript `0` es falsy, pero en Lua `0` es truthy.**  
✅ **JavaScript tiene `===` para evitar coerción de tipo, Lua no necesita esto.**  
✅ **Ambos permiten early return y operadores lógicos, pero con diferente sintaxis.**  

📌 **Al practicar en ambos lenguajes, reforzarás conceptos esenciales en la programación y mejorarás tu comprensión del funcionamiento de JavaScript.** 🚀

---
