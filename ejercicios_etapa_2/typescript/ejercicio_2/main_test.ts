import { assertEquals } from "@std/assert";
import { clasificarTokens } from "./main.ts";

Deno.test("clasificarTokens", () => {
    const resultadoEspresado = [
        { tipo: 'apertura', nombre: 'div', contenido: null },
        { tipo: 'texto', nombre: null, contenido: 'Hello ' },
        { tipo: 'apertura', nombre: 'span', contenido: null },
        { tipo: 'texto', nombre: null, contenido: 'World' },
        { tipo: 'cierre', nombre: 'span', contenido: null },
        { tipo: 'cierre', nombre: 'div', contenido: null }
    ]

    const resultado = clasificarTokens([
        "<div>",
        "Hello ",
        "<span>",
        "World",
        "</span>",
        "</div>"
    ]);
    assertEquals(resultado, resultadoEspresado);
})