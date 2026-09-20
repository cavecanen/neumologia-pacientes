const chatLog=document.querySelector('#chatLog');
const chatForm=document.querySelector('#chatForm');
const chatInput=document.querySelector('#chatInput');
const urgentDialog=document.querySelector('#urgentDialog');
const installDialog=document.querySelector('#installDialog');
const installButton=document.querySelector('#installButton');
const connectionStatus=document.querySelector('#connectionStatus');
let deferredInstallPrompt=null;

const normalize=text=>text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const answers=[
  {terms:['mucha sangre','sangrado abundante','no paro de sangrar','me ahogo','no puedo respirar','desmayo','confusion','dolor fuerte en el pecho'],type:'danger',html:'<strong>Esto puede ser una urgencia.</strong><p>Llama al <strong>112 ahora</strong>. Si el sangrado es importante, siéntate, evita comer o beber y no conduzcas tú mismo.</p>'},
  {terms:['sangre','hemoptisis','hilo rojo','estria roja'],type:'warning',html:'<strong>La sangre al toser necesita valoración.</strong><p>Si es abundante, se repite, aparecen coágulos, falta de aire, mareo o dolor torácico, llama al <strong>112</strong>. Si son pequeñas estrías y estás estable, contacta con tu equipo sanitario hoy. Suspende las maniobras de expulsión muy enérgicas hasta recibir indicaciones.</p>'},
  {terms:['mas flema','mas esputo','moco','flema verde','flema oscura','esputo oscuro'],type:'warning',html:'<strong>Un aumento del esputo o un cambio claro de color y consistencia puede acompañar una exacerbación.</strong><p>Comprueba si también tienes más tos, falta de aire, fiebre o cansancio. Si el cambio persiste o reúne varios síntomas, sigue tu plan escrito y contacta con tu equipo. Si puedes, recoge una muestra antes de iniciar el antibiótico pautado.</p>'},
  {terms:['muestra','cultivo','recoger esputo','bote de esputo'],html:'<strong>Para obtener una muestra útil:</strong><ol><li>Utiliza un recipiente estéril y evita tocar su interior.</li><li>Enjuágate la boca solo con agua.</li><li>Tose desde el pecho y deposita esputo, no saliva.</li><li>Cierra el bote, anota fecha y hora y entrégalo cuanto antes siguiendo las instrucciones del centro.</li></ol><p>Siempre que sea posible, recógelo antes de comenzar antibióticos.</p>'},
  {terms:['fisioterapia','drenaje','acapella','flutter','aerobika','pep'],html:'<strong>La limpieza bronquial debe estar personalizada por fisioterapia respiratoria.</strong><p>Realiza la técnica aprendida con regularidad, en el orden indicado y sin forzar hasta el agotamiento. Detente si aparece sangrado, dolor torácico, mareo o falta de aire intensa y solicita orientación.</p>'},
  {terms:['suero hipertonico','hipertonico','hyaneb','nebulizacion salina'],html:'<strong>El suero hipertónico ayuda a movilizar secreciones en algunos pacientes.</strong><p>Úsalo con la concentración, frecuencia y orden pautados. Si tienes prescrito un broncodilatador previo, respeta ese orden. Interrumpe la nebulización y pide valoración si provoca opresión intensa, sibilancias o falta de aire que no cede.</p>'},
  {terms:['antibiotico inhalado','colistina','colistimetato','tobramicina','aztreonam'],html:'<strong>No modifiques el antibiótico inhalado por tu cuenta.</strong><p>Respeta el orden prescrito, la preparación del dispositivo y su limpieza. Si aparece broncoespasmo, dolor torácico o intolerancia importante, detén la dosis y contacta con tu equipo. No compartas nebulizadores ni accesorios.</p>'},
  {terms:['limpio mi nebulizador','limpiar nebulizador','limpieza nebulizador'],html:'<strong>La limpieza evita contaminación y fallos del dispositivo.</strong><p>Después de cada uso, desmonta las piezas autorizadas, lávalas y desinféctalas según el fabricante, acláralas si corresponde y deja que se sequen completamente al aire sobre una superficie limpia. No sumerjas compresores ni piezas eléctricas.</p>'},
  {terms:['pseudomonas','pseudomona'],html:'<strong>Pseudomonas puede colonizar las vías respiratorias y asociarse a más exacerbaciones en algunas personas.</strong><p>Su importancia depende de si es un primer aislamiento, de los cultivos repetidos y de tu situación clínica. No significa por sí sola que necesites siempre antibiótico: el resultado debe interpretarse junto con tus síntomas.</p>'},
  {terms:['fiebre','mas tos','empeorado','exacerbacion'],type:'warning',html:'<strong>Puede existir una exacerbación si empeoran durante varios días la tos, el esputo, la falta de aire, el cansancio o aparece hemoptisis.</strong><p>Utiliza “Comprobar cambio” para ordenar los síntomas. Si estás claramente peor, activa tu plan escrito y contacta con tu equipo; no uses restos de antibióticos de episodios anteriores.</p>'},
  {terms:['que son bronquiectasias','bronquiectasias'],html:'<strong>Las bronquiectasias son dilataciones permanentes de los bronquios que favorecen la acumulación de secreciones e infecciones repetidas.</strong><p>La limpieza bronquial regular, el ejercicio, las vacunas y el tratamiento individualizado ayudan a reducir síntomas y exacerbaciones.</p>'}
];

