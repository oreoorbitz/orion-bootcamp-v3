import { assertEquals } from "@std/assert";
import { TipoToken, objetizaratributo, objetizarToken  } from "./main.ts"

Deno.test("Test de la función objetizaratributo", () => {
    const input = 'class="btn" id="main"';
    const expectedOutput = { class: "btn", id: "main" };
    const result = objetizaratributo(input);
    assertEquals(result, expectedOutput);
})

Deno.test("Test de objetizarToken", () => {
    const nombre = "div";
    const tipo = TipoToken.Apertura;
    const contenido = null;
    const atributos = { class: "btn", id: "main" };
    const expectedOutput = { nombre, tipo, contenido, atributos };
    const result = objetizarToken(nombre, tipo, contenido, atributos);
    assertEquals(result, expectedOutput);
})