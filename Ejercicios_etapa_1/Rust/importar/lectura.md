# Lectura: Diferencias entre Exports/Imports en Rust y en Node.js con Modules

Cuando trabajamos con múltiples archivos, tanto en **Node.js** (usando `import/export`) como en **Rust** (usando `mod` y `use`), necesitamos organizar y conectar nuestro código.  
Sin embargo, la forma en que cada lenguaje maneja la modularización es **bastante diferente**.

---

## 1. ¿Cómo funcionan los módulos en Node.js?

- Node.js usa **import** y **export** basados en ES Modules (ECMAScript Modules).
- Cuando exportas algo en un archivo `.js`, estás **declarando explícitamente** qué quieres exponer.
- Cuando importas algo, **importas exactamente lo que necesitas**.

**Ejemplo en Node.js:**

En `utils.js`:
- Para exportar funciones:
  - `export function getProductHandles(products) { ... }`
  - `export function getProductIds(products) { ... }`

En `main.js`:
- Para importar funciones:
  - `import { getProductHandles, getProductIds } from './utils.js'`

Notas importantes:
- Los archivos tienen **extensión explícita** `.js`.
- Cada exportación e importación es explícita, por nombre.
- Los imports siempre usan **rutas relativas** (`./` o `../`) a menos que estés importando desde `node_modules`.

---

## 2. ¿Cómo funcionan los módulos en Rust?

- Rust organiza el código en **módulos** (`mod`) y usa **`use`** para importar lo que necesitas.
- Un módulo es simplemente **un archivo o carpeta** que Rust entiende como parte del proyecto.
- Rust no usa extensiones `.rs` en las declaraciones `mod` o `use`.
- Los módulos son **declarados primero** usando `mod`, luego puedes hacer `use` para traer funciones o estructuras específicas.

**Ejemplo en Rust:**

En `utils.rs`:
- Para definir funciones públicas:
  - `pub fn get_product_handles(products: &[Product]) -> Vec<String> { ... }`
  - `pub fn get_product_ids(products: &[Product]) -> Vec<u32> { ... }`

En `main.rs`:
- Para declarar el módulo:
  - `mod utils;`
- Para importar las funciones:
  - `use utils::{get_product_handles, get_product_ids};`

Notas importantes:
- Necesitas primero declarar el módulo con `mod` para que Rust sepa que debe buscar un archivo `utils.rs`.
- La palabra clave `pub` es **obligatoria** para hacer visible una función o estructura fuera del archivo donde fue definida.
- No se especifica la extensión `.rs` al importar.

---

## 3. Resumen de las diferencias principales

| Característica                  | Node.js (ES Modules)                       | Rust (Modules)                    |
|----------------------------------|-------------------------------------------|----------------------------------|
| Declaración de módulo            | Implícita (por importación de archivo)     | Explícita (`mod nombre`)         |
| Exportar función/estructura      | `export` palabra clave                    | `pub` palabra clave              |
| Importar función/estructura      | `import { nombre } from './archivo.js'`    | `use modulo::nombre`             |
| Extensión de archivo necesaria   | Sí (`.js`)                                 | No (Rust infiere `.rs`)          |
| Organización recomendada         | Modular pero flexible                     | Modular y estrictamente jerárquico |
| Control de visibilidad           | Todo exportado explícitamente             | Todo es privado a menos que uses `pub` |

---

## 4. Conceptos clave para recordar en Rust

- En Rust, **nada es público por defecto**. Todo es privado hasta que uses `pub`.
- Para usar funciones de otro archivo:
  - Primero necesitas declarar `mod nombre_modulo;`.
  - Después puedes hacer `use nombre_modulo::funcion;`.
- En proyectos grandes, la organización en módulos es esencial para mantener el código limpio y eficiente.

---

## 5. ¿Por qué importa esta diferencia?

- Rust y JavaScript reflejan **dos filosofías diferentes**:
  - **JavaScript** busca ser flexible y amigable para el prototipado rápido.
  - **Rust** busca ser explícito y seguro, especialmente en proyectos de mayor escala donde la claridad de las dependencias es crítica.

Aprender a modularizar correctamente en Rust te ayudará a construir proyectos grandes de forma mucho más organizada y robusta.

