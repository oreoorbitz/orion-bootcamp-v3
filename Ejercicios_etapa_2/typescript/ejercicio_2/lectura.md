# Clasificación de Tokens

Cuando tokenizamos un HTML, obtenemos una lista de fragmentos:  
algunos son etiquetas (`<div>`, `<img />`) y otros son texto (`Hello`, `World`).

Sin embargo, **sólo dividir el texto no es suficiente** para construir estructuras complejas.  
Antes de poder crear un árbol (como el DOM del navegador),  
**necesitamos entender qué representa cada token**.

---

## ¿Qué es clasificar un token?

Clasificar un token significa **asignarle un tipo específico** según su forma:

| Tipo | Ejemplo | Explicación |
|:----|:--------|:------------|
| Apertura | `<div>` | Comienza un nuevo elemento |
| Cierre | `</div>` | Termina un elemento abierto |
| Autocierre | `<img />` | Elemento completo que no tiene hijos |
| Texto | `Hello`, `World` | Contenido textual entre etiquetas |

---

## ¿Cómo detectarlo?

Podemos basarnos en **simples reglas visuales**:

- Si comienza con `<` pero **no** con `</` y **no** termina en `/>`, es una **apertura**.
- Si comienza con `</`, es un **cierre**.
- Si termina con `/>`, es un **autocierre**.
- Si no tiene `<` ni `>`, es **texto**.

Estas reglas se pueden detectar con **condicionales simples** o pequeñas expresiones regulares.

---

## ¿Qué vamos a construir?

Vas a crear una función que:

- **Recibe**: una lista de strings (los tokens del Módulo 1).
- **Devuelve**: una lista de objetos que describen cada token con:
  - Su `tipo`
  - Su `nombre` (sólo para etiquetas)
  - Su `contenido` (sólo para textos)

---

## Resumen visual

De esta entrada:

```js
["<div>", "Hello ", "<span>", "World", "</span>", "</div>"]
```

Queremos construir:

```js
[
  { tipo: "apertura", nombre: "div", contenido: null },
  { tipo: "texto", nombre: null, contenido: "Hello " },
  { tipo: "apertura", nombre: "span", contenido: null },
  { tipo: "texto", nombre: null, contenido: "World" },
  { tipo: "cierre", nombre: "span", contenido: null },
  { tipo: "cierre", nombre: "div", contenido: null }
]
```

```mermaid
    flowchart TD
    A["HTML crudo:<br><code>&lt;div&gt;Hello &lt;span&gt;World&lt;/span&gt;&lt;/div&gt;</code>"]

    B1["Token:<br><code>&lt;div&gt;</code>"]
    B2["Token:<br><code>Hello </code>"]
    B3["Token:<br><code>&lt;span&gt;</code>"]
    B4["Token:<br><code>World</code>"]
    B5["Token:<br><code>&lt;/span&gt;</code>"]
    B6["Token:<br><code>&lt;/div&gt;</code>"]

    C1["Clasificado:<br>{ tipo: 'apertura', nombre: 'div' }"]
    C2["Clasificado:<br>{ tipo: 'texto', contenido: 'Hello ' }"]
    C3["Clasificado:<br>{ tipo: 'apertura', nombre: 'span' }"]
    C4["Clasificado:<br>{ tipo: 'texto', contenido: 'World' }"]
    C5["Clasificado:<br>{ tipo: 'cierre', nombre: 'span' }"]
    C6["Clasificado:<br>{ tipo: 'cierre', nombre: 'div' }"]

    A --> B1 --> C1
    A --> B2 --> C2
    A --> B3 --> C3
    A --> B4 --> C4
    A --> B5 --> C5
    A --> B6 --> C6
  ```