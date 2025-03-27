# Lectura: Conversión de Centavos a Formato Monetario en Lua

En este ejercicio, implementamos una función en Lua que convierte una cantidad en centavos a un formato monetario. Aunque comparte la misma lógica que la versión en JavaScript, existen diferencias específicas en la sintaxis y ciertas funciones incorporadas. A continuación, se destacan las diferencias clave.

-- escrito por Orion, v1

---

## Objetos en JavaScript vs. Tablas en Lua

### ¿Cuáles son las similitudes?

Ambos, objetos en JavaScript y tablas en Lua, se basan en el concepto de arrays asociativos (o diccionarios): colecciones de pares clave-valor. En JavaScript, los objetos se utilizan para almacenar valores bajo claves (generalmente strings o símbolos), mientras que en Lua, las tablas pueden funcionar tanto como arrays indexados numéricamente como arrays asociativos.

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


#### Metidos de objectos
- Javascript empeso con pocos metidos para manipular objects
- hasOwnProperty checa si existe la propertiedad en el objecto, segun la llave
- toString fue hecho para funcionar con patrones de programacion viejas en javascript, como tal, no se usa mucho en programacion de javascript moderna.

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