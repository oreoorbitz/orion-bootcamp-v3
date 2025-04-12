import { assertEquals } from "@std/assert";
import { analizarHTML, identificarTags } from "./main.ts";

Deno.test("analizarHTML extrae correctamente apertura, contenido y cierre", () => {
  const resultado = analizarHTML("<div>Hello</div>");
  assertEquals(resultado, {
    apertura: "<div>",
    contenido: "Hello",
    cierre: "</div>"
  });

  const resultado2 = analizarHTML("<p>Hola Mundo</p>");
  assertEquals(resultado2, {
    apertura: "<p>",
    contenido: "Hola Mundo",
    cierre: "</p>"
  });
});

/**
 * PRUEBA: identificarTags()
 *
 * Verifica que la función `identificarTags` detecte correctamente los tags
 */
Deno.test("identificarTags identifica correctamente los tags", () => {
  const resultado = identificarTags("<div><p>Hola</p></div>");
  assertEquals(resultado, ["div", "p", "/p", "/div"]);

  const resultado2 = identificarTags("<section><h1>Title</h1></section>");
  assertEquals(resultado2, ["section", "h1", "/h1", "/section"]);
});
