// 🧪 Mini ejemplo 3: Evaluar condiciones agrupadas con lógica booleana

const comando = {
    activo: true,
    modo: 'test',
    error: false,
    usuario: 'admin',
    region: 'us',
    suspendido: true
  };

  // ⚠️ Queremos permitir ejecución solo si:
  // - el comando está activo
  // - no hay error
  // - el usuario es admin
  // - y además:
  //    - está en modo producción y la región es 'us'
  //    - o está en modo prueba (modo: 'test') sin importar la región

  if (
    comando.activo &&
    !comando.error &&
    comando.usuario === 'admin' &&
    !comando.suspendido &&
    (
      (comando.modo === 'produccion' && comando.region === 'us') ||
      comando.modo === 'test'
    )
  ) {
    console.log('✅ Comando válido. Ejecutando...');
  } else {
    console.log('❌ Comando inválido. Detenido.');
  }

  // 🛠️ Tarea:
  // 1. Cambia el modo a "test" y la región a "eu", y observa que aún se ejecuta.
  // 2. Cambia el usuario a "guest" y observa que se detiene.
  // 3. Agrega un nuevo campo `suspendido: true` y modifica el condicional
  //    para que **no se ejecute si el comando está suspendido**, sin importar el resto.
