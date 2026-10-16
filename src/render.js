import { formatearBerries } from "./transform.js";

const app = document.querySelector("#app");

// Crea un elemento con clase y texto. Usamos textContent (no innerHTML)
// porque los datos vienen de fuera: así nunca se interpretan como HTML
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// "Monkey D Luffy" → "MD" | "Baggy / Le Clown" → "B" (solo el nombre antes de la /)
const iniciales = (nombre) =>
  nombre
    .split("/")[0]
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join("");

// ESTADO 1: cargando
export function mostrarCargando() {
  app.replaceChildren(crear("p", "estado", "⏳ Buscando piratas por la Grand Line…"));
}

// ESTADO 2: error (con botón para reintentar)
export function mostrarError(mensaje, alReintentar) {
  const caja = crear("div", "estado estado--error");
  const boton = crear("button", "boton", "Reintentar");
  boton.addEventListener("click", alReintentar);
  caja.append(crear("p", null, `⚠ ${mensaje}`), boton);
  app.replaceChildren(caja);
}

function crearCartel(c) {
  const cartel = crear("article", "cartel");

  // Solo mostramos los datos que existen: filter(Boolean) quita los false/null
  const datos = [
    c.tripulacion && `🏴‍☠️ ${c.tripulacion}`,
    c.fruta && `🍎 ${c.fruta}`,
    c.edad !== null && `${c.edad} años`,
    c.altura !== null && `${c.altura} cm`,
  ].filter(Boolean);

  const lista = crear("ul", "cartel__datos");
  lista.append(...datos.map((dato) => crear("li", null, dato)));

  cartel.append(
    crear("p", "cartel__titulo", "SE BUSCA"),
    crear("div", "cartel__retrato", iniciales(c.nombre)),
    crear("h2", "cartel__nombre", c.nombre),
    crear("p", "cartel__recompensa", formatearBerries(c.recompensa)),
    crear("span", `cartel__estado cartel__estado--${c.estado.toLowerCase()}`, c.estado),
    lista,
  );
  return cartel;
}

// ESTADO 3: datos (o ESTADO 3b: vacío)
export function mostrarCarteles(carteles, resumen) {
  if (carteles.length === 0) {
    app.replaceChildren(crear("p", "estado", "🧭 Ningún pirata coincide con la búsqueda."));
    return;
  }
  const rejilla = crear("section", "rejilla");
  rejilla.append(...carteles.map(crearCartel));
  app.replaceChildren(crear("p", "resumen", resumen), rejilla);
}