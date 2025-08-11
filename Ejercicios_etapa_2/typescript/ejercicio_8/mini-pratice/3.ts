// 🧪 Mini ejemplo 3: Usar doble cursor para extraer contenido entre dos marcadores

const datos = ['a', 'b', 'inicio', 'x', 'y', 'z', 'fin', 'c'];
const resultado = [];

for (let i = 0; i < datos.length; i++) {
  if (datos[i] === 'inicio') {
    // 1️⃣ Encuentra el final con otro cursor
    let j = i + 1;
    while (j < datos.length && datos[j] !== 'fin') {
      j++;
    }

    // 2️⃣ Extrae el contenido entre 'inicio' y 'fin' usando un tercer cursor k
    for (let k = i + 1; k < j; k++) {
      resultado.push(datos[k]);
    }

    // 3️⃣ Salta hasta después de 'fin'
    i = j; // El próximo i++ continuará después de 'fin'
  } else {
    resultado.push(datos[i]);
  }
}

console.log(resultado); // ["a", "b", "x", "y", "z", "c"]

// 🛠️ Tarea opcional: reemplaza el bucle `for` con `.slice(i + 1, j)`
// Resultado esperado:
const datosDos = ['a', 'b', 'inicio', 'x', 'y', 'z', 'fin', 'c'];
const resultadoDos = [];

for (let i = 0; i < datosDos.length; i++) {
  if (datosDos[i] === 'inicio') {
    let j = i + 1;
    while (j < datosDos.length && datosDos[j] !== 'fin') {
      j++;
    }

    const segmento = datosDos.slice(i + 1, j);
    resultadoDos.push(...segmento);
    i = j;
  } else {
    resultadoDos.push(datosDos[i]);
  }
}

console.log(resultadoDos); // ["a", "b", "x", "y", "z", "c"]
