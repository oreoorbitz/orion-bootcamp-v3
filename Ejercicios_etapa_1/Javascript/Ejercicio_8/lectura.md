## Manejamiento de archivos y ambiente de ejecución y manejador de paquetes.

### Ambiente de ejecución

Cuando escribimos javascript, nuestro código no es directamente ejecutado por el navegador, pero por un motor de javascript. En caso de Google Chrome, `V8`. Los motores de javascript son corridos dentro de un navegador. Un navegador es una aplicación que se ejecuta en un sistema operativo. Un sistema operativo es una colección de programas que comunican con el `Kernel` del sistema operativo. El Kernel comunica con el hardware de tu computadora, que permite la interactividad con un humano como tú.

El `Binary Code` es un método de comunicación para hardware. Es representado en 0 y 1s. La razón de esto, es para que haya comunicación con los logic gates de tu hardware.

```
0001 0010 0011
```

Toda funcionalidad en tu computador es procesado como código binario. Para que los humanos puedan razonablemente manejar la funcionalidad de hardware, creamos los lenguajes Assembly. Los lenguajes assembly son más entendibles para humans que código binario, y permitieron los ingenieros en computación hacer funcionalidad básica, pero cuando la complejidad de software creció, se volvió obvio que assembly era demasiado difícil entender para hacer sistemas más complejos.

```
MOV R2, 5      ; Mover 5 al registro 2 (A)
MOV R3, 7      ; Mover 7 al registro 3 (B)
ADD R2, R3     ; Sumar R2 + R3 y guardar en R2
```

Así que se crearon lenguajes de programación para abstraer el código de Assembly, que es una abstracción de código binario. Lenguajes como `C` son compilados por sistemas gcc a código assembly.

```C
 #include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 7);
    printf("El resultado es: %d\n", result);
    return 0;
}

```

Eventualmente, gente formaron opiniones sobre las abstracciones de lenguajes tempranos. Decidieron que las abstracciones en `C` limitaban su habilidad de escribir software según sus necesidades.

`C++` Originalmente fue una extensión de `C`, escrito en `C`.

```C++
#include <iostream>
using namespace std;

class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
};

int main() {
    Calculator calc;
    int result = calc.add(5, 7);
    cout << "El resultado es: " << result << endl;
    return 0;
}

```

Con el tiempo, los usuarios de computadores se volvieron más usuarios comunes que científicos. Por lo tanto se inventaron los navegadores. Un sistema de abstracción para compartir información. Texto y imágenes y videos, encapsulados en direcciones estáticas y compartibles. Sitios web, y navegadores para acceder los sitios web.

Netscape, un navegador de ejemplo, fue escrito en c++.

Los sitios fueron hechos de una cierta forma, con cierto código, que los navegadores podían procesar.

Los lenguajes de marcado fueron creados para estructurar y mostrar contenido de una forma entendible para humanos. Un ejemplo es HTML, que el navegador interpreta para construir y renderizar la estructura visual que ves en la pantalla.

El navegador, al procesar un archivo HTML, utiliza el sistema operativo para comunicarse con el hardware de tu computadora. El sistema operativo coordina el acceso a la memoria, la CPU y la tarjeta gráfica, lo que finalmente genera los píxeles que forman el texto y las imágenes que ves.

```HTML
<h4>Esto es un ejemplo de HTML</h4>
<li> El lenguaje que los navegadores usan para mostrar informacion en la pagina</li>

```

El artículo que estás leyendo fue escrito en Markdown, un lenguaje que es una abstracción de HTML.

Motores que leen Markdown, toman Markdown y lo convierten a HTML primero.

```md
##### Este es un ejemplo de Markdown
- Un lenguaje que se transpila a `HTML`
```

##### Este es un ejemplo de Markdown, renderizado en programa que lee markdown
- Un lenguaje que se transpila a `HTML`.

Eventualmente habia un necesidad de que lo que se podia hacer con los navegadores fuese mas complejo, asi que se creo otra abstración.

Javasacript es un lenguaje de programacion, escrito en `C++`, fue escrito originalmente con la intencion de manipular el HTML que aparece en una página.

