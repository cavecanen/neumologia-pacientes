const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const messages = $('#messages');
const input = $('#chatInput');
const form = $('#chatForm');

const answers = {
  driving: `La somnolencia al volante es una señal de riesgo.\n\n• No conduzcas ni uses maquinaria si notas sueño. Si ya estás conduciendo, detente en un lugar seguro.\n• No confíes en café, música o bajar la ventanilla para continuar.\n• Solicita valoración prioritaria a tu unidad de sueño, especialmente si has tenido un susto, cabeceos o un accidente.\n• Usa el tratamiento durante todo el tiempo de sueño, pero no reinicies la conducción hasta sentirte seguro y haber recibido indicaciones si el problema persiste.`,
  leak: `Para reducir fugas:\n\n1. Coloca la mascarilla tumbado, con el equipo encendido y la presión habitual.\n2. Recolócala antes de apretar; unas correas demasiado tensas pueden empeorar el sellado y dejar marcas.\n3. Limpia la almohadilla según el fabricante y revisa si está deformada.\n4. Comprueba que talla y tipo de mascarilla se ajustan a tu forma de dormir.\n\nSi la fuga continúa, hace ruido, seca la boca o alcanza los ojos, pide revisión de mascarilla. No cambies la presión por tu cuenta.`,
  dry: `La sequedad puede deberse a humidificación insuficiente, congestión nasal o fuga por la boca.\n\n• Comprueba que el humidificador está montado y funciona según el manual.\n• Revisa fugas y congestión; el suero salino nasal puede resultar útil en algunas personas.\n• Si usas mascarilla nasal y abres la boca, la unidad puede valorar otra interfaz o una solución específica.\n• Ajusta la humidificación solo dentro de las instrucciones de tu equipo; si aparece condensación, revisa temperatura, tubo calefactado y ubicación del aparato.`,
  intolerance: `Es frecuente necesitar adaptación. Prueba una exposición gradual: ponte la mascarilla despierto unos minutos, después con el equipo encendido y finalmente al acostarte. Practica mientras lees o ves algo tranquilo.\n\nRevisa fugas y evita apretar en exceso. Las funciones de rampa o alivio espiratorio solo deben usarse según la configuración indicada. Si sientes claustrofobia, presión insoportable o te la quitas dormido, pide una revisión temprana; no modifiques la presión ni abandones el tratamiento por tu cuenta.`,
  pressure: `La sensación de presión o aire en el estómago merece revisión si se repite. Comprueba primero que no haya fugas y evita acostarte justo después de una comida copiosa. Usa solo las funciones de confort ya indicadas para tu equipo.\n\nNo cambies la presión de CPAP/APAP por tu cuenta: la unidad de sueño puede revisar datos, mascarilla y configuración para encontrar la causa.`,
  skin: `Para marcas o irritación: limpia y seca la piel y la almohadilla, recoloca la mascarilla y evita tensar demasiado. Revisa si la pieza está deformada o necesita sustitución. No coloques cremas grasas bajo el sellado salvo que el fabricante las permita.\n\nSi hay herida, dolor persistente, hinchazón o lesión en el puente nasal, deja descansar esa zona y solicita una alternativa de interfaz con tu unidad.`,
  clean: `Sigue siempre el manual de tu marca. En general, las piezas desmontables se limpian con agua y jabón suave y se dejan secar al aire; la unidad eléctrica nunca se sumerge. Limpia o cambia los filtros con la frecuencia indicada.\n\nLos aparatos de ozono o luz UV no autorizados no sustituyen la limpieza habitual y pueden dañar materiales o causar exposición irritante.`,
  travel: `Lista breve para viajar:\n\n• Lleva la CPAP y sus accesorios como equipaje de mano, protegidos.\n• Comprueba voltaje, adaptador, batería y disponibilidad de agua adecuada según el fabricante.\n• Lleva una copia de la prescripción o informe si dispones de ella.\n• Consulta con antelación las normas de la compañía si deseas usarla durante el vuelo.\n• Úsala todas las noches y también en las siestas.`,
  sleepy: `Si persiste el sueño diurno pese a usar la CPAP, conviene revisar cuanto antes las horas reales de uso, fugas, eventos residuales, duración del sueño, medicamentos y otras posibles causas. No conduzcas si tienes somnolencia. La app no puede interpretar por sí sola el informe del equipo ni confirmar que el tratamiento sea eficaz.`,
  snoring: `Roncar o notar pausas con la CPAP puede indicar fugas, uso parcial, posición o que el tratamiento necesita revisión. Asegura un buen sellado y úsala durante todo el sueño. Si se repite, comparte el informe del dispositivo con tu unidad; no cambies la presión por tu cuenta.`,
  diagnose: `La apnea obstructiva del sueño no se confirma solo por ronquidos. Si hay pausas observadas, ahogos nocturnos, sueño no reparador, cefalea matutina o somnolencia diurna, solicita valoración. El diagnóstico requiere una evaluación clínica y, cuando procede, un estudio de sueño.`,
  emergency: `Estos síntomas no deben valorarse solo con esta herramienta. Si tienes dolor torácico intenso, falta de aire grave, desmayo, confusión brusca o labios azulados, llama al 112.`,
  default: `Puedo orientarte mejor si me dices qué ocurre: ¿fugas o ruido, sequedad, congestión, marcas, sensación de presión, claustrofobia, sueño durante el día, limpieza o viaje?\n\nNo incluyas nombre, teléfono, número de historia ni otros datos personales.`
};

