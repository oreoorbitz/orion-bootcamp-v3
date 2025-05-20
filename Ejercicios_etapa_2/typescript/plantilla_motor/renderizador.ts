enum TokenType {
  Apertura = "apertura",
  Cierre = "cierre",
  Autocierre = "autocierre",
  Texto = "texto"
}

interface Token {
  tipo: TokenType;
  nombre: string | null;
  contenido: string | null;
  atributos: Record<string, string> | null;
};

interface NodoElemento {
  tipo: "elemento";
  nombre: string;
  atributos: Record<string, string>;
  hijos: Nodo[];
};

interface NodoTexto {
  tipo: "texto";
  contenido: string;
};

type Nodo = NodoElemento | NodoTexto;

export function renderDOM(nodo: Nodo): string {
  if (nodo.tipo === "texto") {
    return nodo.contenido;
  }
  if (nodo.tipo === "elemento") {
    const atributos = Object.entries(nodo.atributos)
      .map(([clave, valor]) => ` ${clave}="${valor}"`)
      .join("");
    const hijos = nodo.hijos.map(renderDOM).join("");
    return `<${nodo.nombre}${atributos}>${hijos}</${nodo.nombre}>`;
  }
  return "";
}
