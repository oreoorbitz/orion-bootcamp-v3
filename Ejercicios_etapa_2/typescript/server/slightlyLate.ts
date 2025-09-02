import { zip } from "jsr:@deno-library/compress";
import { notificarReloadCSS } from "./wsServer.ts";
import { router } from "./router.ts";
// ⚠️ IMPORTANTE: Quitar la línea de prueba al final de contextPlease.ts antes de importar
import { crearContexto } from "./contextPlease.ts";
// 🛒 IMPORTAR la función del controlador
import { generarHTMLDeCarrito } from "./controller.ts";

// 🛒 SISTEMA DE CARRITO EN MEMORIA
interface CartItem {
    id: number;
    title: string;
    handle: string;
    price: number;
    quantity: number;
}

interface Cart {
    items: CartItem[];
}

// Map para almacenar carritos por token
const cartsStorage = new Map<string, Cart>();

// Función para generar UUID simple
function generateCartToken(): string {
    return 'cart_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Función para obtener o crear carrito
function getCart(token: string): Cart {
    if (!cartsStorage.has(token)) {
        cartsStorage.set(token, { items: [] });
    }
    return cartsStorage.get(token)!;
}

// Función para agregar item al carrito
async function addItemToCart(token: string, Id: number, quantity: number): Promise<Cart> {
    const cart = getCart(token);

    // Obtener contexto para buscar el producto
    const context = await crearContexto();

    // Validar que all_products sea un Map
    if (!(context.all_products instanceof Map)) {
        throw new Error("❌ El contexto no contiene all_products como Map");
    }

    const productos = Array.from(context.all_products.values());
    const product = productos.find((p: any) => Number(p.id) === Number(Id));

    if (!product) {
        console.error(`❌ Producto con ID ${Id} no encontrado`);
        throw new Error(`Producto con ID ${Id} no encontrado`);
    }

    console.log(`✅ Producto encontrado: ${product.title}`);

    // Verificar si el producto ya existe en el carrito
    const existingItem = cart.items.find(item => item.id === Id);

    if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`🔁 Cantidad actualizada: ${existingItem.quantity}`);
    } else {
        cart.items.push({
            id: product.id,
            title: product.title,
            handle: product.handle,
            price: product.price, // ← aquí estaba el error
            quantity: quantity
        });
        console.log(`🆕 Producto agregado al carrito: ${product.title}`);
    }

    return cart;
}

// 🛒 --- NUEVAS UTILIDADES DE CARRITO ---

// Recalcular totales
function recalculate(cart: Cart) {
  let item_count = 0;
  let total_price = 0;
  for (const it of cart.items) {
    item_count += it.quantity;
    total_price += it.price * it.quantity;
  }
  return { item_count, total_price };
}

// Establecer cantidad (remueve si qty <= 0)
function setQuantity(token: string, Id: number, quantity: number): Cart {
  const cart = getCart(token);

  if (!Number.isFinite(Id)) {
    console.warn(`⚠️ ID de producto inválido: ${Id}`);
    return cart;
  }

  const qty = Number.isFinite(quantity) ? quantity : 0;
  const idx = cart.items.findIndex(i => i.id === Id);

  if (idx === -1) {
    console.warn(`⚠️ Producto con ID ${Id} no está en el carrito`);
    return cart;
  }

  if (qty > 0) {
    cart.items[idx].quantity = qty;
    console.log(`🔁 Cantidad actualizada para producto ${Id}: ${qty}`);
  } else {
    cart.items.splice(idx, 1);
    console.log(`🗑️ Producto ${Id} eliminado del carrito`);
  }

  return cart;
}

// Vaciar carrito
function clearCart(token: string) {
  const cart = getCart(token);
  cart.items = [];
  return cart;
}

// Convertir carrito a JSON extendido
// JSON extendido para /cart.js y respuestas
function cartToJson(token: string, cart: Cart) {
  const { item_count, total_price } = recalculate(cart);
  return { token, items: cart.items, item_count, total_price };
}


// Función para parsear cookies
function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
    }
    return cookies;
}

