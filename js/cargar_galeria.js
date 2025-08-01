async function cargarGaleria() {
  const galeria = document.getElementById("galeria");

  const res = await fetch('galeria');
  const texto = await res.text();

  const nombres = texto.match(/href="([^"]+\.md)"/g)?.map(x => x.match(/"([^"]+)"/)[1]);
  if (!nombres) return;

  const imagenes = [];

  for (const nombre of nombres) {
    const archivo = await fetch(`galeria/${nombre}`);
    const contenido = await archivo.text();

    const img = contenido.match(/image: (.+)/)?.[1].trim();
    const desc = contenido.match(/descripcion: (.+)/)?.[1].trim();
    const titulo = contenido.match(/title: (.+)/)?.[1].trim();

    if (img && desc) {
      imagenes.push({ src: img, desc });
    }
  }

  const modal = document.getElementById("modal");
  const imgAmpliada = document.getElementById("imgAmpliada");
  const descripcion = document.getElementById("descripcion");
  const cerrar = document.querySelector(".cerrar");

  imagenes.forEach((img, i) => {
    const card = document.createElement("div");
    card.className = "foto-card";
    card.onclick = () => abrirModal(i);
    card.innerHTML = `
      <img src="${img.src}" alt="${img.desc}">
      <div class="foto-info">${img.desc}</div>`;
    galeria.appendChild(card);
  });

  let indiceActual = 0;

  function abrirModal(indice) {
    indiceActual = indice;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    imgAmpliada.src = imagenes[indiceActual].src;
    descripcion.textContent = imagenes[indiceActual].desc;
  }

  function cerrarModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  function cambiarImagen(direccion) {
    indiceActual += direccion;
    if (indiceActual < 0) indiceActual = imagenes.length - 1;
    if (indiceActual >= imagenes.length) indiceActual = 0;
    abrirModal(indiceActual);
  }

  cerrar.addEventListener("click", cerrarModal);
  window.addEventListener("click", (event) => {
    if (event.target === modal) cerrarModal();
  });
  document.addEventListener("keydown", function (event) {
    if (modal.style.display === "flex") {
      if (event.key === "ArrowRight") cambiarImagen(1);
      else if (event.key === "ArrowLeft") cambiarImagen(-1);
      else if (event.key === "Escape") cerrarModal();
    }
  });
}

cargarGaleria();

