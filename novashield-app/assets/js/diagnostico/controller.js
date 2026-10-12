// CONTROLADOR MVC: valida y evalúa respuestas. Funciones puras, sin DOM,
// dependencias de Vue, almacenamiento, llamadas de red ni acceso a Firebase.
import { PREGUNTAS, OPCIONES, NIVELES } from "./model.js";

export function crearRespuestasVacias() {
  return Object.fromEntries(PREGUNTAS.map((pregunta) => [pregunta.id, ""]));
}

export function evaluarRespuestas(respuestas) {
  if (!respuestas || typeof respuestas !== "object" || Array.isArray(respuestas)) {
    throw new TypeError("Se requiere un conjunto de respuestas.");
  }
  const ids = new Set(PREGUNTAS.map((pregunta) => pregunta.id));
  if (Object.keys(respuestas).some((id) => !ids.has(id))) {
    throw new TypeError("Las respuestas contienen preguntas desconocidas.");
  }

  const faltantes = [];
  const elegidas = [];
  for (const pregunta of PREGUNTAS) {
    const valor = Object.hasOwn(respuestas, pregunta.id) ? respuestas[pregunta.id] : "";
    if (valor === "" || valor === undefined || valor === null) {
      faltantes.push(pregunta.id);
      continue;
    }
    const opcion = OPCIONES.find((opcion) => opcion.id === valor);
    if (!opcion) throw new TypeError("Respuesta no válida para " + pregunta.id + ".");
    elegidas.push({ pregunta, opcion });
  }
  // Nunca asignar nivel ni puntuación a un cuestionario incompleto.
  if (faltantes.length) return { completo: false, faltantes };

  const puntuacion = elegidas.reduce((total, item) => total + item.opcion.puntos, 0);
  const nivel = NIVELES.find((nivel) => puntuacion <= nivel.hasta);
  const recomendaciones = elegidas
    .filter((item) => item.opcion.puntos > 0)
    .sort((a, b) => b.opcion.puntos - a.opcion.puntos || a.pregunta.numero - b.pregunta.numero)
    .map(({ pregunta, opcion }) => ({
      id: pregunta.id,
      tema: pregunta.tema,
      texto: pregunta.recomendacion,
      prioridad: opcion.id === "no-se" ? "Verificar" : opcion.puntos === 2 ? "Revisar primero" : "Completar"
    }));

  return {
    completo: true,
    faltantes: [],
    puntuacion,
    maximo: PREGUNTAS.length * Math.max(...OPCIONES.map((opcion) => opcion.puntos)),
    nivel,
    recomendaciones,
    incertidumbres: elegidas.filter((item) => item.opcion.id === "no-se").length
  };
}
