import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { contexto } from "./contexto.ts";
const plantilla = await Deno.readTextFile("./tests/content_for_index.liquid");

const resultado = await liquidEngine(plantilla, contexto, true); // true = aplica layout
console.log("🧪 Resultado de prueba con layout:\n", resultado);
