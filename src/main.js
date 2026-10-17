import "./style.css";
import { obtenerPersonajes } from "./api.js";
import {
  prepararCarteles,
  soloConRecompensa,
  ordenarPorRecompensa,
  buscarPorNombre,
  filtrarPorEstado,
  recompensaTotal,
  formatearBerries,
} from "./transform.js";
import { mostrarCargando, mostrarError, mostrarCarteles } from "./render.js";

const campos = document.querySelector("#campos");
const busqueda = document.querySelector("#busqueda");
const filtroEstado = document.querySelector("#filtro-estado");

// Se rellena una sola vez al cargar; buscar y filtrar trabajan sobre esta copia en memoria
let todosLosCarteles = [];

function actualizarVista() {
  const visibles = filtrarPorEstado(
    buscarPorNombre(todosLosCarteles, busqueda.value),
    filtroEstado.value,
  );
  const resumen = `${visibles.length} piratas buscados · ${formatearBerries(recompensaTotal(visibles))} en total`;
  mostrarCarteles(visibles, resumen);
}

async function cargar() {
  campos.disabled = true;
  mostrarCargando();
  try {
    const personajes = await obtenerPersonajes();
    todosLosCarteles = ordenarPorRecompensa(soloConRecompensa(prepararCarteles(personajes)));
    campos.disabled = false;
    actualizarVista();
  } catch (error) {
    mostrarError(`No se pudo contactar con la Marina (${error.message})`, cargar);
  }
}

busqueda.addEventListener("input", actualizarVista);
filtroEstado.addEventListener("change", actualizarVista);
// Evita que pulsar Enter en el buscador recargue la página
document.querySelector("#controles").addEventListener("submit", (e) => e.preventDefault());

cargar();