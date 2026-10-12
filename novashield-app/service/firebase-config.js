// service/firebase-config.js

// Importamos las funciones de Firebase directamente desde la CDN de Google.
// La versión (11.x en este ejemplo) debe coincidir en TODOS los imports de tu proyecto.
// service/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// PEGA AQUÍ el bloque firebaseConfig que copiaste en el paso 2.1
const firebaseConfig = {
  apiKey: "AIzaSyD8oR-SX_kDgOjS4CxdTTSURS7Xr9Ke0gM",
  authDomain: "novashield-app.firebaseapp.com",
  projectId: "novashield-app",
  storageBucket: "novashield-app.firebasestorage.app",
  messagingSenderId: "706555871468",
  appId: "1:706555871468:web:eb6411a67e1710dd5e65c9"
};


// Inicializamos la app de Firebase con esa configuración.
const app = initializeApp(firebaseConfig);

// Exportamos "db" (base de datos) y "auth" (autenticación) para usarlos
// en cualquier otro archivo del proyecto con: import { db, auth } from "../service/firebase-config.js";
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() })
});

export const auth = getAuth(app);