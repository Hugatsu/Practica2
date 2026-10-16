import "./style.css";
import { obtenerPersonajes } from "./api.js";
import {
  prepararCarteles,
  soloConRecompensa,
  ordenarPorRecompensa,
  recompensaTotal,
  formatearBerries,
} from "./transform.js";
import { mostrarCargando, mostrarError, mostrarCarteles } from "./render.js";

async function cargar() {
  mostrarCargando();
  try {
    const personajes = await obtenerPersonajes();
    const carteles = ordenarPorRecompensa(prepararCarteles(personajes));
    const resumen = `${carteles.length} piratas buscados · ${formatearBerries(recompensaTotal(carteles))} en total`;
    mostrarCarteles(carteles, resumen);
  } catch (error) {
    mostrarError(`No se pudo contactar con la Marina (${error.message})`, cargar);
  }
}

cargar();