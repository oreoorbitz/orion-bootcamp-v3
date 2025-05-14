// 🧪 MiniEjemplo 4: Corrigiendo predicciones incorrectas de código JavaScript

// Tenemos un bloque de texto con predicciones de código en Markdown.
// Algunas predicciones son incorrectas. Tu tarea es:
// 1. Encontrar los bloques de código de una sola línea con ```js ...```
// 2. Identificar el resultado que el texto dice que produce ese código
// 3. Evaluar el código real usando `eval()`
// 4. Reemplazar la predicción con el resultado correcto

// ✅ Qué es `eval()`:
// Eval toma un string como entrada y lo ejecuta como código JavaScript.
// Ejemplo: eval("2 + 2") devuelve 4.

// ❗ No uses `eval()` con datos no confiables (como usuarios externos).
// En este caso es seguro porque tú controlas el texto.

// 📦 Texto de entrada:
const texto = `
Aquí hay dos fragmentos de código evaluados:

\`\`\`js 2 > 4\`\`\` → el resultado es: \`true\` ❌ (esto es falso)

\`\`\`js 1 + 1 === 2\`\`\` → el resultado es: \`true\` ✅ (esto es correcto)
`

// 🎯 Objetivo final:
// Corregir la predicción en el primer caso. El resultado debe quedar así:
// \`\`\`js 2 > 4\`\`\` → el resultado es: \`false\`

// ✅ Solución sugerida:
const corregirTexto = (entrada: string): string => {
  // Buscar todos los bloques de código como ```js ...```
  const regex = /```js (.*?)``` → el resultado es: `(.+?)`/g
  let resultado = entrada

  for (const match of entrada.matchAll(regex)) {
    const codigo = match[1].trim()
    const valorActual = match[2].trim()

    // Evaluamos el código real
    let valorEvaluado
    try {
      valorEvaluado = eval(codigo)
    } catch {
      valorEvaluado = '⚠️ error de evaluación'
    }

    // Reemplazamos el valor incorrecto
    resultado = resultado.replace(
      `\`\`\`js ${codigo}\`\`\` → el resultado es: \`${valorActual}\``,
      `\`\`\`js ${codigo}\`\`\` → el resultado es: \`${valorEvaluado}\``
    )
  }

  return resultado
}

// 🧪 Prueba
console.log(corregirTexto(texto))

// 📌 Tu tarea:
// - Cambia el texto para agregar más predicciones incorrectas
// - Asegúrate de que `corregirTexto()` las corrija
// - No cambies el texto manualmente — confía en tu código
