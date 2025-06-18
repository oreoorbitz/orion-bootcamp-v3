export const caminoExiste = async (ruta: string): Promise<boolean> => {
    try {
        await Deno.stat(ruta);
        return true; 
    }
    catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return false; 
        }
        throw error; 
    }

}

export const crearDirectorioSiNoExiste = async (ruta: string): Promise<void> => {
    try {
        await Deno.stat(ruta);
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            await Deno.mkdir(ruta, { recursive: true });
            console.log(`Directorio creado: ${ruta}`);
        } else {
            throw error; 
        }
    }
}

export const pathEsHtml = (ruta: string): boolean => {
    const extension = ruta.split('.').pop()?.toLowerCase();
    return extension === 'html' || extension === 'htm';
}

export const pathEsLiquid = (ruta: string): boolean => {
    const extension = ruta.split('.').pop()?.toLowerCase();
    return extension === 'liquid';
}

export const pathEsCss = (ruta: string): boolean => {
    const extension = ruta.split('.').pop()?.toLowerCase();
    return extension === 'css';
}

