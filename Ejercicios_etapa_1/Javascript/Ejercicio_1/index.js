    /**
     * Calcula la edad en días dada una cantidad de años
     * No se permite usar objetos Date
     * Fórmula: años * 365 (ignoramos años bisiestos)
     *
     * @param {} años - La edad en años
     * @returns {} La edad en días
     *
     * @example
     * // Para 1 año, se espera 365
     * edadEnDias(1) // 365
     *
     * @example
     * // Para 0 años, se espera 0
     * edadEnDias(0) // 0
     *
     * @example
     * // Para 10 años, se espera 3650
     * edadEnDias(10) // 3650
     */
    
    export function edadEnDias(anios) {
        return anios* 365 // Reemplazar por la implementación
    }

    const resultado = edadEnDias(26)
    console.log(resultado)



