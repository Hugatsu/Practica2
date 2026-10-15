import "./style.css";
import { obtenerPersonajes } from "./api.js";

async function probar() {
  try {
    const personajes = await obtenerPersonajes();
    console.log("Personajes recibidos:", personajes.length);
    console.log("Ejemplo:", personajes[0]);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

probar();