// main.rs
// EJERCICIO 7: PATRÓN FACTORY Y PUBSUB EN RUST
//
// Instrucciones:
//  1. Implementa el patrón Factory para crear objetos Usuario.
//     Cada objeto Usuario debe tener las propiedades "nombre" y "rol", y un método "saludar" que retorne un mensaje de saludo.
//  2. Implementa una estructura PubSub que permita suscribirse a eventos y publicar información.
//     - Define dos constantes para los temas: MOSTRAR_NOTIFICACION_ERROR y MOSTRAR_NOTIFICACION_EXITO.
//     - El método "suscribirse" debe aceptar un evento y un escuchador, y retornar una Suscripcion con un método "remover" para cancelar la suscripción.
//     - El método "publicar" debe ejecutar todos los escuchadores asociados a un evento, pasando la información proporcionada.
//  3. Incluye pruebas unitarias en el mismo archivo para verificar la funcionalidad de Usuario y PubSub.

use std::collections::HashMap;

pub struct Usuario {
    pub nombre: String,
    pub rol: String,
}

impl Usuario {
    pub fn new(nombre: &str, rol: &str) -> Self {
        // TODO: Implementa la creación de una nueva instancia de Usuario.
        Self {
          nombre: nombre.to_string(),
          rol: rol.to_string()
        }
    }

    pub fn saludar(&self) -> String {
        // TODO: Retorna un saludo en el formato "Hola, soy <nombre> y soy <rol>".
        format!("Hola, soy {} y soy {}", self.nombre, self.rol)
    }
}

pub fn crear_usuario_con_factory(nombre: &str, rol: &str) -> Usuario {
    // TODO: Retorna una nueva instancia de Usuario utilizando el método new.
  Usuario::new(nombre, rol)
}


pub const MOSTRAR_NOTIFICACION_ERROR: &str = "MOSTRAR_NOTIFICACION_ERROR";
pub const MOSTRAR_NOTIFICACION_EXITO: &str = "MOSTRAR_NOTIFICACION_EXITO";

pub type Info = HashMap<String, String>;
pub type Escuchador = Box<dyn Fn(&Info)>;

pub struct PubSub {
    temas: HashMap<String, Vec<Escuchador>>,
}

impl PubSub {
    pub fn new() -> Self {
        // TODO: Crea una nueva instancia de PubSub inicializando la propiedad temas.
        pub struct eventos{}
    }

    pub fn suscribirse<F>(&mut self, evento: &str, escuchador: F) -> Suscripcion
    where
        F: Fn(&Info) + 'static,
    {
        // TODO: Si el evento no existe en self.temas, inicialízalo con un vector vacío.
        // Agrega el escuchador al vector correspondiente y guarda su índice.
        // Retorna una Suscripcion con el evento, índice y una referencia mutable a self.

    }

    pub fn publicar(&self, evento: &str, info: &Info) {
        // TODO: Si existen escuchadores para el evento, itera sobre ellos y ejecútalos pasando la info.

    }
}

pub struct Suscripcion {
    evento: String,
    indice: usize,
    pubsub: *mut PubSub,
}

impl Suscripcion {
    pub fn remover(self) {
        // TODO: Accede a la estructura PubSub a través de pubsub y remueve el escuchador en el índice indicado.
        unimplemented!()
    }
}

fn main() {
    // Ejemplo de uso del patrón Factory:
    // let usuario = crear_usuario_con_factory("Luis", "admin");
    // println!("{}", usuario.saludar()); // "Hola, soy Luis y soy admin"

    // Ejemplo de uso de PubSub:
    // let mut pubsub = PubSub::new();
    // let suscripcion = pubsub.suscribirse(MOSTRAR_NOTIFICACION_EXITO, |info| {
    //     if let Some(mensaje) = info.get("mensaje") {
    //         println!("Se recibió el evento con info: {}", mensaje);
    //     }
    // });
    // let mut info = Info::new();
    // info.insert("mensaje".to_string(), "¡Hola mundo!".to_string());
    // pubsub.publicar(MOSTRAR_NOTIFICACION_EXITO, &info);
    // suscripcion.remover();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_usuario_saludar() {
        // TODO: Crea un usuario con el factory y verifica que su método saludar retorna el mensaje correcto.
        unimplemented!()
    }

    #[test]
    fn test_pubsub_publicar() {
        // TODO: Crea una instancia de PubSub, suscríbete a un evento y verifica que al publicar dicho evento se reciba la información correcta.
        unimplemented!()
    }

    #[test]
    fn test_pubsub_remover() {
        // TODO: Suscríbete a un evento, publica el evento para incrementar un contador, remueve la suscripción,
        // y luego publica nuevamente para verificar que la suscripción removida no es llamada.
        unimplemented!()
    }
}
