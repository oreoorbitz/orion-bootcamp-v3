// prueba.test.js
import { describe, it, expect } from "vitest";
import {
  PRODUCTO_STRING_UNO,
  PRODUCTO_STRING_DOS,
  generarSKU,
  validarSKU,
  productoUno // Si has exportado la conversión de cadena a objeto con este nombre
} from "./index.js";

describe("Ejercicio 9: Generación y Validación de SKUs", () => {

  // Prueba de existencia de las cadenas
  it("debe tener PRODUCTO_STRING_UNO definido", () => {
    expect(PRODUCTO_STRING_UNO).toBeTypeOf("string");
  });
  it("debe tener PRODUCTO_STRING_DOS definido", () => {
    expect(PRODUCTO_STRING_DOS).toBeTypeOf("string");
  });

  // Prueba de conversión a objeto
  it("debe convertir PRODUCTO_STRING_UNO a un objeto correctamente", () => {
    // Si esperas que el usuario exporte la conversión con un nombre, e.g., productoUno:
    const esperado = {
      id: 42,
      handle: "simple-tee",
      vendor: "Velocity",
      title: "Camiseta Simple",
      price: 1999,
      tags: ["ropa", "camiseta", "oferta"]
    };
    expect(productoUno).toEqual(esperado);
  });

  // Pruebas de la función generarSKU
  describe("generarSKU", () => {
    it("debe existir y ser una función", () => {
      expect(generarSKU).toBeTypeOf("function");
    });

    it("debe retornar un string con 2 letras mayúsculas, guion, 4 dígitos y opcionalmente X", () => {
      // Ejemplo de objeto que el estudiante pudo haber parseado
      const productoEjemplo = {
        id: 42,
        vendor: "Velocity",
        price: 1999
      };
      const sku = generarSKU(productoEjemplo);
      // Se espera algo como "VE-0042X" si price > 100, con un vendor "Velocity"
      // Ajusta este test según tu lógica exacta
      const regex = /^[A-Z]{2}-\d{4}[A-Z]?$/;
      expect(regex.test(sku)).toBe(true);
    });

    it("debe manejar la parte opcional (X) sólo si price > 100", () => {
      const prodBarato = { id: 10, vendor: "Shop", price: 99 };
      const prodCaro   = { id: 10, vendor: "Shop", price: 101 };
      
      const skuBarato = generarSKU(prodBarato);
      const skuCaro   = generarSKU(prodCaro);

      // Ajusta la verificación según la lógica esperada en tu función
      expect(skuBarato.endsWith("X")).toBe(false); // sin X
      expect(skuCaro.endsWith("X")).toBe(true);    // con X
    });
  });

  // Pruebas de la función validarSKU
  describe("validarSKU", () => {
    it("debe existir y ser una función", () => {
      expect(validarSKU).toBeTypeOf("function");
    });
    
    it("debe validar correctamente un SKU válido", () => {
      const skuValido = "VE-0042X";
      expect(validarSKU(skuValido)).toBe(true);
    });

    it("debe rechazar un SKU con formato incorrecto", () => {
      const skuInvalido = "Velocity-42";
      expect(validarSKU(skuInvalido)).toBe(false);
    });
  });

});
