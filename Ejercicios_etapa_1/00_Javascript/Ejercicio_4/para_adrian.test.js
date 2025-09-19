// para_adrian.test.js
import { describe, it, expect } from 'vitest';
import {
  determinarTipoNumero,
  esPositivo,
  dividirSeguro,
  evaluarLongitud,
  TEXTO_DIVISOR,
  TEXTO_NUMERO_ENTERO,
  TEXTO_NUMERO_DECIMAL,
  TEXTO_CORTO,
  TEXTO_LARGO
} from './para_adrian.js';

describe("determinarTipoNumero", () => {
  it("debe retornar 'Número entero: 10' para 10.0", () => {
    expect(determinarTipoNumero(10.0)).toBe(`${TEXTO_NUMERO_ENTERO} 10`);
  });
  it("debe retornar 'Número decimal: 3.14' para 3.14", () => {
    expect(determinarTipoNumero(3.14)).toBe(`${TEXTO_NUMERO_DECIMAL} 3.14`);
  });
  it("debe retornar 'Número decimal: 42.5' para 42.5", () => {
    expect(determinarTipoNumero(42.5)).toBe(`${TEXTO_NUMERO_DECIMAL} 42.5`);
  });
  it("debe retornar 'Número entero: 42' para 42.0", () => {
    expect(determinarTipoNumero(42.0)).toBe(`${TEXTO_NUMERO_ENTERO} 42`);
  });
});

describe("esPositivo", () => {
  it("debe retornar true para un número positivo", () => {
    expect(esPositivo(3.14)).toBe(true);
  });
  it("debe retornar false para un número negativo", () => {
    expect(esPositivo(-1.0)).toBe(false);
  });
  it("debe retornar false para cero", () => {
    expect(esPositivo(0.0)).toBe(false);
  });
});

describe("dividirSeguro", () => {
  it("debe retornar el cociente cuando el divisor no es cero", () => {
    expect(dividirSeguro(10, 2)).toBe(5);
  });
  it("debe retornar TEXTO_DIVISOR cuando el divisor es cero", () => {
    expect(dividirSeguro(10, 0)).toBe(TEXTO_DIVISOR);
  });
});

describe("evaluarLongitud", () => {
  it("debe indicar que un texto corto es corto", () => {
    expect(evaluarLongitud("Ada")).toBe(`El texto 'Ada' ${TEXTO_CORTO}`);
  });
  it("debe indicar que un texto largo es largo", () => {
    expect(evaluarLongitud("Lovelace")).toBe(`El texto 'Lovelace' ${TEXTO_LARGO}`);
  });
});
