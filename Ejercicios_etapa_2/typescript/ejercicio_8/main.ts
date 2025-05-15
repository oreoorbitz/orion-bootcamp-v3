/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Hasta ahora, hemos reconocido bloques de tipo "directiva" pero no les hemos dado significado.
 * En sistemas como Liquid, las directivas controlan el flujo de renderizado.
 * Por ejemplo:
 * - `{% if admin %}` muestra contenido solo si `admin` es verdadero.
 * - Más adelante, usaremos `{% for %}` para bucles.
 *
 * En este módulo, aprenderás a procesar la directiva `if`, evaluando si un bloque debe mostrarse o no.
 *
 * En los módulos anteriores:
 * - `detectarTokensPlantilla()` separó la plantilla en partes
 * - `clasificarTokensPlantilla()` etiquetó los bloques como texto, variables o directivas
 * - `renderizarVariables()` tomó un arreglo de tokens y los transformó en texto final,
 *   reemplazando `{{ variable }}` por valores reales del contexto
 *
 * Pero hay un detalle: `renderizarVariables()` probablemente recorre **todo** el arreglo de tokens.
 * Ahora vamos a introducir una etapa intermedia, donde se filtran los tokens antes de renderizar.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Hola, {{ nombre }}.
 * {% if admin %}
 * Bienvenido, administrador.
 * {% endif %}
 * ```
 *
 * ✅ Ejemplo de `contexto`:
 * ```ts
 * const contexto = {
 *   nombre: "Carlos",
 *   admin: true
 * }
 * ```
 *
 * ✅ Tokens clasificados (resultado previo a este módulo):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." },
 *   { tipo: "directiva", contenido: "endif" }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `true`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `false`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." }
 * ]
 * ```
 *
 * 🎯 Objetivo:
 * Implementar una función que interprete y aplique condiciones tipo `if` y filtre los tokens en base al contexto.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función llamada `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Recorre el arreglo y detecta los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa la variable en el `contexto`
 *    - Si es `true`, conserva el bloque de tokens interno
 *    - Si es `false`, elimínalo
 * 4. Devuelve un nuevo arreglo de tokens sin los bloques no permitidos
 * 5. No permitas condiciones anidadas por ahora

 * 💡 Consejo:
 * - Usa un bucle `for` normal y cuando encuentres una directiva `if`, guarda el índice de inicio.
 * - Busca su `endif` correspondiente con otro bucle o `findIndex`.
 * - Extrae la variable con `.split(' ')` sobre el contenido del token
 * - Puedes usar `.slice()` para cortar el arreglo
 *
 * 👇 Flujo sugerido para usar esta función:
 *
 * ```ts
 * const tokensFiltrados = procesarCondicionales(tokensClasificados, contexto);
 * const resultado = renderizarVariables(tokensFiltrados, contexto);
 * console.log(resultado);
 * ```
 *
 * Esto mantiene `renderizarVariables()` enfocada solamente en reemplazar variables.
 * Si tu implementación actual ya hace el recorrido del arreglo, puedes mantenerla así, pero asegúrate de aplicar `procesarCondicionales()` **antes** de llamar a `renderizarVariables()`.
 *
 * Esta estructura modular será útil cuando agreguemos más directivas como `for`, `else`, etc.
*/
type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva'

interface TokenPlantilla {
 tipo: TipoTokenPlantilla;
 contenido: string;
}

enum TipoDirectiva {
  If = 'if',
  Endif = 'endif',
  For = 'for',
  EndFor = 'endfor'
}


function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
 let resultado: TokenPlantilla[] = [];
 let i = 0;

 while (i< tokens.length) {
  let token = tokens[i]
  if (token.tipo === 'directiva' && token.contenido.startsWith('if')) {
    //Extraer el nombre de la variable
    let partes = token.contenido.split(/\s+/) // también se puede usar como .split("if ") esto eliminiaría esta parte
    let nombreVariable = partes[1] || "";

    //Buscar índice de cierre endif
    let j = i + 1;
    //En programación usamos j después de i
    while (j < tokens.length) {
      if (tokens[j].tipo === 'directiva' && tokens[j].contenido === 'endif') {
        break
      }
      j += 1;
    }
    // validando que se encontró un{% endif %}
    if (j >= tokens.length) {
      throw new Error("Error de sintaxis: {% if %} sin {% endif %}");
    }

    let condicion = contexto[nombreVariable] ?? false;
    if (condicion) {
      for (let k = i + 1; k < j; k++ ) {
        resultado.push({...tokens[k] });
      }

    }

      i = j; //saltar al endif
    } else {
      resultado.push(token);
    }

    i+= 1;
 }

  return resultado
 }

 const tokens: TokenPlantilla[] = [
  { tipo: "texto", contenido: "Hola, " },
  { tipo: "variable", contenido: "nombre" },
  { tipo: "texto", contenido: "." },
  { tipo: "directiva", contenido: "if admin" },
  { tipo: "texto", contenido: "Bienvenido, administrador." },
  { tipo: "directiva", contenido: "endif" }
 ]

const contexto = {
  admin: false // Cambia a false para probar el caso contrario
};

const tokensFiltrados = procesarCondicionales(tokens, contexto);


console.log(tokensFiltrados);




/*
 *
 * 📦 Opcional: clasificar tipos de directiva con tipos auxiliares
 *
 * Si deseas organizar mejor el tratamiento de directivas, puedes usar una propiedad adicional para especificar el subtipo:
 *
 * ```ts
 * type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor'

 * interface TokenPlantilla {
 *   tipo: 'texto' | 'variable' | 'directiva';
 *   contenido: string;
 *   directiva?: TipoDirectiva;
 * }
 * ```
 *
 * O puedes crear una función que detecte el subtipo a partir del contenido:
 *
 * ```ts
 * function clasificarDirectiva(token: TokenPlantilla): TipoDirectiva | null {
 *   if (token.tipo !== 'directiva') return null;
 *   if (token.contenido.startsWith('if')) return 'if';
 *   if (token.contenido === 'endif') return 'endif';
 *   return null;
 * }
 * ```
 *
 * Esto puede ayudarte a:
 * - Evitar errores al interpretar directivas
 * - Preparar tu código para otras directivas como `for`, `endfor`, `else`, etc.
 * - Hacer tu flujo de control más legible y escalable
 *
 * No es obligatorio, pero si tu código empieza a crecer, puede ayudarte a mantenerlo ordenado.
 */

/**
 * 🔁 Tarea opcional (no requerida para los próximos módulos):
 *
 * Si quieres acercarte más a la sintaxis real de Liquid, puedes implementar operadores lógicos simples:
 *
 * - Comparaciones con `==`
 *   Ejemplo: `{% if producto == 'camisa' %}`
 *
 * - Palabras clave `and` / `or`
 *   Ejemplo: `{% if admin and activo %}`
 *
 * ✅ Esto implicaría:
 * - Analizar más de un fragmento en `contenido` del token tipo `if`
 * - Evaluar la condición como una mini expresión lógica
 *
 * No necesitas un parser complejo, puedes empezar con divisiones y verificaciones simples:
 * ```ts
 * if (cond.includes('==')) {
 *   const [clave, valor] = cond.split('==').map(x => x.trim())
 *   return contexto[clave] === valor.replace(/['"]/g, '')
 * }
 * ```
 *
 * Este comportamiento no será usado en los próximos módulos,
 * pero si decides implementarlo, obtendrás más práctica con la lógica real de Shopify.
 */

/**
 * 🧩 Tarea opcional adicional: Soporte para `{% else %}` y `{% elsif %}`
 *
 * En Liquid real puedes escribir:
 * ```liquid
 * {% if admin %}
 *   Bienvenido, administrador
 * {% elsif invitado %}
 *   Bienvenido, invitado
 * {% else %}
 *   Acceso denegado
 * {% endif %}
 * ```
 *
 * Para esto deberías:
 * 1. Detectar bloques `{% if %}`, `{% elsif %}`, `{% else %}`, `{% endif %}`
 * 2. Agruparlos en una estructura lógica
 * 3. Evaluar las condiciones en orden y retornar solo la rama activa
 *
 * Puedes hacer esto con un bucle que, una vez que encuentra un `if`,
 * recopila todos los tokens hasta el `endif`, separando las ramas por sus directivas.
 *
 * Sugerencia de estructura interna para analizar:
 * ```ts
 * {
 *   tipo: 'condicional',
 *   ramas: [
 *     { tipo: 'if', condicion: 'admin', tokens: [...] },
 *     { tipo: 'elsif', condicion: 'invitado', tokens: [...] },
 *     { tipo: 'else', tokens: [...] }
 *   ]
 * }
 * ```
 *
 * Esta implementación no es trivial, pero se alinea con cómo funciona realmente Liquid en Shopify.
 * Si decides implementarlo, tendrás una base mucho más robusta para renderizado dinámico.
 */
// Paso 1. Clasificación de tipos de directiva:Agregamos un campo directiva opcional dentro de TokenPlantilla y una función clasificarDirectiva().
type TipoTokenPlantilla1 = 'texto' | 'variable' | 'directiva';
type TipoDirectiva1 = 'if' | 'endif' | 'elsif' | 'else' | 'for' | 'endfor';

interface TokenPlantilla1 {
    tipo: TipoTokenPlantilla1;
    contenido: string;
    directiva?: TipoDirectiva1;
}

function clasificarDirectiva(token: TokenPlantilla1): TipoDirectiva1 | null {
    if (token.tipo !== 'directiva') return null;
    if (token.contenido.startsWith('if')) return 'if';
    if (token.contenido.startsWith('elsif')) return 'elsif';
    if (token.contenido === 'else') return 'else';
    if (token.contenido === 'endif') return 'endif';
    return null;
}

//Paso 2. Evaluar expresiones simples (==, and, or). Esta función analiza si una condición tiene comparaciones (==) o lógica (and, or).
function evaluarCondicion(expresion: string, contexto: Record<string, any>): boolean {
    // Manejo de comparaciones (`==`)
    if (expresion.includes('==')) {
        const [clave, valorEsperado] = expresion.split('==').map(texto => texto.trim());
        return contexto[clave] === valorEsperado.replace(/['"]/g, '');
    }

    // Manejo de operadores `and` y `or`
    if (expresion.includes('and')) {
        return expresion.split('and').every(variable => contexto[variable.trim()] === true);
    }

    if (expresion.includes('or')) {
        return expresion.split('or').some(variable => contexto[variable.trim()] === true);
    }

    // Condición simple sin operadores
    return contexto[expresion.trim()] ?? false;
}


//Paso 3. Manejo de {% else %} y {% elsif %}. Ahora ajustamos procesarCondicionales() para manejar múltiples ramas de if, elsif y else.
function procesarCondicionales1(tokens: TokenPlantilla1[], contexto: Record<string, any>): TokenPlantilla1[] {
    let resultado: TokenPlantilla1[] = [];
    let i = 0;

    while (i < tokens.length) {
        let token = tokens[i];

        if (token.tipo === 'directiva' && token.contenido.startsWith('if')) {
            let partes = token.contenido.split(/\s+/);
            let condicion = partes.slice(1).join(' '); // Extraer toda la condición
            let evaluarIf = evaluarCondicion(condicion, contexto);

            let j = i + 1, estadoActual = evaluarIf, bloqueActivo: TokenPlantilla1[] = [];

            while (j < tokens.length) {
                let siguiente = tokens[j];

                if (siguiente.tipo === 'directiva') {
                    if (siguiente.contenido.startsWith('elsif')) {
                        if (!estadoActual) {
                            let partesElsif = siguiente.contenido.split(/\s+/);
                            estadoActual = evaluarCondicion(partesElsif.slice(1).join(' '), contexto);
                        }
                    } else if (siguiente.contenido === 'else') {
                        estadoActual = !estadoActual; // Activar else solo si ninguna condición anterior fue verdadera
                    } else if (siguiente.contenido === 'endif') {
                        break;
                    }
                } else if (estadoActual) {
                    bloqueActivo.push(siguiente);
                }
                j++;
            }

            resultado.push(...bloqueActivo);
            i = j;
        } else {
            resultado.push(token);
        }

        i++;
    }

    return resultado;
}

const tokenss: TokenPlantilla1[] = [
    { tipo: "texto", contenido: "Hola, ", directiva: undefined },
    { tipo: "directiva", contenido: "if admin", directiva: "if" },
    { tipo: "texto", contenido: "Bienvenido, administrador.", directiva: undefined },
    { tipo: "directiva", contenido: "elsif invitado", directiva: "elsif" },
    { tipo: "texto", contenido: "Bienvenido, invitado.", directiva: undefined },
    { tipo: "directiva", contenido: "else", directiva: "else" },
    { tipo: "texto", contenido: "Acceso denegado.", directiva: undefined },
    { tipo: "directiva", contenido: "endif", directiva: "endif" }
];

const contextoo = { admin: false, invitado: true };

const tokensFiltradoss = procesarCondicionales1(tokenss, contextoo);
console.log(tokensFiltradoss);
