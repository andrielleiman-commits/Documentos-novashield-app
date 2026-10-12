// assets/js/layout.js
// Carga el header y footer en cada página y ajusta el menú según la sesión.
import { auth } from "../../service/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { obtenerPerfil, cerrarSesion } from "../../service/auth-service.js";

async function cargarComponente(idContenedor, ruta) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    contenedor.innerHTML = await respuesta.text();
  } catch (error) {
    console.error("No se pudo cargar " + ruta + ":", error);
  }
}

// Cantidad de servicios en la solicitud (carrito guardado en el navegador).
export function actualizarContadorCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  let total = 0;
  try {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    total = carrito.reduce((suma, item) => suma + (item.cantidad || 1), 0);
  } catch (e) { total = 0; }
  badge.textContent = total;
}

// Devuelve una promesa con el usuario actual (o null si no hay sesión).
export function esperarUsuario() {
  return new Promise((resolve) => {
    const cancelar = onAuthStateChanged(auth, (usuario) => {
      cancelar();
      resolve(usuario);
    });
  });
}

function marcarEnlaceActivo() {
  const ruta = window.location.pathname;
  document.querySelectorAll("#nav a[data-page]").forEach((enlace) => {
    const clave = enlace.dataset.page;
    const activo = clave === "admin" ? ruta.includes("/admin/") : ruta.endsWith("/" + clave) || (clave === "index.html" && ruta === "/");
    enlace.classList.toggle("active", activo);
  });
}

function configurarMenuMovil() {
  const boton = document.getElementById("nav-toggle");
  const barra = document.getElementById("topbar");
  if (!boton || !barra) return;
  boton.addEventListener("click", () => {
    const abierto = barra.classList.toggle("open");
    boton.setAttribute("aria-expanded", String(abierto));
  });
}

function mostrarEstadoSesion(usuario, perfil) {
  const nombre = document.getElementById("user-name");
  const btnLogin = document.getElementById("btn-login");
  const btnRegistro = document.getElementById("btn-register");
  const btnLogout = document.getElementById("btn-logout");
  const logueado = !!usuario;

  if (btnLogin) btnLogin.hidden = logueado;
  if (btnRegistro) btnRegistro.hidden = logueado;
  if (btnLogout) btnLogout.hidden = !logueado;
  if (nombre) {
    nombre.hidden = !logueado;
    nombre.textContent = logueado ? (perfil && perfil.nombre ? perfil.nombre : usuario.email) : "";
  }
  const esAdmin = perfil && perfil.rol === "admin";
  document.querySelectorAll("[data-auth='usuario']").forEach((el) => { el.hidden = !logueado; });
  document.querySelectorAll("[data-auth='admin']").forEach((el) => { el.hidden = !esAdmin; });
}

export async function initLayout() {
  await Promise.all([
    cargarComponente("header-placeholder", "/components/header.html"),
    cargarComponente("footer-placeholder", "/components/footer.html")
  ]);

  marcarEnlaceActivo();
  configurarMenuMovil();
  actualizarContadorCarrito();

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      await cerrarSesion();
      window.location.href = "/index.html";
    });
  }

  onAuthStateChanged(auth, async (usuario) => {
    let perfil = null;
    if (usuario) {
      try { perfil = await obtenerPerfil(usuario.uid); } catch (e) { console.error(e); }
    }
    mostrarEstadoSesion(usuario, perfil);
  });
}