```js
function add(a, b) {
  return a + b;
}

const result = add(5, 7);
console.log("El resultado es:", result);

```

Eventualmente, los sitios web se volverion de uso principal para computadoras, y como tal javascript se volvio uno de, si no el mas, popular lenguajes de programacion. Como tal, habia una enorme cantidad de programadores que aprenderon a usar javascript, y querian usarlo fuera del contexto limitado del navegador. Como tal, fue creado `node`, usando `C++`.

node es un coretiempo de `javascript`. Toma sintaxis de javascript, y crea abstraciones que permiten hacer interaciones con los sistemas operativos.


### Modulos

Los archivos son una forma de abstraer la lógica computacional para que sea más fácil de entender para los humanos.

En HTML, nosotros le decimos al navegador que queremos cargar y ejecutar código de javascript usando un `tag` específico de HTML.

```HTML
<script src="index.js"></script>
```

El navegador ve el `tag` y sabe que tiene que buscar en la dirección dada para el archivo.

Originalmente usando un `script` el tag era la única forma de cargar y/o leer código javascript.

Para Node, no hace sentido usar tags de HTML en javascript (En mi opinión <___<). Así que Node tiene sus propias formas de cargar y ejecutar archivos de js. Node siendo una aplicación, que corre directamente en tu computadora, corre archivos de js directamente.

```sh
node index.js
```

Con este comando, Node abre y corre el código en index.js dentro de un archivo.

También podemos cargar otros archivos que serán ejecutados cuando el archivo principal los corra.

```Node
let product = require('./data/product.js')
```

Eventualmente, como pasa seguido, la presencia de cierta funcionalidad ajena de la implementación de `javascript` en el navegador, fue implementada en `javascript` del navegador.

Esta implementación no tuvo nada de controversia.

```js
import { product } from './data/product.js'
```

La sintaxis para importar módulos en la web era distinta a la sintaxis usada en `node`. Como tal, Node siendo un `runtime` con la intención de ser una implementación de `javascript`, decidió copiar la sintaxis de import de javascript.

Esta decisión no tuvo nada de controversial ni creó nada de complicaciones.

Para exportar un elemento de javascript, usamos la palabra clave export.

```js
 export const a = 'a'

 const b = `b`

 const c = `c`

 // tambien podemos exportar mulitples

 export {
    b,
    c
 }
```
Para importar múltiples elementos de un solo archivo, los ponemos en un objeto, y de ahí son usables en el contexto de nuestra página.

```js
import {a,b,c} from 'alphabet.js'

console.log(a)
// a

```

Para exportar solo un elemento en el archivo, como el defecto, usamos export default.

```js
const productos = {
    camisa: {
        titulo: 'camisa',
        tamanio: 'xl'
    }
}
export default  productos
```

Cuando importamos un elemento de default de un archivo, no tenemos que usar objeto.

```js
import products from 'productos.js'
```

### NPM

`Node Package Manager`, NPM de corto, es un manejador de paquetes para Node. Es un programa, escrito principalmente con Node, para crear, organizar, y compartir módulos escritos en javascript, con la intención de correr en Node.

Es un programa, que puede ser ejecutado con sus comandos.

```sh
npm install vitest
```

Aquí estamos instalando un paquete llamado vitest.

NPM crea una carpeta, llamada `node_modules`, donde se guarda todos los paquetes que instalamos. NPM usa un archivo de configuración, llamado package.lock para saber cuáles módulos tiene que descargar.

Los paquetes están guardados en un servidor manejado por NPM Inc, que maneja el registro de paquetes y manda la data a tu computadora cuando tú instalas los módulos.

NPM es una compañía benevolente y justa que nunca haría una decisión que tendría resultados desastrosos para millones de usuarios.

Una vez que un paquete está instalado, puedes importar el paquete en tu archivo.

```javascript
import { describe, it, expect, vi } from 'vitest';
```

### Notas de velocidad
La cantidad de archivos de javascript hace un impacto en la velocidad en la que se carga una página, eso es afuera del tema de este artículo, pero es importante tener en mente.

### Notas finales
En el final, puedes organizar tus archivos de javascript según tu gusto (o el gusto de tu gerente).