interface TokenPlantilla {
    tipo: "texto" | "variable" | "directiva";
    contenido: string;
  }
  
  export function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    const resultado: TokenPlantilla[] = [];
    let i = 0;
  
    while (i < tokens.length) {
      const token = tokens[i];
  
      if (token.tipo === "directiva" && token.contenido.startsWith("for ")) {
        // Extraer datos del for
        const match = token.contenido.match(/^for (\w+) in (\w+)$/);
        if (!match) {
          throw new Error("Directiva for mal formada: " + token.contenido);
        }
  
        const [, nombreItem, nombreLista] = match;
        const lista = contexto[nombreLista];
  
        if (!Array.isArray(lista)) {
          throw new Error(`'${nombreLista}' no es un arreglo en el contexto`);
        }
  
        // Buscar el bloque interno hasta endfor
        let bloqueInterno: TokenPlantilla[] = [];
        let nivel = 1;
        let j = i + 1;
  
        while (j < tokens.length && nivel > 0) {
          const t = tokens[j];
          if (t.tipo === "directiva") {
            if (t.contenido.startsWith("for ")) nivel++;
            else if (t.contenido === "endfor") nivel--;
          }
          if (nivel > 0) bloqueInterno.push(t);
          j++;
        }
  
        // Procesar el bloque para cada valor del arreglo
        for (const valor of lista) {
          const nuevoContexto = { ...contexto, [nombreItem]: valor };
          let procesado = procesarCondicionales(bloqueInterno, nuevoContexto);
          procesado = renderizarVariables(procesado, nuevoContexto);
          resultado.push(...procesado);
        }
  
        i = j; // Saltamos hasta después de endfor
      } else {
        resultado.push(token);
        i++;
      }
    }
  
    return resultado;
  }
  