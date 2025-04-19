import { assertEquals } from "@std/assert";
import { objetizaratributo  } from "./main.ts"

Deno.test("Test de la función objetizaratributo", () => {
    const input = 'class="btn" id="main"';
    const expectedOutput = { class: "btn", id: "main" };
    const result = objetizaratributo(input);
    assertEquals(result, expectedOutput);
})