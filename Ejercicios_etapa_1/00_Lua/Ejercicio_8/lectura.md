# 📚 Lectura: Diferencias entre Módulos en Lua y en JavaScript (Node.js)

En este ejercicio aprendiste a importar y exportar archivos Lua de forma manual, algo que, aunque conceptualmente se parece a JavaScript, tiene diferencias importantes en su implementación.

Aquí comparamos los dos enfoques:

---

## 1. ¿Qué es un módulo?

Tanto en **Lua** como en **Node.js**, un módulo es simplemente **un archivo que retorna algo** (una tabla, función, objeto, clase, etc.) que puede ser **importado** por otros archivos.

La diferencia principal está en **cómo se hace la exportación e importación**.

---

## 2. Exportar en Lua vs. Node.js

**En Lua**:
- Todo módulo debe terminar con **`return`** seguido del valor que quieres exportar (normalmente una tabla o una función).
- Solo puedes hacer **un único `return`** en el archivo principal.
- Ejemplo:
  - `return { miFuncion = miFuncion }`
  - o directamente `return miFuncion` si solo exportas una función.

**En Node.js (modo módulos)**:
- Usas **`export`** explícitamente para cada función, constante o clase que quieras exportar.
- Puedes hacer **muchas exportaciones** en un mismo archivo.
- Ejemplo:
  - `export function miFuncion() {}` 
  - `export const MI_CONSTANTE = 123`
- También puedes usar **`export default`** para indicar un único valor principal que el archivo exporta.

---

## 3. Importar en Lua vs. Node.js

**En Lua**:
- Para importar algo usas la función especial **`require`**.
- La sintaxis básica es `local miModulo = require("ruta/al/modulo")`.
- **Importas todo lo que el archivo haya retornado** (no puedes elegir sólo una función específica sin modificar el archivo).
- Lua **busca los módulos** en rutas relativas o configuradas en su `package.path`.

**En Node.js (modo módulos)**:
- Usas la palabra clave **`import`**.
- Puedes importar de manera muy flexible:
  - `import { miFuncion } from './modulo.js'`
  - `import miValor from './modulo.js'` (si fue un `export default`)
- Node.js **resuelve las rutas** automáticamente según el sistema de archivos y `package.json`.

---

## 4. Organización del código

- **Lua** generalmente exporta una **tabla** que agrupa varias funciones (`return { funcionA = funcionA, funcionB = funcionB }`).
- **JavaScript** permite exportar varias funciones sueltas o agruparlas también en un objeto, pero es más flexible.

---

## 5. Concepto clave: Return vs Export

- En **Lua**, piénsalo como **"un archivo debe devolver su contenido"**.
- En **JavaScript**, piénsalo como **"puedo marcar varios elementos que quiero exportar"**.

En otras palabras:
- Lua = `El archivo mismo es el módulo (return final único)`.
- JavaScript = `Cada función, constante o clase puede ser un módulo (export explícito)`.

---

## 6. Resumen rápido

| Característica         | Lua (`require` y `return`)                 | JavaScript (`import` y `export`)    |
|:------------------------|:-------------------------------------------|:------------------------------------|
| Palabra clave de importar | `require`                                | `import`                           |
| Palabra clave de exportar | `return` (final del archivo)              | `export` o `export default`         |
| Puede exportar múltiples cosas | No directamente (retornas una tabla) | Sí, puedes exportar varias funciones o valores |
| Sintaxis modular        | Basada en funciones y tablas              | Basada en módulos ES (ECMAScript Modules)  |
| Separación de valores   | No existe nativamente                     | Existe separación explícita        |

---

# ✅ Conclusión

Aunque la idea de dividir el código en varios archivos es común a ambos lenguajes, **Lua mantiene una filosofía más simple y manual**, mientras que **JavaScript ofrece una sintaxis más poderosa y flexible** para gestionar múltiples exportaciones e importaciones.
