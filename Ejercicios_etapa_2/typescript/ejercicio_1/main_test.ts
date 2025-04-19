import { assertEquals } from "@std/assert";
import { tokenizarHTML } from './main.ts';

Deno.test('tokenizarHTML', () => {
    const HTML = `<html><head></head><body><h1>Hola Mundo</h1></body></html>`;

    const resultado = tokenizarHTML(HTML);

    const esperado = [
        '<html>',
        '<head>',
        '</head>',
        '<body>',
        '<h1>',
        'Hola Mundo',
        '</h1>',
        '</body>',
        '</html>'
    ]

    assertEquals(resultado, esperado);
})