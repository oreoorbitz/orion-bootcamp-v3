import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { crearContexto } from "./contextPlease.ts";

async function getContext() {
  return await crearContexto();
}

function path(stl: string) {
  return new URL(stl, import.meta.url).pathname;
}

function getTemplatePath(nombre: string): string {
  const templatesDir = path("../server/themes/dev/templates/");
  return `${templatesDir}${nombre}.liquid`;
}

function getOutputDirectory(templateType: string): string {
  const baseOutputDir = path("../server/themes/dev/dist/");
  if (templateType === "product") return `${baseOutputDir}products/`;
  if (templateType === "collection") return `${baseOutputDir}collections/`;
  return baseOutputDir;
}

function getOutputFileName(templateType: string, itemHandle?: string): string {
  if (templateType === "content_for_index") return "content_for_index.html";
  if ((templateType === "product" || templateType === "collection") && itemHandle) {
    return `${itemHandle}.html`;
  }
  return `${templateType}.html`;
}

const layoutPath = path("../server/themes/dev/layout/theme.liquid");

async function generarHTMLDeTemplate(templateName: string, itemHandle?: string): Promise<string> {
  try {
    console.log(`✅ Generando HTML para template: ${templateName}${itemHandle ? ` (${itemHandle})` : ''}`);
    const templatePath = getTemplatePath(templateName);

    try {
      await Deno.stat(templatePath);
    } catch {
      if (templateName === "404") {
        console.log(`❌ Template 404 no encontrado`);
        return "Template 404 no encontrado";
      }
      console.log(`❌ Template ${templateName} no encontrado, usando 404`);
      return await generarHTMLDeTemplate("404");
    }

    const templateContent = await Deno.readTextFile(templatePath);

    const baseContext = await getContext();
    let templateContext = { ...baseContext, template_type: templateName };

   if (templateName === "product" && itemHandle) {
    const baseContext: any = await getContext?.() ?? await crearContexto();

    // Sacar un array de productos desde varias rutas
    const productsArray =
        Array.isArray(baseContext?.products)
            ? baseContext.products
            : baseContext?.all_products && typeof baseContext.all_products === "object"
                ? Object.values(baseContext.all_products)
                : Array.isArray(baseContext?.data?.products)
                    ? baseContext.data.products
                    : [];

    // Buscar producto por handle, slug o id
    const product = productsArray.find(
        (p: any) =>
            p?.handle === itemHandle ||
            p?.slug === itemHandle ||
            String(p?.id ?? "") === itemHandle
    );

    if (product) {
        templateContext = {
            ...templateContext,
            product,
            template_type: "product"
        };
    } else {
        console.log(`⚠️ No se encontró el producto con handle "${itemHandle}"`);
    }
}

    if (templateName === "collection" && itemHandle) {
      const collection = baseContext.collections?.find(c => c.handle === itemHandle);
      if (collection) {
        templateContext = { ...templateContext, collection, template_type: "collection" };
      }
    }

    const renderedContent = await liquidEngine(templateContent, templateContext);
    const layoutContext = { ...templateContext, content_for_layout: renderedContent };
    const layoutContent = await Deno.readTextFile(layoutPath);
    const finalTemplate = await liquidEngine(layoutContent, layoutContext);
    const arbolDOM = htmlParser(finalTemplate);
    const htmlFinal = renderDOM(arbolDOM);

    const outputDirectory = getOutputDirectory(templateName);
    const outputFileName = getOutputFileName(templateName, itemHandle);
    const outputPath = `${outputDirectory}${outputFileName}`;

    try {
      await Deno.stat(outputDirectory);
    } catch {
      console.log(`📂 Creando carpeta: ${outputDirectory}`);
      await Deno.mkdir(outputDirectory, { recursive: true });
    }

    await Deno.writeTextFile(outputPath, finalTemplate);
    console.log(`✅ Archivo ${outputFileName} generado exitosamente en ${outputDirectory}`);

    const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
    await injector(tsPath, outputPath);
    console.log(`✅ Hot Reload inyectado correctamente en ${outputFileName}.`);

    return `HTML generado correctamente para ${templateName}${itemHandle ? ` (${itemHandle})` : ''}`;
  } catch (error) {
    console.error(`❌ Error al generar HTML para ${templateName}:`, error);
    return `Error al generar HTML para ${templateName}`;
  }
}

