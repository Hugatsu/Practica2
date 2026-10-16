// Traducción de los estados que vienen mezclados (francés / inglés / null)
const ESTADOS = {
  vivant: "Vivo",
  living: "Vivo",
  alive: "Vivo",
  deceased: "Fallecido",
  dead: "Fallecido",
};

export const normalizarEstado = (estado) =>
  ESTADOS[estado?.toLowerCase()] ?? "Desconocido";

// "3.000.000.000" → 3000000000 | " 11 ans" → 11 | "1 000 ans" → 1000 | "-" → null
export function textoANumero(texto) {
  if (typeof texto !== "string") return null;
  const soloDigitos = texto.replace(/\D/g, ""); // quita todo lo que no sea dígito
  return soloDigitos === "" ? null : Number(soloDigitos);
}

// Convierte un personaje "crudo" de la API en un cartel limpio
export const aCartel = (p) => ({
  id: p.id,
  nombre: p.name?.trim() || "Pirata desconocido",
  recompensa: textoANumero(p.bounty),
  edad: textoANumero(p.age),
  altura: textoANumero(p.size),
  estado: normalizarEstado(p.status),
  tripulacion: p.crew?.name ?? null,
  fruta: p.fruit?.name ?? null,
  tipoFruta: p.fruit?.type ?? null,
  oficio: p.job?.trim() || null,
});

export const prepararCarteles = (personajes) => personajes.map(aCartel);

export const soloConRecompensa = (carteles) =>
  carteles.filter((c) => c.recompensa !== null);

export const buscarPorNombre = (carteles, texto) => {
  const busqueda = texto.trim().toLowerCase();
  return busqueda === ""
    ? carteles
    : carteles.filter((c) => c.nombre.toLowerCase().includes(busqueda));
};

export const filtrarPorEstado = (carteles, estado) =>
  estado === "todos" ? carteles : carteles.filter((c) => c.estado === estado);

// toSorted no modifica el array original (inmutabilidad)
export const ordenarPorRecompensa = (carteles) =>
  carteles.toSorted((a, b) => (b.recompensa ?? 0) - (a.recompensa ?? 0));

export const recompensaTotal = (carteles) =>
  carteles.reduce((total, c) => total + (c.recompensa ?? 0), 0);

export const formatearBerries = (cantidad) =>
  cantidad === null
    ? "Sin recompensa"
    : `฿ ${cantidad.toLocaleString("es-ES", { useGrouping: "always" })}`;