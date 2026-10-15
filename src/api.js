const BASE_URL = "https://api.api-onepiece.com/v2";

export async function obtenerPersonajes() {
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

  return datos;
}