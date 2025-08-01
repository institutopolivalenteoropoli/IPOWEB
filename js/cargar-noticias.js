async function cargarNoticias() {
  const contenedor = document.querySelector(".news-list ul");

  const respuesta = await fetch('noticias');
  const archivos = await respuesta.text();

  const nombres = archivos.match(/href="([^"]+\.md)"/g)?.map(x => x.match(/"([^"]+)"/)[1]);

  if (!nombres) return;

  nombres.reverse().forEach(async (nombre) => {
    const res = await fetch(`noticias/${nombre}`);
    const texto = await res.text();

    const titulo = texto.match(/title: (.+)/)?.[1] ?? 'Sin título';
    const fecha = texto.match(/date: (.+)/)?.[1] ?? 'Sin fecha';
    const imagen = texto.match(/image: (.+)/)?.[1] ?? '';
    const contenido = texto.split('---')[2]?.trim().split('\n')[0] ?? '';

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${imagen}" alt="${titulo}" />
      <div class="contenido">
        <h3>${titulo}</h3>
        <p>${contenido}</p>
        <span class="fecha">Publicado: ${fecha}</span>
      </div>
    `;

    contenedor.appendChild(li);
  });
}

cargarNoticias();
