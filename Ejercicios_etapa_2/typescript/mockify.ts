function validarEstructura(): boolean {
    const elementos = Array.from(Deno.readDirSync(Deno.cwd()), (entry) => ({
        nombre: entry.name,
        esCarpeta: entry.isDirectory,
    }));

    const estructuraEsperada = [
        { nombre: "assets", esCarpeta: true },
        { nombre: "content_for_index.liquid", esCarpeta: false },
        { nombre: "theme.liquid", esCarpeta: false },
    ];

    const faltantes = estructuraEsperada.filter((esperado) => {
        const encontrado = elementos.find((el) => el.nombre === esperado.nombre);
        return !encontrado || encontrado.esCarpeta !== esperado.esCarpeta;
    });

    if (faltantes.length > 0) {
        console.error("❌ Estructura incorrecta. Faltan estos elementos o tienen el tipo incorrecto:", faltantes);
        return false;
    }

    console.log("✅ Estructura correcta. Todos los archivos y carpetas requeridos están presentes.");
    return true;
}

export async function observarCambios() {
    console.log("👀 Observando cambios en archivos importantes...");

    const watcher = Deno.watchFs(["assets", "content_for_index.liquid", "theme.liquid"]);

    for await (const event of watcher) {
        console.log(`🔄 Archivo(s) modificado(s): ${event.paths.join(", ")}`);

        if (event.paths.some((path) => path.endsWith(".css"))) {
            console.log("🔄 Cambios en CSS detectados, recargando estilos...");
            notificarReloadCSS();
        } else {
            console.log("🔄 Cambio detectado, regenerando HTML...");
            await recargarYGenerarHTML();
        }
    }
}
