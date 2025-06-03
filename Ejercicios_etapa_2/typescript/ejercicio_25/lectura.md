# 🧠 Lecture: Comunicación entre cliente y servidor + MVC

En este módulo comienzas a dividir tu aplicación como lo haría una plataforma como Shopify. Para lograrlo, necesitas entender dos conceptos clave:

---

## 🌐 1. Comunicación HTTP entre cliente y servidor

Cuando ejecutas `main.ts` y haces un `fetch()`, estás enviando una **solicitud HTTP** al servidor local. Este flujo es muy común en aplicaciones web modernas:

### 📦 El ciclo básico:

1. El **cliente** (por ejemplo, `main.ts`) hace una solicitud a una URL como `http://localhost:3000/theme-update`
2. El **servidor** (por ejemplo, `controller.ts`) recibe esa solicitud
3. El servidor procesa la solicitud (por ejemplo, regenera HTML) y devuelve una **respuesta**
4. El cliente puede usar esa respuesta, mostrarla o continuar con otra acción

Este patrón es exactamente el que usan plataformas como Shopify cuando editas temas o haces cambios en configuraciones visuales.

---

## 🏛️ 2. Patrón MVC (Modelo-Vista-Controlador)

El patrón **MVC** te ayuda a separar responsabilidades para que tu aplicación sea más clara y escalable.

| Parte        | Rol                                                       | Ejemplo en tu proyecto                                   |
|--------------|------------------------------------------------------------|-----------------------------------------------------------|
| Modelo (Model)     | Representa los datos                                 | Objetos como `settings`, `producto`, `collections`        |
| Vista (View)       | Muestra los datos al usuario                         | Archivos `.liquid` dentro de `themes/dev/`                |
| Controlador (Controller) | Procesa las acciones y genera resultados        | El archivo `controller.ts`, que renderiza el HTML final   |

Esta separación te permite modificar la estructura del HTML (Vista) sin tener que cambiar los datos (Modelo), o cambiar la forma de generar el HTML (Controlador) sin alterar el resto del sistema.

---

## 🧩 Conceptos adicionales importantes

- **Fetch API**: `fetch()` está disponible en Deno y permite que un archivo TypeScript actúe como cliente HTTP sin dependencias externas.
- **Servidor local**: Funciona como el "backend" que espera peticiones y responde con acciones o contenido.
- **Inyección de contenido**: Aunque este módulo no lo aborda directamente, recuerda que herramientas como `injector()` permiten insertar scripts (como hot reload) en el HTML ya generado.
- **Modularidad**: Separar tu lógica en `controller.ts` y mover el contenido a `themes/dev/` es un paso importante para crear un entorno que simule una tienda real.

---

## 🛠️ En resumen:

- Aprendiste cómo hacer que `main.ts` actúe como un cliente que pide trabajo al servidor
- Entendiste cómo `controller.ts` se convierte en el orquestador de la transformación de datos en HTML
- Separaste claramente el modelo, vista y controlador siguiendo el patrón MVC

Esto te prepara para los siguientes módulos, donde el CLI y el servidor trabajarán juntos como un sistema completo de desarrollo temático.
