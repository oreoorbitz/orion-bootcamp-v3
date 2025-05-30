// 🧪 Mini ejemplo 1: Saltar elementos en un arreglo si se encuentra un valor especial

const datos = ['a', 'b', 'ocultar', 'x', 'y', 'z', 'fin', 'c'];

// Queremos copiar todos los elementos EXCEPTO los que están entre "ocultar" y "fin"
const resultado = [];

for (let i = 0; i < datos.length; i++) {
  if (datos[i] === 'ocultar') {
    // Avanza hasta encontrar "fin"
    while (datos[i] !== 'fin') {
      i++;
    }
    // Nota: el `i++` del loop ya nos llevará al siguiente
  } else {
    resultado.push(datos[i]);
  }
}

console.log(resultado); // ["a", "b", "c"]

// 🛠️ Tarea: cambia "ocultar" por "saltame" y "fin" por "listo"