// Función para crear header de cookie
function createCookieHeader(name: string, value: string, options: any = {}): string {
    let cookieStr = `${name}=${encodeURIComponent(value)}`;

    if (options.maxAge) {
        cookieStr += `; Max-Age=${options.maxAge}`;
    }
    if (options.path) {
        cookieStr += `; Path=${options.path}`;
    }
    if (options.httpOnly) {
        cookieStr += `; HttpOnly`;
    }
    if (options.sameSite) {
        cookieStr += `; SameSite=${options.sameSite}`;
    }

    return cookieStr;
}

// 📋 Lista de endpoints .js soportados (ACTUALIZADA)
const JS_ENDPOINTS = ['/cart.js'];

// 🛒 Función para manejar el endpoint /cart.js (ACTUALIZADA PARA USAR MEMORIA)
async function manejarCartJs(cartToken: string): Promise<Response> {
    try {
        // Obtener carrito desde memoria en lugar del archivo
        const cart = getCart(cartToken);
        const responseData = cartToJson(cartToken, cart);

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("❌ Error obteniendo carrito desde memoria:", error);
        return new Response(JSON.stringify({ error: "No se pudo cargar el carrito" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// 🛒 NUEVA FUNCIÓN: Manejar POST /cart/add
async function manejarCartAdd(req: Request, cartToken: string): Promise<Response> {
    try {
        const requestBody = await req.json();
        const { id, quantity = 1 } = requestBody;
        if (!id) {
            return new Response(
                JSON.stringify({ error: 'ID de producto requerido' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Agregar item al carrito
        const updatedCart = await addItemToCart(cartToken, parseInt(id), parseInt(quantity));
        const responseData = cartToJson(cartToken, updatedCart);

        console.log(`✅ Producto ${id} agregado al carrito. Items en carrito: ${updatedCart.items.length}`);

        return new Response(
            JSON.stringify(responseData),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );

    } catch (error) {
        console.error('❌ Error en /cart/add:', error);
        return new Response(
            JSON.stringify({ error: 'Error al agregar producto al carrito' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// 🔧 Función para manejar todos los endpoints .js (ACTUALIZADA)
async function manejarEndpointsJs(pathname: string, cartToken: string): Promise<Response | null> {
    switch (pathname) {
        case '/cart.js':
            return await manejarCartJs(cartToken);
        default:
            return null;
    }
}

// 🛒 REEMPLAZAR la función manejarRutaCart anterior con esta nueva versión
async function manejarRutaCart(cartToken: string, shouldSetCookie: boolean): Promise<Response> {
    try {
        console.log(`🛒 Procesando ruta /cart con token: ${cartToken}`);

        // 🎨 USAR EL CONTROLADOR para procesar la plantilla correctamente
        const htmlProcessed = await generarHTMLDeCarrito(cartToken, cartsStorage);

        const headers: HeadersInit = { "Content-Type": "text/html" };

        if (shouldSetCookie) {
            headers['Set-Cookie'] = createCookieHeader('cart_token', cartToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                httpOnly: true,
                sameSite: 'Lax'
            });
        }

        return new Response(htmlProcessed, { headers });

    } catch (error) {
        console.error("⚠️ Error sirviendo /cart:", error);
        return new Response(`
            <html>
                <body>
                    <h1>Error en el carrito</h1>
                    <p>Error: ${error.message}</p>
                    <a href="/">Volver a la tienda</a>
                </body>
            </html>
        `, {
            status: 500,
            headers: { "Content-Type": "text/html" }
        });
    }
}



// 🛒 TAMBIÉN ACTUALIZAR manejarRutas para usar el contexto con carrito en otras páginas
async function manejarRutas(url: URL, shouldSetCookie: boolean, cartToken: string): Promise<Response> {
    let filePath: string;

    if (url.pathname === "/") {
        filePath = "server/themes/dev/dist/content_for_index.html";
    } else if (url.pathname === "/theme.css") {
        filePath = "server/themes/dev/dist/theme.css";
    } else if (url.pathname.startsWith("/assets/")) {
       const assetName = url.pathname.replace("/assets/", "");
       filePath = `server/themes/dev/dist/assets/${assetName}`;
    } else {
        // Usar el router para resolver todas las rutas
        const routeResult = router.resolve(url.pathname);

        if (routeResult) {
            if (routeResult.directory && routeResult.handle) {
                // Ruta dinámica (product/collection)
                filePath = `server/themes/dev/dist/${routeResult.directory}/${routeResult.handle}.html`;
            } else {
                // Ruta estática (content_for_index)
                filePath = `server/themes/dev/dist/${routeResult.type}.html`;
            }
        } else {
            // Si no se encuentra, servir 404.html directamente
            console.log(`⚠️ Ruta no encontrada: ${url.pathname}`);
            return await servirArchivo404(shouldSetCookie, cartToken);
        }
    }

    console.log(`📂 Intentando servir archivo: ${filePath}`);

    try {
        let archivo = await Deno.readTextFile(filePath);

        // 🛒 NOTA: Los archivos HTML ya están pre-procesados por el controlador
        // Pero podrías inyectar información del carrito aquí si es necesario
        // Por ejemplo, para mostrar el contador de items en el header

        if (filePath.endsWith(".html")) {
            // Opcionalmente, podrías inyectar datos del carrito en el HTML
            const cart = getCart(cartToken);
            const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

            // Ejemplo: reemplazar un placeholder en el HTML con el contador
            archivo = archivo.replace(/\{\{cart_item_count\}\}/g, itemCount.toString());

            console.log(`🛒 HTML servido con ${itemCount} items en carrito`);
        }

        // Determinar el Content-Type
        const contentType = filePath.endsWith(".css") ? "text/css" : "text/html";
        const headers: HeadersInit = { "Content-Type": contentType };

        // 🍪 Establecer cookie si es necesaria
        if (shouldSetCookie && contentType === "text/html") {
            headers['Set-Cookie'] = createCookieHeader('cart_token', cartToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 días
                path: '/',
                httpOnly: true,
                sameSite: 'Lax'
            });
            console.log(`🍪 Cookie establecida para ${url.pathname}: ${cartToken}`);
        }

        return new Response(archivo, { headers });

    } catch (error) {
        console.log(`⚠️ Archivo no encontrado: ${filePath}`);
        return await servirArchivo404(shouldSetCookie, cartToken);
    }
}

// 📄 Función para servir archivo 404 (ACTUALIZADA CON COOKIES)
async function servirArchivo404(shouldSetCookie: boolean, cartToken: string): Promise<Response> {
    try {
        const archivo404 = await Deno.readTextFile("server/themes/dev/dist/404.html");

        const headers: HeadersInit = { "Content-Type": "text/html" };

        if (shouldSetCookie) {
            headers['Set-Cookie'] = createCookieHeader('cart_token', cartToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                httpOnly: true,
                sameSite: 'Lax'
            });
        }

        return new Response(archivo404, {
            status: 404,
            headers
        });
    } catch {
        // Si no existe 404.html, devolver mensaje básico
        const headers: HeadersInit = { "Content-Type": "text/html" };

        if (shouldSetCookie) {
            headers['Set-Cookie'] = createCookieHeader('cart_token', cartToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                httpOnly: true,
                sameSite: 'Lax'
            });
        }

        return new Response("404 - Página no encontrada", {
            status: 404,
            headers
        });
    }
}

async function manejarPeticionThemeUpdate(req: Request, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");
    const rutaTema = `./server/themes/dev`;

    try {
        const formulario = await req.formData()
        const archivo = formulario.get("archivo") as File
        const carpetaGuardado = formulario.get("carpeta") as string
        const tipoExtension = formulario.get("tipoExtension") as string
        const templateEspecifico = formulario.get("templateEspecifico") as string
        const templateNombre = formulario.get("templateNombre") as string

        const buffer = await archivo.arrayBuffer()
        const uint = new Uint8Array(buffer)
        const nombre = archivo.name
        const rutaZip = `${rutaTema}/${nombre}.zip`;
        const rutaDestino = carpetaGuardado === "assets"
            ? `${rutaTema}/dist/${carpetaGuardado}`
            : `${rutaTema}/${carpetaGuardado}`;

        await Deno.writeFile(rutaZip, uint)

        // 📂 Asegurar que la carpeta existe antes de continuar
        try {
            await Deno.stat(rutaDestino);
        } catch {
            console.log(`📂 La carpeta ${rutaDestino} no existe, creándola...`);
            await Deno.mkdir(rutaDestino, { recursive: true });
        }

        // 📦 Descomprimiendo el ZIP en la ruta correcta
        console.log(`📦 Desempaquetando el ZIP en: ${rutaDestino}`);
        await zip.uncompress(rutaZip, rutaDestino);

        // Si el archivo es `.css`, enviamos la señal de recarga de estilos
        if (tipoExtension == "css") {
            notificarReloadCSS();
            console.log("📤 Señal de recarga de CSS enviada a los clientes WebSocket.");
        }

        // 🗑️ Ahora eliminamos zip
        try {
            await Deno.remove(rutaZip, { recursive: true });
            console.log(`La carpeta ${rutaZip} ha sido eliminada correctamente.`);
        } catch {
            console.log(`La carpeta ${rutaZip} no ha podido ser eliminada o no existía`);
        }

        console.log("antes del callback")

        // ✨ Pasar el nombre del template específico al callback
        let changedTemplate: string | undefined;
        if (templateEspecifico === "true" && templateNombre) {
            changedTemplate = templateNombre;
            console.log(`🎯 Template específico detectado: ${changedTemplate}`);
        }

        return await callback(changedTemplate);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

// 🔄 MODIFICAR iniciarServidor para agregar la ruta /cart
export function iniciarServidor(puerto: number = 3000, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        // 🍪 Obtener o generar token del carrito
        const cookies = parseCookies(req.headers.get('cookie') || '');
        let cartToken = cookies.cart_token;
        let shouldSetCookie = false;

        if (!cartToken) {
            cartToken = generateCartToken();
            shouldSetCookie = true;
            console.log(`🆕 Nuevo token de carrito generado: ${cartToken}`);
        }

        // POST /theme-update
        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        // 🛒 POST /cart/add
        if (req.method === "POST" && url.pathname === "/cart/add") {
            const response = await manejarCartAdd(req, cartToken);

            if (shouldSetCookie) {
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Set-Cookie', createCookieHeader('cart_token', cartToken, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/',
                    httpOnly: true,
                    sameSite: 'Lax'
                }));
                return new Response(response.body, { status: response.status, headers: newHeaders });
            }

            return response;
        }

        // 🛒 POST /cart/update
        if (req.method === "POST" && url.pathname === "/cart/update") {
            try {
                const body = await req.json();
                const updates = body.updates || {};

                for (const [pid, qty] of Object.entries(updates)) {
                    setQuantity(cartToken, parseInt(pid), parseInt(qty as any));
                }

                const updatedCart = getCart(cartToken);
                const responseData = cartToJson(cartToken, updatedCart);

                return new Response(JSON.stringify(responseData), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                console.error("❌ Error en /cart/update:", error);
                return new Response(JSON.stringify({ error: "Error al actualizar carrito" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // 🛒 POST /cart/clear
        if (req.method === "POST" && url.pathname === "/cart/clear") {
            clearCart(cartToken);
            return new Response(null, {
                status: 302,
                headers: { Location: "/cart" }
            });
        }

        // 🛒 GET /cart
        if (req.method === "GET" && url.pathname === "/cart") {
            return await manejarRutaCart(cartToken, shouldSetCookie);
        }

        // 🛒 Verificar si es un endpoint .js
        if (JS_ENDPOINTS.includes(url.pathname)) {
            const jsResponse = await manejarEndpointsJs(url.pathname, cartToken);
            if (jsResponse) {
                if (shouldSetCookie) {
                    const newHeaders = new Headers(jsResponse.headers);
                    newHeaders.set('Set-Cookie', createCookieHeader('cart_token', cartToken, {
                        maxAge: 60 * 60 * 24 * 30,
                        path: '/',
                        httpOnly: true,
                        sameSite: 'Lax'
                    }));
                    return new Response(jsResponse.body, { status: jsResponse.status, headers: newHeaders });
                }
                return jsResponse;
            }
        }

        // 🎯 Manejar todas las demás rutas
        return await manejarRutas(url, shouldSetCookie, cartToken);
    });
}
