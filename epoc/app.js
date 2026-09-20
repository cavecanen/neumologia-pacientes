const chatLog = document.querySelector('#chatLog');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const urgencyDialog = document.querySelector('#urgencyDialog');
const installDialog = document.querySelector('#installDialog');
const installButton = document.querySelector('#installButton');
const connectionStatus = document.querySelector('#connectionStatus');
let deferredInstallPrompt = null;

const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const answers = [
  {
    terms: ['no puedo respirar', 'ahogo en reposo', 'labios azules', 'confusion', 'desmayo', 'dolor en el pecho', 'mucha sangre', 'sangre abundante'],
    type: 'danger',
    html: '<strong>Esto puede ser una urgencia.</strong><p>Llama al <strong>112 ahora</strong>. Si estás muy mal, no conduzcas tú mismo ni esperes a que se pase.</p>'
  },
  {
    terms: ['falta de aire', 'mas aire', 'ahogo', 'respirar peor', 'disnea'],
    type: 'warning',
    html: '<strong>Vamos a valorar ese cambio.</strong><p>Si la falta de aire es intensa en reposo, empeora rápidamente, aparece dolor torácico, confusión o labios azulados, llama al <strong>112</strong>.</p><p>Si no, usa la medicación de rescate solo como figure en tu plan y contacta hoy con tu equipo si estás claramente peor de lo habitual.</p>'
  },
  {
    terms: ['tos', 'flema', 'moco', 'esputo'],
    type: 'warning',
    html: '<strong>Más tos, mayor cantidad de flemas o un cambio de color pueden indicar una exacerbación.</strong><p>Observa también si tienes más falta de aire, fiebre o necesitas más medicación de rescate. Si el cambio es claro, consulta con tu equipo sanitario hoy; no empieces antibióticos o corticoides salvo que tu plan escrito lo indique.</p>'
  },
  {
    terms: ['inhalador', 'camara', 'aerosol', 'puff'],
    html: '<strong>La técnica depende del dispositivo.</strong><ol><li>Vacía los pulmones antes de inhalar, sin soplar dentro del aparato.</li><li>Sella bien los labios.</li><li>En cartucho presurizado: pulsa e inspira lenta y profundamente. En polvo seco: inspira rápida y profundamente.</li><li>Mantén el aire 5–10 segundos si puedes.</li></ol><p>Si contiene corticoide, enjuágate la boca al terminar. Lleva tu inhalador a la próxima revisión para comprobar la técnica.</p>'
  },
  {
    terms: ['ejercicio', 'caminar', 'andar', 'entrenar'],
    html: '<strong>El ejercicio regular ayuda a conservar fuerza y autonomía.</strong><p>Empieza con caminatas a un ritmo que permita hablar en frases cortas, añade descansos y progresa poco a poco. Para y pide ayuda si aparece dolor torácico, mareo, desmayo o falta de aire desproporcionada.</p>'
  },
  {
    terms: ['oxigeno', 'saturacion', 'pulsioximetro'],
    html: '<strong>No cambies el caudal de oxígeno por tu cuenta.</strong><p>Usa el objetivo de saturación y el flujo que te hayan prescrito. Una cifra aislada puede fallar por manos frías, movimiento o esmalte. Si la lectura sigue muy por debajo de tu objetivo y te encuentras peor, solicita atención urgente.</p>'
  },
  {
    terms: ['tabaco', 'fumar', 'cigarrillo', 'vapeo'],
    html: '<strong>Dejar de fumar es la medida que más frena el deterioro pulmonar.</strong><p>Los tratamientos combinados —apoyo profesional y medicación cuando procede— aumentan mucho las posibilidades de conseguirlo. Vapear no es un tratamiento inocuo para la EPOC.</p>'
  },
  {
    terms: ['vacuna', 'gripe', 'covid', 'neumococo'],
    html: '<strong>Las vacunas reducen el riesgo de infecciones graves y exacerbaciones.</strong><p>Conviene revisar periódicamente gripe, COVID-19, neumococo y otras vacunas indicadas según tu edad y situación clínica.</p>'
  },
  {
    terms: ['que es epoc', 'epoc'],
    html: '<strong>La EPOC es una enfermedad respiratoria crónica que dificulta la salida del aire de los pulmones.</strong><p>Puede causar falta de aire, tos y flemas. El tratamiento, el ejercicio y evitar el tabaco ayudan a reducir síntomas y crisis.</p>'
  }
];

