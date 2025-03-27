/**
 * Genera un saludo utilizando el nombre de una persona
 * Debe devolver "Hola, <primerNombre> <apellido>"!
 * (incluyendo la exclamación al final)
 *
 * 
 * @param {string} primerNombre - El primer nombre de la persona
 * @param {string} apellido - El apellido de la persona
 * @returns {string} El mensaje de saludo
 *
 * @example
 * // Para "Juan" y "Pérez", se espera "Hola, Juan Pérez!"
 * cualEsTuNombre("Juan", "Pérez")
 *
 * @example
 * // Para "Ana" y "Gómez", se espera "Hola, Ana Gómez!"
 * cualEsTuNombre("Ana", "Gómez")
 */
export const cualEsTuNombre = (primerNombre, apellido) => {
    return `Hola ${primerNombre} ${apellido}!` // Reemplazar por la implementación correcta
}

console.log(cualEsTuNombre("Pao", "Perez"));