function addMessage(html,role='assistant',type=''){const article=document.createElement('article');article.className=`message ${role} ${type}`.trim();if(role==='user')article.textContent=html;else article.innerHTML=html;chatLog.appendChild(article);chatLog.scrollTop=chatLog.scrollHeight}
function respond(text){const value=normalize(text);const match=answers.find(item=>item.terms.some(term=>value.includes(term)));window.setTimeout(()=>{if(match)addMessage(match.html,'assistant',match.type||'');else addMessage('<strong>No quiero darte una respuesta poco fiable.</strong><p>Puedo ayudarte con cambios en el esputo, hemoptisis, exacerbaciones, muestras, fisioterapia respiratoria, nebulizadores y antibióticos inhalados.</p>')},260)}
function submitPrompt(text){const clean=text.trim();if(!clean)return;addMessage(clean,'user');respond(clean);chatInput.value='';chatInput.style.height=''}
chatForm.addEventListener('submit',event=>{event.preventDefault();submitPrompt(chatInput.value)});
chatInput.addEventListener('input',()=>{chatInput.style.height='auto';chatInput.style.height=`${Math.min(chatInput.scrollHeight,130)}px`});
chatInput.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitPrompt(chatInput.value)}});
document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>submitPrompt(button.dataset.prompt)));

function switchView(name){document.querySelectorAll('.tab').forEach(tab=>{const active=tab.dataset.view===name;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active))});document.querySelectorAll('.view').forEach(view=>{const active=view.id===`${name}View`;view.classList.toggle('is-active',active);view.hidden=!active})}
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>switchView(tab.dataset.view)));
document.querySelectorAll('[data-routine-prompt]').forEach(button=>button.addEventListener('click',()=>{switchView('chat');submitPrompt(button.dataset.routinePrompt)}));
document.querySelector('#urgentButton').addEventListener('click',()=>urgentDialog.showModal());

document.querySelector('#symptomForm').addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const symptoms=data.getAll('symptom');
  const hasBlood=data.has('blood');
  const hasDanger=data.has('danger');
  const duration=data.get('duration');
  const result=document.querySelector('#symptomResult');
  result.className='result-card';
  if(hasDanger){result.classList.add('danger');result.innerHTML='<h3>Necesitas atención inmediata</h3><p>Llama al <strong>112 ahora</strong>. No esperes al resultado de una muestra ni conduzcas tú mismo si te encuentras muy mal.</p>'}
  else if(hasBlood){result.classList.add('warning');result.innerHTML='<h3>La hemoptisis debe valorarse</h3><p>Si el sangrado es abundante, repetido, con coágulos o se acompaña de falta de aire, mareo o dolor torácico, llama al <strong>112</strong>. Si son pequeñas estrías y estás estable, contacta con tu equipo hoy.</p>'}
  else if(symptoms.length>=3&&(duration==='medium'||duration==='long')){result.classList.add('warning');result.innerHTML='<h3>Cambio compatible con una posible exacerbación</h3><p>Activa el plan escrito acordado y contacta con tu equipo sanitario hoy. Si tienes indicado recoger cultivo, hazlo antes del antibiótico cuando sea posible.</p>'}
  else if(symptoms.length>=2||duration==='long'){result.classList.add('warning');result.innerHTML='<h3>Conviene vigilarlo de cerca</h3><p>Compara con tu patrón habitual. Si persiste, aumenta o aparece otro síntoma, contacta con tu equipo y sigue tu plan escrito.</p>'}
  else if(symptoms.length===0){result.innerHTML='<h3>No has marcado cambios</h3><p>Mantén tu rutina habitual. Si algo te preocupa aunque no figure aquí, utiliza la conversación o solicita valoración.</p>'}
  else{result.innerHTML='<h3>Cambio reciente y limitado</h3><p>Mantén la hidratación y la limpieza bronquial según tu plan. Revisa la evolución durante las próximas horas y solicita valoración si empeora o persiste.</p>'}
  result.hidden=false;result.scrollIntoView({behavior:'smooth',block:'nearest'});
});

const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;if(isStandalone)installButton.hidden=true;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;installButton.hidden=false});
installButton.addEventListener('click',async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;return}installDialog.showModal()});
window.addEventListener('appinstalled',()=>{installButton.hidden=true});
function updateConnectionStatus(){connectionStatus.hidden=navigator.onLine}window.addEventListener('online',updateConnectionStatus);window.addEventListener('offline',updateConnectionStatus);updateConnectionStatus();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

function registerWebMcpTools(){const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});register({name:'ask_bronchiectasis_question',title:'Preguntar sobre bronquiectasias',description:'Envía una pregunta educativa al orientador visible.',inputSchema:{type:'object',properties:{question:{type:'string',minLength:1,maxLength:500}},required:['question'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||typeof input.question!=='string'||!input.question.trim()||input.question.length>500)throw new Error('La pregunta debe tener entre 1 y 500 caracteres.');switchView('chat');submitPrompt(input.question);return{status:'shown',question:input.question.trim()}}});register({name:'start_symptom_check',title:'Comprobar cambios de síntomas',description:'Abre el comprobador visible de cambios respiratorios.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(){switchView('check');return{status:'opened'}}})}
registerWebMcpTools();
