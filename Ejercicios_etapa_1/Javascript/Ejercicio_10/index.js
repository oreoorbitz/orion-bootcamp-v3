// @ts-check

// Constantes de mensajes
const CONTENIDO_LIBRO = "libro";
const ESTADO_EN_TRANSITO = "en tránsito";
const ERROR_PAQUETE_PERDIDO = "El paquete se perdió en tránsito";

const LOG_BODEGA = "📍 En la bodega central: revisando el paquete...";
const LOG_CAMINO = "🚚 En camino al centro de distribución...";
const LOG_ENTREGA = "📬 Entregando al destinatario...";
const LOG_FIN = "🔁 Fin del proceso logístico.";
const LOG_PAQUETE_RECIBIDO = "📦 El destinatario recibió el paquete:";

const ERROR_ENTREGA = "❌ Error en la entrega:";

// Promesa que simula la llegada de un paquete.
const paquete = new Promise( (resolve, reject) => {
    const tiempoDeEntrega = Math.floor(Math.random() * 3000) + 1000;
    setTimeout(() => {
        const exitoso = Math.random() > 0.2; // 80% de probabilidad de éxito
        if (exitoso) {
            resolve({ contenido: CONTENIDO_LIBRO, estado: ESTADO_EN_TRANSITO });
        } else {
            reject(new Error(ERROR_PAQUETE_PERDIDO));
        }
    }, tiempoDeEntrega);
});

/**
 * Función que representa al destinatario final recibiendo el paquete.
 * Simula una mutación, como marcarlo como "entregado".
 * @param {{ contenido: string, estado: string }} paquete
 */
const entregarAlDestinatario = (paquete) => {
    paquete.estado = "entregado";
    console.log(`${LOG_PAQUETE_RECIBIDO} ${paquete.contenido}. Estado: ${paquete.estado}`);
};

/**
 * procesarEnvio
 *
 * Implementa el proceso logístico utilizando .then(), .catch() y .finally().
 * Utiliza las siguientes acciones:
 *  - Revisar el paquete en la bodega central y marcarlo como revisado.
 *  - Actualizar la ubicación a "centro de distribución".
 *  - Entregar el paquete al destinatario.
 *  - En caso de error, mostrar un mensaje de error.
 *  - Finalmente, mostrar el mensaje de fin del proceso logístico.
 */
const procesarEnvio = () => {
    // TODO: Implementa el proceso logístico usando .then(), .catch() y .finally().
};

/**
 * procesarEnvioAsync
 *
 * Implementa el proceso logístico utilizando async/await.
 * Utiliza try/catch/finally para manejar la promesa "paquete":
 *  - En el bloque try, espera la resolución del paquete, marca el paquete como revisado, actualiza su ubicación,
 *    y llama a entregarAlDestinatario.
 *  - En el bloque catch, captura el error e imprime un mensaje de error.
 *  - En el bloque finally, imprime el mensaje de fin del proceso logístico.
 */
const procesarEnvioAsync = async () => {
    // TODO: Implementa el proceso logístico usando async/await, try/catch/finally.
};
