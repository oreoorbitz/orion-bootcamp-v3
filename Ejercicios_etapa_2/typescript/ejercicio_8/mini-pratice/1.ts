// 🧪 Mini ejemplo 2: Buscar índice de una palabra clave en un arreglo

const comandos = ['inicio', 'cargar', 'esperar', 'parar', 'fin', 'reiniciar'];

let i = 0;

while (i < comandos.length && comandos[i] !== 'fin') {
  console.log('Comando válido:', comandos[i]);
  i++;
}

// 🛠️ Tarea: cambia "fin" por "terminar" y asegúrate que el código aún funcione
// pista: necesitas actualizar el arreglo para tener "terminar" en vez de "fin"
