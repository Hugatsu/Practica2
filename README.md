# Se busca · One Piece

Hugo Aparicio Guillén · 3º INSO C

Misión M2 · Async Odyssey — Web Development I.

Aplicación que muestra los carteles de "SE BUSCA" de los personajes de One Piece. Los datos se piden a una API pública real con `fetch` y `async/await`, se limpian con métodos de array y se pintan en el DOM con estados de carga, error y sin resultados.

API: [One Piece API](https://api-onepiece.com/en) · `GET https://api.api-onepiece.com/v2/characters/en`

## Cómo probarlo

Abre `http://localhost:5173` en el navegador.

- Al cargar aparecen los personajes con recompensa, ordenados de mayor a menor.
- Escribe en el buscador para filtrar por nombre. Debajo hay filtros por tripulación (con autocompletado), estado (vivo/fallecido), recompensa (con o sin) y fruta del diablo (con, sin o por tipo), además de un desplegable para ordenar. El botón "Limpiar filtros" los devuelve a su valor inicial.
- Encima de los carteles se muestra cuántos personajes hay y la suma de sus recompensas.
- Mientras se cargan los datos sale un mensaje de carga y el buscador está desactivado. Si la API falla, sale un error con un botón para reintentar.
- Los datos se guardan en `localStorage` durante 1 hora.


## Uso de IA

Usé Claude (chat de claude.ai) como guía paso a paso para montar el proyecto y como ayuda para depurar. Me propuso la estructura en módulos y el código base de cada uno, que fui probando y ajustando, y me explicó cada parte para entenderla.

Partes en las que me ayudó la IA:

- `npm` no funcionaba en PowerShell: Salía que la ejecución de scripts estaba deshabilitada. La IA me explicó que era la política de ejecución de Windows y la cambié para mi usuario con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- La primera API no funcionaba desde el navegador: Empecé con otra api distinta a la que estoy usando ahora: onepieceapi.com. Al probarla en la consola, Claude me dijo que el navegador bloqueaba la respuesta por CORS. Probé otra api(la que uso ahora) api-onepiece.com, que sí la permite, y cambié a esa.
- `app is null` en `render.js`: Mi `index.html` no tenía el elemento con `id="app"`, así que `querySelector` devolvía `null`.
- El CSS no se aplicaba: Mi hoja de estilos usaba clases distintas a las que crea `render.js`. La IA la adaptó a mis clases, manteniendo mis colores y fuentes. También quité un `<link>` al CSS que sobraba, porque Vite ya lo carga desde el `import` de `main.js`.
- El buscador no dejaba escribir: El `fieldset` empieza desactivado y se activa al terminar la carga. Para arreglarlo cambié la primera línea a `false`, pero la IA me explicó que así se podía escribir durante la carga y borrar el mensaje de carga o de error. La dejé en `true`.

Cómo lo verifiqué: Para cada cambio que hacía, lo comprobaba en la página web a ver que todo funcionase correctamente y como esperaba.


## Autopsia

1. Pedir los datos una sola vez y filtrar en memoria: Al cargar se piden todos los personajes y se guardan en un array. El buscador y el filtro trabajan sobre ese array, sin volver a llamar a la API. Descarté hacer una petición en cada búsqueda porque se haría una petición por cada tecla y cada resultado tardaría en cargar. A cambio, la primera carga es más pesada, porque trae los 786 personajes de golpe aunque solo se muestren los que tienen recompensa.

2. Guardar "sin recompensa" como `null` y no como `0`: Muchos personajes no tiene recompensa. Con `null` el cartel muestra "Sin recompensa" en vez de "฿ 0", que no es lo mismo: no tener recompensa no significa que valga cero. Descarté usar `0` porque daría un dato falso al usuario. El inconveniente es que en las operaciones hay que acordarse de tratar el `null`: al ordenar y al sumar con `reduce` uso `recompensa ?? 0`.

3. Pintar con `createElement` y `textContent` en vez de `innerHTML`: Los datos vienen de una API que no controlo. Si un nombre trajera código HTML, con `innerHTML` se interpretaría y se podría ejecutar. Con `textContent` siempre se muestra como texto.