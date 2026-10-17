const DURACION = 60 * 60 * 1000; // Minutos * Segundos * Milisegundos

// Devuelve los datos guardados, o null si no hay, han caducado o están corruptos
export function leerCache(clave) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    if (!guardado || Date.now() - guardado.fecha > DURACION) return null;
    return guardado.datos;
  } catch {
    return null; // JSON roto o localStorage bloqueado → como si no hubiera caché
  }
}

// Guarda los datos junto con la fecha actual
export function guardarCache(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify({ fecha: Date.now(), datos }));
  } catch (error) {
    // Si el almacenamiento está lleno o bloqueado, la app sigue funcionando sin caché
    console.warn("No se pudo guardar en caché:", error.message);
  }
}