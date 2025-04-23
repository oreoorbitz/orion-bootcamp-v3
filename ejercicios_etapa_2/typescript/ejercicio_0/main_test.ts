// Importación de funciones desde main.ts
// ---------------------------------------
// IMPORTANTE:
// ✅ Bora todos estos commentarios antes de terminar el ejercicio. No elemines el import por accidente
// ✅ Las funciones deben ser importadas desde `main.ts`.
// ✅ Los nombres de las funciones importadas pueden ser cambiados al gusto.
// ❗ EJEMPLO:
//
// import { edadEnDias as convertirEdad } from "./main.ts";
//
// En este ejemplo, `edadEnDias` ha sido renombrada a `convertirEdad` al importarla.
// Ahora se puede usar `convertirEdad()` en lugar de `edadEnDias()` en las pruebas.

import { assertEquals } from "@std/assert";
// TODO: Importar las funciones desde main.ts aquí
// Ejemplo:
// import { edadEnDias } from "./main.ts";

/**
 * EJEMPLO DE PRUEBA
 * =================
 * - Esta es una prueba para la función `edadEnDias`.
 * - Usa `assertEquals` para verificar que el resultado es el esperado.
 *
 * @example
 * Deno.test("edadEnDias devuelve edad en días correctamente", () => {
 *   assertEquals(edadEnDias(1), 365);
 *   assertEquals(edadEnDias(0), 0);
 *   assertEquals(edadEnDias(10), 3650);
 * });
 */

// EJEMPLO DE PRUEBA:
// ------------------
// Esta prueba verifica que `edadEnDias` retorne el valor esperado.
// Descomenta y usa si necesitas ejemplos para empezar.
//
// Deno.test("edadEnDias devuelve edad en días correctamente", () => {
//   assertEquals(edadEnDias(1), 365);
//   assertEquals(edadEnDias(0), 0);
//   assertEquals(edadEnDias(10), 3650);
// });

/**
 * GUÍA PARA ESCRIBIR PRUEBAS
 * ==========================
 * 1. Importa la función desde `main.ts`.
 * 2. Usa `Deno.test()` para definir una prueba.
 * 3. Dentro de `Deno.test()`, utiliza `assertEquals` para comparar el resultado con el valor esperado.
 * 
 * @example
 * import { cualEsTuNombre } from "./main.ts";
 *
 * Deno.test("cualEsTuNombre retorna un saludo correcto", () => {
 *   assertEquals(cualEsTuNombre("Juan", "Pérez"), "Hola, Juan Pérez!");
 *   assertEquals(cualEsTuNombre("Ana", "Gómez"), "Hola, Ana Gómez!");
 * });
 */
