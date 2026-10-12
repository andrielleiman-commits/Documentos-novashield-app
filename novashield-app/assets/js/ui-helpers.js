// assets/js/ui-helpers.js
// Funciones pequeñas reutilizadas por varias páginas.

// Escapa caracteres peligrosos antes de insertar texto en el HTML (previene XSS).
export function escapeHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Muestra un mensaje en un elemento. tipo: "ok" o "error".
export function mostrarMensaje(elemento, texto, tipo = "ok") {
  elemento.textContent = texto;
  elemento.className = "form-msg " + tipo;
}

// Aviso flotante temporal (esquina inferior derecha).
export function mostrarToast(texto, tipo = "ok") {
  let zona = document.getElementById("toast-zone");
  if (!zona) {
    zona = document.createElement("div");
    zona.id = "toast-zone";
    zona.className = "toast-zone";
    zona.setAttribute("role", "status");
    document.body.appendChild(zona);
  }
  const toast = document.createElement("div");
  toast.className = "toast" + (tipo === "error" ? " error" : "");
  toast.textContent = texto;
  zona.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

export function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  if (isNaN(fecha)) return "—";
  return fecha.toLocaleString("es-PE", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

export function formatearPrecio(numero) {
  return "S/ " + Number(numero || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

// Categorías válidas del catálogo (misma lista en todo el proyecto).
export const CATEGORIAS = {
  auditoria: "Auditoría de seguridad",
  pentesting: "Pentesting",
  firewall: "Firewall y redes",
  capacitacion: "Capacitación",
  soporte: "Soporte técnico",
  backup: "Backup y recuperación"
};

export function nombreCategoria(clave) {
  return CATEGORIAS[clave] || clave || "General";
}

// Íconos SVG por categoría (se pintan con el color del contenedor).
const ICONOS = {
  auditoria: '<path d="M9 3h6l1 2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3l1-2Z"/><path d="m9 13 2 2 4-4"/>',
  pentesting: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  firewall: '<path d="M12 3 4 6v6c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V6l-8-3Z"/><path d="M4 12h16M12 3v18"/>',
  capacitacion: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/>',
  soporte: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/><path d="M19 19c0 1.5-2 2-5 2"/>',
  backup: '<path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 0 9H7Z"/><path d="M12 11v6m0 0-2-2m2 2 2-2"/>'
};

export function iconoCategoria(clave) {
  const trazo = ICONOS[clave] || ICONOS.firewall;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazo}</svg>`;
}

// Traduce los códigos de error de Firebase a mensajes claros en español.
export function traducirError(error) {
  const codigo = error && error.code ? error.code : "";
  const mensajes = {
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "Correo o contraseña incorrectos.",
    "auth/invalid-email": "El correo no tiene un formato válido.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Inicia sesión.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
    "auth/network-request-failed": "Sin conexión con el servidor. Revisa tu internet.",
    "permission-denied": "No tienes permisos para realizar esta acción."
  };
  return mensajes[codigo] || "Ocurrió un error inesperado. Detalle: " + (error && error.message ? error.message : codigo);
}