function classify(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/(condu|volante|coche|maquinaria).*(sueno|duermo|dormir)|me duermo conduciendo|cabeceo/.test(t)) return ['driving', true];
  if (/(dolor.*pecho|dolor torac|falta.*aire.*grave|labios.*azul|desmayo|confusion brusca)/.test(t)) return ['emergency', true];
  if (/(fuga|escapa.*aire|ruido.*mascar|sellado)/.test(t)) return ['leak', false];
  if (/(seca|sequedad|boca seca|garganta seca|congestion|nariz tapada|condens|agua.*tubo)/.test(t)) return ['dry', false];
  if (/(no toler|agob|claustrof|me la quito|adapt|ansiedad.*mascar)/.test(t)) return ['intolerance', false];
  if (/(presion|aerofagia|aire.*estomago|hinchad)/.test(t)) return ['pressure', false];
  if (/(marca|herida|irrita|piel|puente nasal)/.test(t)) return ['skin', false];
  if (/(limp|lavar|ozono|ultravioleta|uv|filtro)/.test(t)) return ['clean', false];
  if (/(viaj|avion|vuelo|aeropuerto|bateria)/.test(t)) return ['travel', false];
  if (/(somnol|sueno.*dia|cansad|fatiga)/.test(t)) return ['sleepy', false];
  if (/(ronc|pausa|apnea.*cpap)/.test(t)) return ['snoring', false];
  if (/(tengo apnea|diagnost|estudio.*sueno|ronco)/.test(t)) return ['diagnose', false];
  return ['default', false];
}

function addMessage(text, who = 'assistant', alert = false) {
  const article = document.createElement('article');
  article.className = `message ${who}${alert ? ' alert' : ''}`;
  const label = document.createElement('span');
  label.className = 'message-label';
  label.textContent = who === 'user' ? 'Tú' : 'Asistente';
  const p = document.createElement('p');
  p.textContent = text;
  article.append(label, p);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
}

function ask(question) {
  const clean = question.trim();
  if (!clean) return;
  addMessage(clean, 'user');
  const [key, alert] = classify(clean);
  window.setTimeout(() => addMessage(answers[key], 'assistant', alert), 180);
}

form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; input.style.height = ''; });
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });

$$('[data-question]').forEach(button => button.addEventListener('click', () => {
  const tab = $('.tab[data-tab="chat"]');
  tab.click();
  ask(button.dataset.question);
}));

$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  $$('.panel').forEach(p => { p.classList.remove('active'); p.hidden = true; });
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  const panel = $(`#panel-${tab.dataset.tab}`); panel.hidden = false; panel.classList.add('active');
}));

$('#cpapReview').addEventListener('submit', e => {
  e.preventDefault();
  const selected = $$('input[name="issue"]:checked', e.currentTarget).map(x => x.value);
  const result = $('#reviewResult');
  const plans = [];
  if (selected.includes('use')) plans.push('Busca qué interrumpe el uso: molestias, rutina, congestión o retirada involuntaria. El objetivo es usarla durante todo el tiempo de sueño, incluidas las siestas.');
  if (selected.includes('leak')) plans.push('Recoloca la mascarilla tumbado y con el equipo encendido; no aprietes de más. Si persiste, solicita revisión de talla, modelo y desgaste.');
  if (selected.includes('dry')) plans.push('Revisa humidificación, congestión y fugas por la boca siguiendo el manual. Si no mejora, consulta una solución adaptada a tu interfaz.');
  if (selected.includes('pressure')) plans.push('Usa solo los ajustes de confort indicados y solicita revisión de datos y configuración. No cambies la presión por tu cuenta.');
  if (selected.includes('sleepy')) plans.push('Contacta de forma prioritaria con tu unidad de sueño. No conduzcas ni manejes maquinaria mientras tengas somnolencia.');
  if (!plans.length) plans.push('No has marcado problemas. Mantén el uso durante todo el sueño, la limpieza indicada por el fabricante y tus controles programados.');
  result.innerHTML = `${selected.includes('sleepy') ? '<div class="danger-note"><strong>Seguridad primero:</strong> la somnolencia al volante requiere dejar de conducir y solicitar valoración prioritaria.</div>' : ''}<h3>Tu siguiente paso</h3><ol>${plans.map(p => `<li>${p}</li>`).join('')}</ol>`;
  result.hidden = false; result.scrollIntoView({behavior:'smooth', block:'nearest'});
});

let installPrompt;
const dialog = $('#installDialog');
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
$('#installButton').addEventListener('click', async () => {
  if (installPrompt) { installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  $('#installSteps').innerHTML = ios
    ? '<ol class="install-steps"><li>Abre esta página en <strong>Safari</strong>.</li><li>Pulsa <strong>Compartir</strong> (cuadrado con flecha hacia arriba).</li><li>Elige <strong>Añadir a pantalla de inicio</strong> y confirma.</li></ol>'
    : '<ol class="install-steps"><li>Abre el menú de tu navegador.</li><li>Elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.</li><li>Confirma la instalación.</li></ol>';
  dialog.showModal();
});
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));

if (navigator.modelContext?.registerTool) {
  navigator.modelContext.registerTool({name:'ask_sleep_apnea_question',description:'Orientación educativa sobre apnea del sueño y CPAP',inputSchema:{type:'object',properties:{question:{type:'string'}},required:['question']},execute:({question})=>{ask(question);return {shown:true};}});
  navigator.modelContext.registerTool({name:'start_cpap_check',description:'Abre el chequeo guiado de CPAP',inputSchema:{type:'object',properties:{}},execute:()=>{$('.tab[data-tab="review"]').click();return {opened:true};}});
}
