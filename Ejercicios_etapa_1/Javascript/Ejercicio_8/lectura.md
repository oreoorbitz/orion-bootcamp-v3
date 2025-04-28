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

Los archivos son una forma de abstraer la logica computacional para que sea mas fácil de entender para los humanos.

En HTML, nosotros le decimos al navegador que queremos cargar y ejecutar codigo de javscript usando un `tag` especifico de html.

```HTML
<script src="index.js"></script>
```

El; navegador ve el `tag` y sabe que tiene que buscar en la direcion dada para el archivo.

Originalmente usando un `script` el tag era la unica forma de cargar y/o leer codigo javascript.

Para node, no hace sentido usar tags de HTML en javascript (En mi opnion <___<). Asi que node tiene sus propias forma de cargar y ejecutar archivos de js. Node siendo una applicacion, que corre directamente en tu computadora, corre archivos de js directamente.

```sh
node index.js
```

Con este comando, node abre y corre el codigo en index.js
Dentro de un archivo.

Tambien podemos cargar otros archivos que saran ejecutados cuando el archivo principal los core.

```Node
let product = require('./data/product.js')
```

Eventualmente, como pasa seguido, la presencia de cierta funcionalidad ajena de la implementacion de `javascript` en el navegador, fue implementadad en `javascript` de el navegador.

Esta implementacion no tuvo nada de contraversia.

```js
import { product } from './data/product.js'
```

La sintax para importar modules en la web era distintca a la sintaxis usada en `node`. Como tal, node siendo un `runtime` con la intencion de ser una implentacion de `javascript` dicidio copia la sintax de import de javascript.

Esta deciscion no tuvo nada de controversial no creo nada de complicaciones.

para exportar un elemento de javascript, usamos la parabla clave export

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
Para importar multiples elementos de un solo archivo, los ponemos en un objecto, y de ayi son usables en el contexto de nuestra pagina

```js
import {a,b,c} from 'alphabet.js'

console.log(a)
// a

```

Para exportar solo un elemento en el archivo, como el defaulto, usamos export default

```js
const productos = {
    camisa: {
        titulo: 'camisa',
        tamanio: 'xl'
    }
}
export default  productos
```

Cuando importamos un elemento de default de un archivo, no tenemos que usar objecto

```js
import products from 'productos.js'
```

### NPM

`Node Package Manage`, NPM de corto, es un manejador de paquetes para node. Es un programa, escrito princepalmente con node, para crear, organizar, y compartir modulos escritos en javascript, con la intencion de corer en node.

es un programa, que puede ser ejecutado con sus commandos

```sh
npm install vitest
```

Aqui estamos installando un paquete llamado vitest.
NPM crea un a carpeta, llamada `node_modules`, donde se guarda todo los packquetes que instalamos. NPM usa un archivo de configuracion, llamada package.lock para saber cuales modulos tiene que descargar.

Los paquetes estan guardados en un servidor manejador por NPM inc, que maneja el registro de paquetes y manda la data a tu computadora cuando tu installes los modulos.

NPM es una compania benevolente y justa que nunca haria un decision que tendria resultados desastrosas para milliones de usaurios.

Una ves que un paquete esta installado, puedes importar el packet en tu archivo

```javascript
import { describe, it, expect, vi } from 'vitest';
```

### Notas de velocidad
La cantidad de archivos de javascript hace un impacto en la velocidad en lo que se carga una pagina, eso es afuero del tema de este articulo, pero es importante tener en mente.

### Notas finales
En el final, puedes organizar tus archivos de javascript segun tu gusto (o el gusto de tu gerente).
