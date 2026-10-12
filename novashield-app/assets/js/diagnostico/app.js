// Composición del módulo: carga la vista y el pie público sin importar layout.js,
// porque el layout de las páginas privadas inicializa Firebase y Authentication.
const botonMenu = document.getElementById("nav-toggle");
const barra = document.getElementById("topbar");
botonMenu?.addEventListener("click", () => {
  const abierto = barra.classList.toggle("open");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});

async function cargarPiePublico() {
  try {
    const respuesta = await fetch("../components/footer.html");
    if (!respuesta.ok) throw new Error("No se pudo cargar el pie.");
    // HTML estático de este proyecto; no contiene respuestas del cuestionario.
    document.getElementById("footer-placeholder").innerHTML = await respuesta.text();
  } catch {
    document.getElementById("footer-placeholder").textContent = "NovaShield · Autodiagnóstico gratuito";
  }
}

async function iniciar() {
  const estado = document.getElementById("diagnostico-carga");
  try {
    // Importación dinámica para mostrar un error legible si falta Vue o un módulo.
    const { montarDiagnostico } = await import("./view.js");
    montarDiagnostico();
    estado.hidden = true;
  } catch {
    estado.innerHTML = '<h3>No se pudo cargar el cuestionario</h3><p>Recarga la página o inténtalo más tarde.</p>';
  }
}
cargarPiePublico();
iniciar();
