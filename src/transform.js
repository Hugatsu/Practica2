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

// Algunos tipos de fruta vienen en francés
const TIPOS_FRUTA = {
  "Zoan Mythique": "Zoan Mítica",
  "Zoan Antique": "Zoan Ancestral",
};

const normalizarTipoFruta = (tipo) => (tipo ? (TIPOS_FRUTA[tipo] ?? tipo) : null);

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
  tipoFruta: normalizarTipoFruta(p.fruit?.type),
  oficio: p.job?.trim() || null,
});

export const prepararCarteles = (personajes) => personajes.map(aCartel);

// Valores distintos de un campo, sin vacíos y en orden alfabético (para rellenar desplegables)
export const valoresUnicos = (carteles, campo) =>
  [...new Set(carteles.map((c) => c[campo]).filter(Boolean))].toSorted((a, b) =>
    a.localeCompare(b, "es"),
  );

// "con" → tiene el dato | "sin" → no lo tiene | "todos" → no filtra
const conOSin = (opcion, tieneDato) => opcion === "todos" || (opcion === "con") === tieneDato;

const contieneTexto = (valor, texto) =>
  (valor ?? "").toLowerCase().includes(texto.trim().toLowerCase());

// La fruta puede filtrarse por "con"/"sin" o por un tipo concreto ("Logia", "Zoan"…)
const coincideFruta = (c, opcion) =>
  ["todos", "con", "sin"].includes(opcion)
    ? conOSin(opcion, c.fruta !== null)
    : c.tipoFruta === opcion;

// Un cartel se muestra solo si cumple TODAS las condiciones (every)
export const aplicarFiltros = (carteles, filtros) => {
  const condiciones = [
    (c) => contieneTexto(c.nombre, filtros.nombre),
    (c) => filtros.tripulacion.trim() === "" || contieneTexto(c.tripulacion, filtros.tripulacion),
    (c) => filtros.estado === "todos" || c.estado === filtros.estado,
    (c) => conOSin(filtros.recompensa, c.recompensa !== null),
    (c) => coincideFruta(c, filtros.fruta),
  ];
  return carteles.filter((c) => condiciones.every((cumple) => cumple(c)));
};

// Los que no tienen el dato (null) van siempre al final
const deMayorAMenor = (campo) => (a, b) => (b[campo] ?? -1) - (a[campo] ?? -1);

const COMPARADORES = {
  recompensa: deMayorAMenor("recompensa"),
  edad: deMayorAMenor("edad"),
  altura: deMayorAMenor("altura"),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
};

// toSorted no modifica el array original (inmutabilidad)
export const ordenarCarteles = (carteles, criterio) =>
  carteles.toSorted(COMPARADORES[criterio] ?? COMPARADORES.recompensa);

export const recompensaTotal = (carteles) =>
  carteles.reduce((total, c) => total + (c.recompensa ?? 0), 0);

export const formatearBerries = (cantidad) =>
  cantidad === null
    ? "Sin recompensa"
    : `฿ ${cantidad.toLocaleString("es-ES", { useGrouping: "always" })}`;