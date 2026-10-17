import "./style.css";
import { obtenerPersonajes } from "./api.js";
import {
  prepararCarteles,
  valoresUnicos,
  aplicarFiltros,
  ordenarCarteles,
  recompensaTotal,
  formatearBerries,
} from "./transform.js";
import { mostrarCargando, mostrarError, mostrarCarteles, rellenarOpciones } from "./render.js";

const formulario = document.querySelector("#controles");
const campos = document.querySelector("#campos");
const busqueda = document.querySelector("#busqueda");
const filtroTripulacion = document.querySelector("#filtro-tripulacion");
const filtroEstado = document.querySelector("#filtro-estado");
const filtroRecompensa = document.querySelector("#filtro-recompensa");
const filtroFruta = document.querySelector("#filtro-fruta");
const orden = document.querySelector("#orden");

// Se rellena una sola vez al cargar; buscar y filtrar trabajan sobre esta copia en memoria
let todosLosCarteles = [];

function actualizarVista() {
  const filtrados = aplicarFiltros(todosLosCarteles, {
    nombre: busqueda.value,
    tripulacion: filtroTripulacion.value,
    estado: filtroEstado.value,
    recompensa: filtroRecompensa.value,
    fruta: filtroFruta.value,
  });
  const visibles = ordenarCarteles(filtrados, orden.value);
  const resumen = `${visibles.length} piratas · ${formatearBerries(recompensaTotal(visibles))} en recompensas`;
  mostrarCarteles(visibles, resumen);
}

async function cargar() {
  campos.disabled = true;
  mostrarCargando();
  try {
    const personajes = await obtenerPersonajes();
    todosLosCarteles = prepararCarteles(personajes);
    rellenarOpciones(document.querySelector("#tripulaciones"), valoresUnicos(todosLosCarteles, "tripulacion"));
    rellenarOpciones(document.querySelector("#tipos-fruta"), valoresUnicos(todosLosCarteles, "tipoFruta"));
    campos.disabled = false;
    actualizarVista();
  } catch (error) {
    mostrarError(`No se pudo contactar con la Marina (${error.message})`, cargar);
  }
}

// Un solo listener para todo el formulario: el evento "input" sube desde cualquier campo
formulario.addEventListener("input", actualizarVista);
// "reset" se lanza ANTES de que se borren los campos, así que esperamos un instante
formulario.addEventListener("reset", () => setTimeout(actualizarVista));
// Evita que pulsar Enter en el buscador recargue la página
formulario.addEventListener("submit", (e) => e.preventDefault());

cargar();
