# Lectura: Conversión de Centavos a Formato Monetario en Lua

En este ejercicio, implementamos una función en Lua que convierte una cantidad en centavos a un formato monetario. Aunque comparte la misma lógica que la versión en JavaScript, existen diferencias específicas en la sintaxis y en algunas funciones integradas. A continuación, se destacan las diferencias clave.

-- escrito por Orion y ChatGPT, v1

---

## Objetos en JavaScript vs. Tablas en Lua

### ¿Cuáles son las similitudes?

Tanto los objetos en JavaScript como las tablas en Lua se basan en el concepto de arreglos asociativos (o diccionarios): colecciones de pares clave-valor. En JavaScript, los objetos se utilizan para almacenar valores bajo claves (generalmente strings o símbolos), mientras que en Lua, las tablas pueden funcionar tanto como arreglos indexados numéricamente como arreglos asociativos.

---

### Creación y Acceso en JavaScript

#### Creación con Literal de Objeto

```javascript
const obj = {
  key1: 'valor1',
  key2: 'valor2',
  // También podemos usar índices numéricos
  0: 'cero'
};
```

#### Acceso a la Información

- Notación de Corchetes:

```
console.log(obj['key1']); // 'valor1'
console.log(obj[0]);      // 'cero'
```

- Notación de Punto (cuando la clave es un identificador válido):

```
console.log(obj.key2);    // 'valor2'
```

##### Aceder cadenas de informacion

```
const multiObj = {
  subObj = {
    key1: 'valor1'
  }
}

multiObj.subOj.key // 'valor1'
```



##### Usar numeros y characters especiales como llaves

```
 const product = {
  quantity: 1,
  properties: {
    '_sale': true,
    'has-no-returns': true
  }
 }
```


#### Métodos de Objetos
- JavaScript empezó con pocos métodos para manipular objetos.
- `hasOwnProperty` verifica si una propiedad existe en el objeto, según la llave.
- `toString` fue creado para funcionar con patrones de programación antiguos en JavaScript; como tal, no se usa mucho en la programación moderna de JavaScript.

```
 const product = {
  quantity: 1,
  properties: {
    '_sale': true,
    'has-no-returns': true
  }
 }

 product.properties.hasOwnProperty('_sale') // true
 console.log(product.properties.toString()); // "[object Object]"
 ```

 - Eventualmente, javascript agrego mas metidos para trabajar con Objects, pero fue decidido que usando notacion de punto para metidos de array seria confuso, asi que todo estos  nuevos metidos son estaticos.

 ```

 const product = {
  quantity: 1,
  properties: {
    '_sale': true,
    'has-no-returns': true
  }
 }
 
 Object.entries(product )

 /*
 [
  ["quantity", 1],
  ["properties", { "_sale": true, "has-no-returns": true }]
]
*/

 ```

### Tablas en Lua: Creación, Acceso y Manipulación

En Lua, todas las colecciones se implementan mediante tablas. No existe una distinción tan marcada entre arreglos y diccionarios, ya que una tabla puede funcionar como un arreglo indexado numéricamente o como un arreglo asociativo.

#### Creación de tablas en Lua
Se crean usando llaves {}. Por ejemplo, para definir una tabla similar a un objeto de JavaScript se puede escribir:

```
local obj = {
  key1 = "valor1", -- Clave válida como identificador
  key2 = "valor2",
  [0] = "cero" -- Clave numérica (o cualquier clave no válida como identificador)
}
```

#### Acceso a los Elementos
- Lua permite dos formas principales para acceder a los elementos de una tabla:

#### Notación de Punto:
- Si la clave es un identificador válido, se puede acceder directamente usando el punto. Por ejemplo:
```
print(obj.key1) -- Imprime "valor1"
```

#### Notación de Corchetes:
- Esta notación se utiliza cuando la clave no es un identificador válido o es dinámica. Por ejemplo:

```
print(obj["key2"]) -- Imprime "valor2"
print(obj[0]) -- Imprime "cero"
```

#### Tablas Anidadas
- Al igual que en JavaScript se pueden tener objetos dentro de objetos, en Lua las tablas pueden anidarse. Por ejemplo:

```
local product = {
  quantity = 1,
  properties = {
    _sale = true, -- Clave válida, se accede con punto
    ["has-no-returns"] = true -- Clave con caracteres especiales, se accede con corchetes
  }
}
```

- Para acceder a las propiedades anidadas se usa: 

```
print(product.properties._sale) -- Imprime true
print(product.properties["has-no-returns"]) -- Imprime true
```

#### Funciones de Utilidad y Métodos Estáticos

Mientras que JavaScript incorporó métodos estáticos como Object.entries para manipular objetos sin agregar esos métodos a cada instancia, Lua no dispone de métodos estáticos integrados para tablas. En su lugar, se utilizan funciones de la biblioteca estándar y la iteración con pairs para lograr operaciones similares. Por ejemplo, para insertar elementos en una tabla que actúa como arreglo se usa table.insert:

```
local arr = { 1, 2, 3 } table.insert(arr, 4) -- Inserta el valor 4 al final de la tabla
```

Si se desea obtener algo similar a Object.entries en JavaScript, se puede recorrer una tabla con pairs para obtener las claves y los valores:

for key, value in pairs(product) do print(key, value) end

Esto recorre la tabla product y muestra cada par clave-valor, funcionando de manera similar a Object.entries, aunque Lua no ofrece un método nativo que retorne directamente un arreglo de pares.

### Resumen de Diferencias y Contexto

##### Sintaxis de Creación y Acceso
En JavaScript, los objetos se crean usando llaves con notación de dos puntos para asignar valores (por ejemplo, `{ key: 'valor' })`. El acceso a las propiedades se realiza mediante notación de punto (para identificadores válidos) o de corchetes (para claves que contienen caracteres especiales o son dinámicas).

En Lua, las tablas se definen también con llaves, pero al asignar valores se utiliza el operador igual para claves que son identificadores válidos (por ejemplo, `key = "valor"`) y se usan corchetes para claves no válidas (por ejemplo, `["has-no-returns"] = true`). El acceso a los elementos sigue la misma lógica: notación de punto o de corchetes según corresponda.

##### Herramientas para Manipulación de Datos
JavaScript ofrece una serie de métodos incorporados para trabajar con objetos. Algunos métodos, como `hasOwnProperty` y `toString`, están disponibles en las instancias de objetos, mientras que otros, como Object.entries, se implementan como métodos estáticos para evitar agregar funcionalidad adicional a cada objeto.

Lua, en cambio, no cuenta con métodos estáticos nativos para tablas. La manipulación se realiza mediante funciones de la biblioteca estándar (como table.insert) y utilizando estructuras de iteración (por ejemplo, pairs) para recorrer y trabajar con los pares clave-valor.

##### Contexto en la Evolución de la API
La evolución en JavaScript ha llevado a una cierta división en la forma de acceder a las funcionalidades: inicialmente se confiaba en métodos de instancia y, con el tiempo, se introdujeron métodos estáticos para tareas específicas. Esto ha generado inconsistencias en la forma de trabajar con objetos, ya que algunas operaciones se realizan directamente sobre la instancia y otras a través del constructor Object.

Lua adopta un enfoque más unificado y minimalista. Todas las estructuras se representan como tablas y se manipulan mediante un conjunto reducido de funciones estándar