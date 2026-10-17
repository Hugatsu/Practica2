import { leerCache, guardarCache } from "./cache.js";

const BASE_URL = "https://api.api-onepiece.com/v2";
const CLAVE_CACHE = "onepiece:personajes:en";

export async function obtenerPersonajes() {
  // 1. Si ya los tenemos guardados (y no han caducado), no repetimos la petición
  const enCache = leerCache(CLAVE_CACHE);
  if (Array.isArray(enCache)) return enCache;

  // 2. Si no, los pedimos a la API
  const respuesta = await fetch(`${BASE_URL}/characters/en`);

  // fetch solo rechaza con fallos de red; un 404 o 500 hay que comprobarlo a mano
  if (!respuesta.ok) {
    throw new Error(`La API respondió con un error (HTTP ${respuesta.status})`);
  }

  const datos = await respuesta.json();

  // Robustez: si la API cambia o devuelve algo raro, lo detectamos aquí
  if (!Array.isArray(datos)) {
    throw new Error("La API devolvió datos con un formato inesperado");
  }

  // 3. Solo guardamos respuestas buenas, nunca errores
  guardarCache(CLAVE_CACHE, datos);
  return datos;
}