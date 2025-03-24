// prueba.test.js

import { describe, it, expect, vi } from 'vitest';
import { procesarEnvio, entregarAlDestinatario, paquete } from './index.js';

describe('procesarEnvio', () => {
  it('debería entregar el paquete exitosamente en la mayoría de los casos', async () => {
    const log = vi.spyOn(console, 'log');
    const error = vi.spyOn(console, 'error');
    const entrega = vi.fn(entregarAlDestinatario);

    // Sobreescribimos temporalmente entregarAlDestinatario
    const original = entregarAlDestinatario;
    globalThis.entregarAlDestinatario = entrega;

    await new Promise((resolve) => {
      procesarEnvio();
      setTimeout(() => {
        // Al menos el log de "Fin del proceso logístico" debe ejecutarse siempre
        expect(log).toHaveBeenCalledWith("🔁 Fin del proceso logístico.");

        const huboError = error.mock.calls.length > 0;
        if (huboError) {
          expect(error.mock.calls[0][0]).toMatch("❌ Error en la entrega:");
        } else {
          expect(entrega).toHaveBeenCalledOnce();
        }

        // Restaurar mocks
        log.mockRestore();
        error.mockRestore();
        globalThis.entregarAlDestinatario = original;
        resolve();
      }, 4000); // esperar tiempo suficiente para que la promesa se resuelva o rechace
    });
  });
});
