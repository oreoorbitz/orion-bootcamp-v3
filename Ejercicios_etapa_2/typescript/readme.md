### Instalando Deno

En los cursos de JavaScript en etapa 1, hemos estado usando JavaScript con Node. Recuerda que JavaScript fue hecho para funcionar en el navegador. Como tal, Node fue creado para que JavaScript pueda funcionar fuera del navegador. Node es un runtime[^1] de JavaScript. Node se volvió tan popular que el creador de Node (Ryan Dahl) se desilusionó por la dificultad de hacer mejoras a Node, así que creó Deno. Por qué escogió ese nombre es un misterio completo. Alguna gente teoriza que el último runtime de JavaScript que va a crear Ryan Dahl se llamará Endo.

Una de las mejoras más notables de Deno sobre Node es su soporte nativo de TypeScript, que es la razón por la que lo vamos a usar.

#### Para Mac OS

```bash
curl -fsSL https://deno.land/install.sh | sh
```

#### Para WSL en Windows

```bash
curl -fsSL https://deno.land/install.sh | sh
```

[^1]: Un "runtime" es un ambiente donde se puede correr algo. Un runtime de JavaScript es simplemente un ambiente para correr JavaScript.

#### Para correr scripts de TypeScript con Deno

```bash
deno run main.ts
```

#### Escribiendo tests para tu código

Para esta etapa del curso, en los ejercicios de TypeScript, van a tener que escribir las pruebas para todo el código que escriban. Los archivos donde se escriben los tests serán `main_test.ts`. Para correr los tests, el comando es:

```bash
deno test
```

#### Instalando el plugin de Deno para VS Code

En el mercado de extensiones de VSCode, busca "deno". El que quieres es el plugin hecho por "deno.land".
