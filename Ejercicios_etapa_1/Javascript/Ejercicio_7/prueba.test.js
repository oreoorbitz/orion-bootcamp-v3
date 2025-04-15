// prueba.test.js

import { describe, it, expect, vi } from 'vitest';
import { crearUsuarioConPrototipo, Usuario, PubSub } from './index.js';

describe('crearUsuarioConPrototipo', () => {
  it('debería crear un objeto con nombre, rol y método saludar', () => {
    const usuario = crearUsuarioConPrototipo("Carlos", "editor");
    expect(usuario).toBeTypeOf("object");
    expect(usuario.nombre).toBe("Carlos");
    expect(usuario.rol).toBe("editor");
    expect(usuario.saludar()).toBe("Hola, soy Carlos y soy editor.");
  });
});

describe('Usuario (Clase)', () => {
  it('debería crear una instancia de Usuario con nombre, rol y método saludar', () => {
    const usuario = new Usuario("Lucía", "moderadora");
    expect(usuario).toBeInstanceOf(Usuario);
    expect(usuario.nombre).toBe("Lucía");
    expect(usuario.rol).toBe("moderadora");
    expect(usuario.saludar()).toBe("Hola, soy Lucía y soy moderadora.");
  });
});

describe('PubSub', () => {
  it('debería permitir suscribirse y recibir una publicación', () => {
    const pubsub = new PubSub();
    const fn = vi.fn();

    pubsub.suscribirse("NOTIFICACION", fn);
    pubsub.publicar("NOTIFICACION", { mensaje: "¡Funciona!" });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith({ mensaje: "¡Funciona!" });
  });

  it('debería permitir remover una suscripción', () => {
    const pubsub = new PubSub();
    const fn = vi.fn();

    const { remover } = pubsub.suscribirse("ALERTA", fn);
    remover(); // eliminamos el listener
    pubsub.publicar("ALERTA", { mensaje: "Esto no debe recibirse" });

    expect(fn).not.toHaveBeenCalled();
  });

  it('no debería fallar si se publica un evento sin suscriptores', () => {
    const pubsub = new PubSub();
    expect(() => pubsub.publicar("VACIO", { mensaje: "sin listeners" })).not.toThrow();
  });
});