// Función para generar páginas de productos (versión compatible con all_products)
async function generarPaginasDeProductos(): Promise<string[]> {
  const resultados: string[] = [];

  // 1) Verificar que exista product.liquid
  try {
    const productTemplatePath = getTemplatePath("product");
    await Deno.stat(productTemplatePath);
  } catch {
    console.log("⚠️ No se encontró template product.liquid");
    return resultados;
  }

  // 2) Obtener SIEMPRE un contexto fresco
  const baseContext: any = await getContext?.() ?? await crearContexto();

  // 3) Localizar productos en distintas rutas comunes
  let products: any[] = [];
  if (Array.isArray(baseContext?.products)) {
    products = baseContext.products;
  } else if (Array.isArray(baseContext?.data?.products)) {
    products = baseContext.data.products;
  } else if (baseContext?.all_products && typeof baseContext.all_products === "object") {
    // ⚠️ aquí convertimos el objeto a array
    products = Object.values(baseContext.all_products);
  } else if (Array.isArray(baseContext?.items)) {
    products = baseContext.items;
  }

  // 4) Logs de diagnóstico
  console.log("🔎 Keys del contexto:", Object.keys(baseContext ?? {}));
  console.log("🔎 products es array?", Array.isArray(products), "len:", products.length);

  if (!products.length) {
    console.log("⚠️ No se encontraron productos en el contexto (post-zip)");
    return resultados;
  }

  // 5) Generar páginas por cada producto
  console.log(`🛍️ Generando ${products.length} páginas de productos...`);
  for (const product of products) {
    const handle = product?.handle ?? product?.slug ?? String(product?.id ?? "");
    if (!handle) {
      console.log("⚠️ Producto sin handle/slug/id; se omite.", product?.title ?? product?.name ?? "");
      continue;
    }
    console.log(`🔄 Generando página para producto: ${handle}`);
    const resultado = await generarHTMLDeTemplate("product", handle);
    resultados.push(resultado);
  }

  return resultados;
}



async function generarPaginasDeColecciones(): Promise<string[]> {
  const resultados: string[] = [];
  try {
    const collectionTemplatePath = getTemplatePath("collection");
    await Deno.stat(collectionTemplatePath);

    const baseContext = await getContext();
    if (Array.isArray(baseContext.collections)) {
      console.log(`📂 Generando ${baseContext.collections.length} páginas de colecciones...`);
      for (const collection of baseContext.collections) {
        console.log(`🔄 Generando página para colección: ${collection.handle}`);
        const resultado = await generarHTMLDeTemplate("collection", collection.handle);
        resultados.push(resultado);
      }
    } else {
      console.log("⚠️ No se encontraron colecciones en el contexto");
    }
  } catch {
    console.log("⚠️ No se encontró template collection.liquid");
  }
  return resultados;
}

async function regenerarTodosLosTemplates(): Promise<string> {
  try {
    console.log("🔄 Regenerando todos los templates...");
    const resultados: string[] = [];

    console.log("📋 Regenerando content_for_index...");
    const resultadoIndex = await generarHTMLDeTemplate("content_for_index");
    resultados.push(resultadoIndex);

    try {
      const template404Path = getTemplatePath("404");
      await Deno.stat(template404Path);
      console.log("📄 Regenerando template 404...");
      const resultado404 = await generarHTMLDeTemplate("404");
      resultados.push(resultado404);
    } catch {
      console.log("⚠️ No se encontró template 404.liquid");
    }

    console.log("🛍️ Generando páginas de productos...");
    resultados.push(...await generarPaginasDeProductos());

    console.log("📂 Generando páginas de colecciones...");
    resultados.push(...await generarPaginasDeColecciones());

    notificarRecargaPagina();
    console.log("📤 Señal de recarga enviada a los clientes WebSocket.");
    return `Templates regenerados: ${resultados.length} archivos generados`;
  } catch (error) {
    console.error("❌ Error al regenerar templates:", error);
    return "Error al regenerar templates";
  }
}

export async function recargarYGenerarHTML() {
  return await generarHTMLDeTemplate("content_for_index");
}

export async function onThemeUpdate(changedTemplate?: string) {
  let resultado: string;
  if (changedTemplate) {
    const templateName = changedTemplate.replace(/\.(liquid)$/i, "");
    if (templateName === "content_for_index" || templateName === "404") {
      console.log(`🎨 Regenerando template específico: ${templateName}`);
      resultado = await generarHTMLDeTemplate(templateName);
    } else if (templateName === "product") {
      console.log(`🛍️ Regenerando todas las páginas de productos...`);
      resultado = `Páginas de productos regeneradas: ${(await generarPaginasDeProductos()).length}`;
    } else if (templateName === "collection") {
      console.log(`📂 Regenerando todas las páginas de colecciones...`);
      resultado = `Páginas de colecciones regeneradas: ${(await generarPaginasDeColecciones()).length}`;
    } else {
      console.log(`⚠️ Template ${templateName} no reconocido, regenerando todos`);
      resultado = await regenerarTodosLosTemplates();
    }
  } else {
    console.log("🎨 Regenerando todos los templates...");
    resultado = await regenerarTodosLosTemplates();
  }
  console.log("✅ Tema actualizado correctamente.");
  return new Response(resultado, { status: 200 });
}

iniciarServidor(3000, onThemeUpdate);