function addMessage(html, role = 'assistant', type = '') {
  const article = document.createElement('article');
  article.className = `message ${role} ${type}`.trim();
  if (role === 'user') article.textContent = html;
  else article.innerHTML = html;
  chatLog.appendChild(article);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function respond(text) {
  const value = normalize(text);
  const match = answers.find(item => item.terms.some(term => value.includes(term)));
  window.setTimeout(() => {
    if (match) addMessage(match.html, 'assistant', match.type || '');
    else addMessage('<strong>No quiero darte una respuesta poco fiable.</strong><p>Puedo orientarte sobre falta de aire, tos o flemas, inhaladores, ejercicio, oxígeno, tabaco y vacunas. Si describes un empeoramiento importante, comprueba primero los signos de urgencia.</p>');
  }, 280);
}

function submitPrompt(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  respond(clean);
  chatInput.value = '';
  chatInput.style.height = '';
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  submitPrompt(chatInput.value);
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 130)}px`;
});

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitPrompt(chatInput.value);
  }
});

document.querySelectorAll('[data-prompt]').forEach(button => {
  button.addEventListener('click', () => submitPrompt(button.dataset.prompt));
});

function switchView(name) {
  document.querySelectorAll('.tab').forEach(tab => {
    const active = tab.dataset.view === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.view').forEach(view => {
    const active = view.id === `${name}View`;
    view.classList.toggle('is-active', active);
    view.hidden = !active;
  });
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
document.querySelectorAll('[data-plan-prompt]').forEach(button => button.addEventListener('click', () => {
  switchView('chat');
  submitPrompt(button.dataset.planPrompt);
}));

document.querySelector('#emergencyButton').addEventListener('click', () => urgencyDialog.showModal());
document.querySelector('#planUrgency').addEventListener('click', () => urgencyDialog.showModal());

const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
if (isStandalone) installButton.hidden = true;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  installDialog.showModal();
});

window.addEventListener('appinstalled', () => { installButton.hidden = true; });

function updateConnectionStatus() {
  connectionStatus.hidden = navigator.onLine;
}
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}

const catItems = [
  ['Tos', 'Nunca toso', 'Toso todo el tiempo'],
  ['Flemas', 'No tengo flemas', 'Tengo muchas flemas'],
  ['Opresión en el pecho', 'No noto opresión', 'Noto mucha opresión'],
  ['Falta de aire al subir', 'No me falta el aire', 'Me falta mucho el aire'],
  ['Actividades en casa', 'No me limitan', 'Me limitan mucho'],
  ['Seguridad al salir', 'Salgo con seguridad', 'No salgo con seguridad'],
  ['Sueño', 'Duermo profundamente', 'No duermo bien'],
  ['Energía', 'Tengo mucha energía', 'No tengo energía']
];

const catQuestions = document.querySelector('#catQuestions');
catItems.forEach((item, index) => {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'cat-question';
  fieldset.innerHTML = `<legend>${index + 1}. ${item[0]}</legend><div class="scale-labels"><span>${item[1]}</span><span>${item[2]}</span></div><div class="score-options">${[0,1,2,3,4,5].map(score => `<label><input type="radio" name="cat${index}" value="${score}" required><span>${score}</span></label>`).join('')}</div>`;
  catQuestions.appendChild(fieldset);
});

document.querySelector('#catForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  let score = 0;
  for (let i = 0; i < catItems.length; i++) score += Number(data.get(`cat${i}`));
  const level = score < 10 ? 'impacto bajo' : score < 20 ? 'impacto medio' : score < 30 ? 'impacto alto' : 'impacto muy alto';
  const advice = score >= 20 ? 'El impacto es importante: conviene revisar síntomas, técnica inhalatoria y plan de tratamiento con tu equipo sanitario.' : 'Guarda el resultado y compáralo con mediciones posteriores. Un cambio de 2 puntos o más puede ser relevante.';
  const result = document.querySelector('#catResult');
  result.innerHTML = `<h3>Resultado CAT: ${score} de 40</h3><p>Esto corresponde a un <strong>${level}</strong> de la EPOC en tu vida diaria.</p><p>${advice}</p><p><small>El CAT orienta sobre impacto; no diagnostica una exacerbación ni sustituye la espirometría.</small></p>`;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelector('#mmrcSelect').addEventListener('change', event => {
  const output = document.querySelector('#mmrcResult');
  output.textContent = event.target.value === '' ? '' : `Tu grado mMRC orientativo es ${event.target.value}. Coméntalo en tu próxima revisión, especialmente si ha aumentado.`;
});

// Permite que navegadores compatibles ofrezcan las acciones principales a asistentes.
function registerWebMcpTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const register = tool => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});

  register({
    name: 'ask_epoc_question',
    title: 'Preguntar al orientador EPOC',
    description: 'Envía una pregunta educativa sobre EPOC al orientador visible de la página.',
    inputSchema: {
      type: 'object',
      properties: { question: { type: 'string', minLength: 1, maxLength: 500 } },
      required: ['question'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: true },
    execute(input) {
      if (!input || typeof input.question !== 'string' || !input.question.trim() || input.question.length > 500) throw new Error('La pregunta debe tener entre 1 y 500 caracteres.');
      switchView('chat');
      submitPrompt(input.question);
      return { status: 'shown', question: input.question.trim() };
    }
  });

  register({
    name: 'complete_cat_questionnaire',
    title: 'Completar cuestionario CAT',
    description: 'Introduce las ocho respuestas CAT, calcula el resultado y lo muestra en la página.',
    inputSchema: {
      type: 'object',
      properties: {
        scores: { type: 'array', minItems: 8, maxItems: 8, items: { type: 'integer', minimum: 0, maximum: 5 } }
      },
      required: ['scores'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !Array.isArray(input.scores) || input.scores.length !== 8 || input.scores.some(score => !Number.isInteger(score) || score < 0 || score > 5)) throw new Error('Se necesitan ocho puntuaciones enteras entre 0 y 5.');
      input.scores.forEach((score, index) => {
        document.querySelector(`input[name="cat${index}"][value="${score}"]`).checked = true;
      });
      switchView('cat');
      document.querySelector('#catForm').requestSubmit();
      return { status: 'shown', total: input.scores.reduce((sum, score) => sum + score, 0) };
    }
  });
}

registerWebMcpTools();
