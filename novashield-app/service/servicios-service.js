// service/servicios-service.js
import { db } from "./firebase-config.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, limit
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const coleccionServicios = collection(db, "servicios");

// CREATE: agregar un nuevo servicio (lo usa el admin)
export async function crearServicio(datos) {
  await addDoc(coleccionServicios, {
    nombre: datos.nombre,
    categoria: datos.categoria,       // ej: "auditoria", "pentesting", "soporte"
    descripcion: datos.descripcion,
    precio: Number(datos.precio),
    duracionHoras: Number(datos.duracionHoras),
    activo: true,
    fechaCreacion: new Date().toISOString()
  });
}

// READ: leer servicios activos OPTIMIZADO (solo activos y máximo 12)
export async function listarServiciosActivos(limite = 12) {
  const q = query(
    coleccionServicios,
    where("activo", "==", true),
    limit(limite)
  );
  const snapshot = await getDocs(q);
  const lista = [];
  snapshot.forEach((docSnap) => {
    lista.push({ id: docSnap.id, ...docSnap.data() });
  });
  return lista;
}

// READ (admin): leer TODOS los servicios, activos e inactivos
export async function listarTodosLosServicios() {
  const snapshot = await getDocs(coleccionServicios);
  const lista = [];
  snapshot.forEach((docSnap) => {
    lista.push({ id: docSnap.id, ...docSnap.data() });
  });
  return lista;
}

// UPDATE: editar un servicio existente
export async function actualizarServicio(id, datosNuevos) {
  const refServicio = doc(db, "servicios", id);
  await updateDoc(refServicio, datosNuevos);
}

// DELETE: eliminar un servicio
export async function eliminarServicio(id) {
  const refServicio = doc(db, "servicios", id);
  await deleteDoc(refServicio);
}