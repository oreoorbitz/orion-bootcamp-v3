import { assertEquals } from "@std/assert";
import { construirNodo, construirArbol, TipoToken, Token, Nodo } from "./main.ts";

Deno.test("construirNodo construye correctamente un nodo de texto", () => {
    const tokenTexto: Token = {
        tipo: TipoToken.Texto,
        nombre: null,
        contenido: "Hola mundo",
        atributos: null
    };
    const expectedTexto: Nodo = {
        tipo: "texto",
        contenido: "Hola mundo"
    };
    const resultadoTexto = construirNodo(tokenTexto);
    assertEquals(resultadoTexto, expectedTexto);
});

Deno.test("construirArbol construye correctamente un árbol DOM simple", () => {
  const tokens: Token[] = [
    { tipo: TipoToken.Apertura, nombre: "div", contenido: null, atributos: {} },
    { tipo: TipoToken.Texto, nombre: null, contenido: "Hola", atributos: null },
    { tipo: TipoToken.Apertura, nombre: "span", contenido: null, atributos: {} },
    { tipo: TipoToken.Texto, nombre: null, contenido: "mundo", atributos: null },
    { tipo: TipoToken.Cierre, nombre: "span", contenido: null, atributos: null },
    { tipo: TipoToken.Cierre, nombre: "div", contenido: null, atributos: null }
  ];

  const expected: Nodo = {
    tipo: "elemento",
    nombre: "div",
    atributos: {},
    hijos: [
      {
        tipo: "texto",
        contenido: "Hola"
      },
      {
        tipo: "elemento",
        nombre: "span",
        atributos: {},
        hijos: [
          {
            tipo: "texto",
            contenido: "mundo"
          }
        ]
      }
    ]
  };

  const resultado = construirArbol(tokens);
  assertEquals(resultado, expected);
});
