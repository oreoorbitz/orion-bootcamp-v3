# Guía de RegExp y matchAll para Procesamiento de Bucles

## ¿Qué son las Expresiones Regulares (RegExp)?

Las **expresiones regulares** son patrones que nos permiten buscar, extraer y manipular texto de manera precisa. En JavaScript, las creamos con la sintaxis `/patrón/flags` o con `new RegExp()`.

### Conceptos Básicos

```javascript
// Sintaxis literal
const patron = /hola/g;

// Constructor
const patron2 = new RegExp('hola', 'g');
```

**Flags importantes:**
- `g` (global): Busca todas las coincidencias, no solo la primera
- `i` (ignoreCase): Ignora mayúsculas y minúsculas
- `m` (multiline): Trata cada línea como inicio/fin

## Grupos de Captura

Los **grupos de captura** se definen con paréntesis `()` y nos permiten extraer partes específicas del texto coincidente:

```javascript
const texto = "{% for fruta in frutas %}";
const patron = /for\s+(\w+)\s+in\s+(\w+)/;
const match = texto.match(patron);

// match[0] = "for fruta in frutas" (coincidencia completa)
// match[1] = "fruta" (primer grupo)
// match[2] = "frutas" (segundo grupo)
```

### Caracteres Especiales Útiles

- `\w` = caracteres de palabra (letras, números, _)
- `\s` = espacios en blanco
- `+` = uno o más caracteres
- `*` = cero o más caracteres
- `?` = opcional (cero o uno)

## El Método matchAll()

`matchAll()` es perfecto para encontrar **múltiples coincidencias** con grupos de captura. Devuelve un iterador que podemos convertir a array.

### Sintaxis

```javascript
const coincidencias = [...texto.matchAll(patron)];
```

### Ejemplo Práctico para Bucles

```javascript
const plantilla = `
Lista:
{% for fruta in frutas %}
  {% if fruta %}
    {{ fruta }}
  {% endif %}
{% endfor %}
`;

// Patrón para detectar directivas for
const patronFor = /\{\%\s*for\s+(\w+)\s+in\s+(\w+)\s*\%\}/g;
const coincidencias = [...plantilla.matchAll(patronFor)];

coincidencias.forEach(match => {
  console.log('Coincidencia completa:', match[0]);
  console.log('Variable del bucle:', match[1]); // "fruta"
  console.log('Lista fuente:', match[2]);       // "frutas"
  console.log('Posición:', match.index);
});
```
