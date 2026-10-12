// MODELO MVC: datos inmutables del cuestionario. No conoce Vue, DOM ni Firebase.
export const OPCIONES = Object.freeze([
  Object.freeze({ id: "si", texto: "Sí, de forma habitual", puntos: 0 }),
  Object.freeze({ id: "parcial", texto: "En parte", puntos: 1 }),
  Object.freeze({ id: "no", texto: "No", puntos: 2 }),
  Object.freeze({ id: "no-se", texto: "No lo sé", puntos: 2 })
]);

export const PREGUNTAS = Object.freeze([
  {
    id: "contrasenas", tema: "Contraseñas",
    texto: "¿Usan contraseñas largas y únicas para cada cuenta de trabajo?",
    ayuda: "Piense en el correo, las herramientas de trabajo y las cuentas compartidas.",
    recomendacion: "Use contraseñas largas y distintas para cada cuenta. Un gestor de contraseñas puede ayudar a generarlas y guardarlas; evite compartirlas."
  },
  {
    id: "multifactor", tema: "Acceso a las cuentas",
    texto: "¿Tienen activada la autenticación multifactor en las cuentas importantes?",
    ayuda: "Es una comprobación adicional a la contraseña, como una aplicación autenticadora o una llave de seguridad.",
    recomendacion: "Active la autenticación multifactor en el correo y las herramientas importantes. Priorice métodos resistentes al phishing cuando estén disponibles."
  },
  {
    id: "respaldos", tema: "Respaldos",
    texto: "¿Realizan copias periódicas de los archivos importantes en una ubicación separada?",
    ayuda: "Una copia en el mismo equipo puede perderse junto con los archivos originales.",
    recomendacion: "Programe copias de los archivos importantes y conserve una copia separada del equipo principal. Proteja también el acceso a los respaldos."
  },
  {
    id: "restauracion", tema: "Recuperación",
    texto: "¿Han comprobado que pueden recuperar archivos desde sus respaldos?",
    ayuda: "Tener una copia no garantiza que se pueda restaurar cuando haga falta.",
    recomendacion: "Pruebe la restauración de algunos archivos y documente los pasos para recuperar la información si un equipo falla."
  },
  {
    id: "phishing", tema: "Phishing",
    texto: "¿El equipo sabe identificar y reportar mensajes o enlaces sospechosos?",
    ayuda: "Incluye correos, mensajes de WhatsApp y solicitudes urgentes que suplantan a otra persona.",
    recomendacion: "Practique cómo reconocer mensajes sospechosos y defina a quién reportarlos. Verifique por otro canal las solicitudes inusuales antes de abrir enlaces o compartir información."
  },
  {
    id: "actualizaciones", tema: "Actualizaciones",
    texto: "¿Mantienen actualizados los equipos, aplicaciones y herramientas de protección?",
    ayuda: "Considere el sistema operativo, el navegador y las aplicaciones que usa la empresa.",
    recomendacion: "Active las actualizaciones automáticas donde sea posible y revise los equipos pendientes. Planifique sustituir el software que ya no recibe soporte."
  },
  {
    id: "datos", tema: "Protección de datos",
    texto: "¿Limitan el acceso a los datos de clientes y de la empresa a quienes lo necesitan?",
    ayuda: "Revise los permisos de carpetas, cuentas individuales y accesos de personas que ya no trabajan con usted.",
    recomendacion: "Asigne accesos según la función de cada persona, retire los que ya no se necesitan y proteja los dispositivos con bloqueo y cifrado cuando esté disponible."
  }
].map((pregunta, indice) => Object.freeze({ ...pregunta, numero: indice + 1 })));

export const NIVELES = Object.freeze([
  Object.freeze({ id: "baja", etiqueta: "Baja", hasta: 3,
    explicacion: "Sus respuestas describen varias prácticas básicas implementadas. Manténgalas y compruebe que funcionan." }),
  Object.freeze({ id: "moderada", etiqueta: "Moderada", hasta: 8,
    explicacion: "Sus respuestas muestran prácticas incompletas o aspectos por verificar. Priorice las recomendaciones indicadas." }),
  Object.freeze({ id: "alta", etiqueta: "Alta", hasta: 14,
    explicacion: "Sus respuestas muestran varias prácticas ausentes o desconocidas. Revise primero esos aspectos y considere apoyo profesional." })
]);
