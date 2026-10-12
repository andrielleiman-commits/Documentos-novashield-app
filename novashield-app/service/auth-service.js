// service/auth-service.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  doc, setDoc, getDoc, getDocs, collection
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Registrar un nuevo usuario cliente
export async function registrarUsuario(nombre, email, password) {
  const credencial = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credencial.user.uid;

  await setDoc(doc(db, "usuarios", uid), {
    nombre: nombre,
    email: email,
    rol: "cliente",              // todo usuario nuevo es "cliente", nunca "admin"
    fechaRegistro: new Date().toISOString()
  });

  return uid;
}

// Iniciar sesión
export async function iniciarSesion(email, password) {
  const credencial = await signInWithEmailAndPassword(auth, email, password);
  return credencial.user;
}

// Cerrar sesión
export async function cerrarSesion() {
  await signOut(auth);
}

// Obtener el perfil completo (nombre, email, rol) de un usuario
export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data() : null;
}

// Obtener solo el rol del usuario ("admin" o "cliente")
export async function obtenerRolUsuario(uid) {
  const perfil = await obtenerPerfil(uid);
  return perfil ? perfil.rol : null;
}

// Listar todos los usuarios (lo usa el panel admin para mostrar nombres de clientes)
export async function listarUsuarios() {
  const snapshot = await getDocs(collection(db, "usuarios"));
  const lista = [];
  snapshot.forEach((docSnap) => {
    lista.push({ id: docSnap.id, ...docSnap.data() });
  });
  return lista;
}
