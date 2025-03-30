### Installando deno

En los  de javascript en etapa 1, hemos estado usando javascript, con node. Recuerda que Javascipt fue hecho para funcionar en el navegador. Como tal Node fue creado para que javascript pueda funcional afuera del navegador. Node se volvio el "runtime"[^1]. Se volvio tan popular que el creado de Node, se volvio desolucionado por la dificultidad en hacer mejoras a Node, asi que hice Deno. Porque escojio ese nombre es un misterio completo. Alguna gente teoriza que el ultimo runtime de javasceipt que va crear Ryan Dahl, se llamar Endo.

Las mejoras mas notables de Deno sobre node es su support nativo de typescript, cual es la razon que lo vamos a usar.


#### Para mac OS

`curl -fsSL https://deno.land/install.sh | sh`

#### Para WSL en windows

`curl -fsSL https://deno.land/install.sh | sh`


[^1]: Un "runtime" un ambiente donde se puede correr algo. un runtime de javascript solo es un ambiente para corer javascript.

#### para corer scripts de typescript con deno

`deno main.ts`


#### Escrbiendo tests para tu codigo

Para esta etapa de cursos, para los ejercicios de typescript, van a tener que escribir las pruebas para todo el codigo que escriban. los archivos donde se escriben el test seran `main_test.ts`, para corer los tests, es:

`deno test`

#### Instalando el deno plugin para vs code

En el mercado de plugins de vscode, busca por "deno". El que quieres es el plugin hecho por "deno.land"