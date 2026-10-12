// service/solicitudes-service.js
import { db } from "./firebase-config.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, query, where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const coleccionSolicitudes = collection(db, "solicitudes");
const ESTADOS_SOLICITUD = ["pendiente", "atendida"];

// Los identificadores se conservan exactamente como llegan, sin corregirlos.
function validarIdentificador(valor, campo) {
  if (
    typeof valor !== "string" ||
    valor.length === 0 ||
    valor.trim() !== valor ||
    valor.includes("/") ||
    valor === "." ||
    valor === ".." ||
    /^__.*__$/.test(valor) ||
    new TextEncoder().encode(valor).length > 1500
  ) {
    throw new TypeError(campo + " debe ser un identificador válido y no vacío.");
  }
}

function validarEstado(estado) {
  if (!ESTADOS_SOLICITUD.includes(estado)) {
    throw new TypeError('El estado debe ser "pendiente" o "atendida".');
  }
}

function prepararItems(carrito) {
  if (!Array.isArray(carrito) || carrito.length === 0) {
    throw new TypeError("El carrito debe contener al menos un servicio.");
  }

  // Array.from también valida las posiciones vacías de un arreglo disperso.
  return Array.from(carrito, (item, indice) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError("El servicio en la posición " + indice + " no es válido.");
    }
    validarIdentificador(item.id, "El identificador del servicio");
    if (!Number.isSafeInteger(item.cantidad) || item.cantidad <= 0) {
      throw new TypeError("La cantidad de cada servicio debe ser un entero positivo seguro.");
    }

    return { servicioId: item.id, cantidad: item.cantidad };
  });
}

function leerSolicitudes(snapshot) {
  const solicitudes = [];
  snapshot.forEach((docSnap) => {
    // El ID real del documento prevalece sobre cualquier campo almacenado.
    solicitudes.push({ ...docSnap.data(), id: docSnap.id });
  });
  return solicitudes;
}

// Crea desde el carrito: [{ id, nombre, precio, cantidad }].
export async function crearSolicitud(userId, carrito) {
  validarIdentificador(userId, "El identificador del usuario");
  const items = prepararItems(carrito);
  const referencia = await addDoc(coleccionSolicitudes, {
    userId,
    items,
    estado: "pendiente",
    // Las páginas actuales esperan una fecha ISO, compatible con new Date().
    fecha: new Date().toISOString()
  });
  return referencia.id;
}

// La consulta filtra por propietario; las reglas deben autorizar ese acceso.
export async function obtenerHistorialUsuario(userId) {
  validarIdentificador(userId, "El identificador del usuario");
  const consulta = query(coleccionSolicitudes, where("userId", "==", userId));
  return leerSolicitudes(await getDocs(consulta));
}

// Lectura administrativa: la autorización debe aplicarse en las reglas.
export async function listarTodasLasSolicitudes() {
  return leerSolicitudes(await getDocs(coleccionSolicitudes));
}

// Solo modifica el estado, conservando el propietario y los servicios.
export async function actualizarEstadoSolicitud(id, estado) {
  validarIdentificador(id, "El identificador de la solicitud");
  validarEstado(estado);
  await updateDoc(doc(db, "solicitudes", id), { estado });
}
