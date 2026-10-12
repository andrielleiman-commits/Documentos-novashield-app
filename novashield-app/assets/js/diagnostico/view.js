// VISTA MVC: Vue 3 administra componentes, eventos y estado reactivo local.
// Toda decisión sobre puntuación y recomendaciones se delega al controlador.
import { createApp, reactive, ref, computed, nextTick } from "../../vendor/vue-3.5.43.esm-browser.prod.js";
import { PREGUNTAS, OPCIONES } from "./model.js";
import { crearRespuestasVacias, evaluarRespuestas } from "./controller.js";

const PreguntaDiagnostico = {
  props: {
    pregunta: { type: Object, required: true },
    opciones: { type: Array, required: true },
    modelValue: { type: String, default: "" },
    incompleta: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // v-model del componente comunica la selección a la vista principal.
    const valor = computed({
      get: () => props.modelValue,
      set: (valor) => emit("update:modelValue", valor)
    });
    return { valor };
  },
  template: `
    <fieldset class="diagnostico-pregunta" :class="{ 'es-incompleta': incompleta }"
      :id="'pregunta-' + pregunta.id" tabindex="-1"
      :aria-invalid="incompleta ? 'true' : 'false'" :aria-describedby="'ayuda-' + pregunta.id">
      <legend><span class="diagnostico-numero">{{ pregunta.numero }}.</span> {{ pregunta.texto }}</legend>
      <p class="muted" :id="'ayuda-' + pregunta.id">{{ pregunta.ayuda }}</p>
      <div class="diagnostico-opciones">
        <label v-for="opcion in opciones" :key="opcion.id" class="diagnostico-opcion"
          :class="{ seleccionada: valor === opcion.id }">
          <input type="radio" v-model="valor" :name="pregunta.id"
            :value="opcion.id" :id="pregunta.id + '-' + opcion.id" required>
          <span>{{ opcion.texto }}</span>
        </label>
      </div>
    </fieldset>`
};

const ResultadoDiagnostico = {
  props: { resultado: { type: Object, required: true } },
  setup() {
    // Las clases CSS pertenecen a la vista, no al modelo de evaluación.
    return { clasesNivel: { baja: "badge-ok", moderada: "badge-warn", alta: "badge-bad" } };
  },
  template: `
    <section class="card diagnostico-resultado" id="resultado-diagnostico"
      tabindex="-1" aria-labelledby="titulo-resultado">
      <span class="badge" :class="clasesNivel[resultado.nivel.id]">Exposición {{ resultado.nivel.etiqueta }}</span>
      <h2 id="titulo-resultado">Resultado orientativo</h2>
      <p>{{ resultado.nivel.explicacion }}</p>
      <p class="muted">Índice educativo: {{ resultado.puntuacion }} de {{ resultado.maximo }} puntos.
        Una puntuación mayor indica más prácticas ausentes, incompletas o desconocidas.</p>
      <p v-if="resultado.incertidumbres" class="diagnostico-incertidumbre">
        Marcaste {{ resultado.incertidumbres }} respuesta(s) como «No lo sé».
        Verifica esas prácticas antes de interpretar el nivel.</p>
      <h3>Recomendaciones</h3>
      <ul v-if="resultado.recomendaciones.length" class="diagnostico-recomendaciones">
        <li v-for="recomendacion in resultado.recomendaciones" :key="recomendacion.id">
          <strong>{{ recomendacion.tema }} · {{ recomendacion.prioridad }}</strong>
          <p>{{ recomendacion.texto }}</p>
        </li>
      </ul>
      <p v-else>Mantén estas prácticas, revisa los accesos y comprueba los respaldos periódicamente.</p>
      <p class="muted diagnostico-limite">Las respuestas son autodeclaradas; este cuestionario no comprueba
        tus sistemas ni permite asegurar que estén libres de vulnerabilidades.</p>
    </section>`
};

export function montarDiagnostico(selector = "#diagnostico-app") {
  const aplicacion = createApp({
    components: { PreguntaDiagnostico, ResultadoDiagnostico },
    setup() {
      // Estado efímero de la vista: nunca se persiste ni se transmite.
      const respuestas = reactive(crearRespuestasVacias());
      const resultado = ref(null);
      const mensaje = ref("");
      const faltantes = ref([]);
      const respondidas = computed(() => PREGUNTAS.filter((pregunta) =>
        OPCIONES.some((opcion) => opcion.id === respuestas[pregunta.id])).length);

      function limpiarResultado() {
        resultado.value = null;
        mensaje.value = "";
        faltantes.value = [];
      }

      async function calcular() {
        limpiarResultado();
        try {
          const evaluacion = evaluarRespuestas(respuestas);
          if (!evaluacion.completo) {
            faltantes.value = evaluacion.faltantes;
            mensaje.value = "Responde las siete preguntas para obtener un resultado orientativo.";
            await nextTick();
            document.getElementById("pregunta-" + evaluacion.faltantes[0])?.focus();
            return;
          }
          resultado.value = evaluacion;
          await nextTick();
          document.getElementById("resultado-diagnostico")?.focus();
        } catch {
          mensaje.value = "Revisa tus respuestas e intenta de nuevo.";
        }
      }

      async function reiniciar() {
        Object.assign(respuestas, crearRespuestasVacias());
        limpiarResultado();
        await nextTick();
        document.getElementById("pregunta-" + PREGUNTAS[0].id)?.focus();
      }

      return {
        preguntas: PREGUNTAS, opciones: OPCIONES, respuestas, resultado,
        mensaje, faltantes, respondidas, calcular, reiniciar, limpiarResultado
      };
    }
  });
  aplicacion.mount(selector);
  return aplicacion;
}
