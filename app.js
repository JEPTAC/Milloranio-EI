import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCb210-ygNI41gZDX6CmBiP7ls2rLpLZ9A",
  authDomain: "millonario-f7841.firebaseapp.com",
  projectId: "millonario-f7841",
  storageBucket: "millonario-f7841.firebasestorage.app",
  messagingSenderId: "486256743726",
  appId: "1:486256743726:web:1ea931b3c110817b5196bf",
  measurementId: "G-XEKGBTQQHX"
};

const ASSETS = {
  logo: "assets/logo_dream_team_calidad.png",
  logoCalidad: "assets/logo_dream_team_calidad.png",
  sent: "assets/gif_penguin_oops.gif",
  working: "assets/gif_support_bunny.gif",
  document: "assets/gif_processing_cat.gif",
  extend: "assets/gif_loading_gorilla.gif",
  scream: "assets/gif_scream_help.gif",
  energy: "assets/gif_energy_pill.gif",
  shock: "assets/gif_dance_shock.gif"
};

const SOUNDS = {
  correct: [
    "assets/asi-se-hace.mp3",
    "assets/que-buena-respuesta.mp3",
    "assets/buena-respuesta-un.mp3"
  ],
  wrong: ["assets/nahhh-baby.mp3"]
};
const CACHE_ADMIN_CODE = "JU4nes1205//";

const GIFS = {
  intro: ["assets/gif_energy_pill.gif", "assets/gif_processing_cat.gif", "assets/gif_support_bunny.gif"],
  correct: ["assets/gif_dance_shock.gif", "assets/gif_energy_pill.gif", "assets/gif_support_bunny.gif"],
  wrong: ["assets/gif_penguin_oops.gif", "assets/gif_scream_help.gif", "assets/gif_loading_gorilla.gif"],
  joke: ["assets/gif_dance_shock.gif", "assets/gif_scream_help.gif", "assets/gif_processing_cat.gif", "assets/gif_penguin_oops.gif"],
  win: ["assets/gif_energy_pill.gif", "assets/gif_dance_shock.gif", "assets/gif_support_bunny.gif", "assets/gif_processing_cat.gif"],
  neutral: ["assets/gif_processing_cat.gif", "assets/gif_support_bunny.gif", "assets/gif_loading_gorilla.gif"]
};

const MONEY = [100,200,500,1000,2000,5000,10000,20000,50000,100000,250000,500000,1000000];
const SAFE_INDEXES = [3,8];
const LETTERS = ["A","B","C","D"];
const AREAS = ["Atención al Usuario","Iluminación","Logística Ap.","Medio Ambiente","Operaciones","SIG","Activos Fijos","Auditoría","Calidad","Contabilidad","SAGRILAFT y PTEE","Finanzas","Gestión Documental","Gestión Humana","Jurídico","Mantenimiento e Infraestructura","Nómina","Servicios Generales","Sistemas","SST","Mensajería","Cierre","Ejecución","Planeación","Cartera","Compras","Logística","Ventas"];

const funnyCorrect = [
  "Correcto. Esa respuesta pasó con evidencia, trazabilidad y buena energía.",
  "Bien. La mejora continua acaba de hacer una vuelta olímpica.",
  "Excelente. Eso sonó a auditoría cerrada sin observaciones.",
  "Correcto. Se desbloqueó el modo Dream Team de calidad.",
  "Muy bien. El Excel financiero acaba de aplaudir desde la nube."
];
const funnyWrong = [
  "Uy no. Esa respuesta quedó en espera ampliada.",
  "Casi, pero el procedimiento se fue por otra ruta.",
  "No fue. El auditor interno acaba de levantar una ceja.",
  "Eso necesita acción correctiva, pero con cariño.",
  "La respuesta salió sin código de barras."
];
const jokeMessages = [
  "Era una pregunta trampa. Nadie en la historia de la empresa tenía por qué saber eso.",
  "Respuesta aceptada por valentía, pero no por conocimiento. Esto no contaba.",
  "La pregunta era tan difícil que ni el procedimiento quería responder.",
  "Tranquilidad: no perdiste plata. Solo ganaste una risa institucional.",
  "El sistema confirma que esta pregunta fue inventada por alguien con demasiado café."
];

const QUESTION_BANK = [
  {level:1,cat:"Cultura",q:"¿Qué valor es clave cuando trabajamos en equipo entre diferentes procesos?",options:["Competencia interna","Colaboración","Silencio absoluto","Improvisación"],ok:1,hint:"Piensa en lo que permite que varias procesos lleguen al mismo resultado."},
  {level:1,cat:"Cultura",q:"¿Cuál actitud ayuda más a resolver una solicitud entre procesos?",options:["Responder con evidencia","No contestar correos","Esperar a que otro lo haga","Cambiar la versión sin avisar"],ok:0,hint:"La trazabilidad nace cuando alguien deja soporte de lo que hizo."},
  {level:1,cat:"SST",q:"¿Quién debe verificar que los elementos de protección personal se usen correctamente en una actividad operativa?",options:["Solo el cliente","El proceso responsable y SST cuando aplique","Nadie, si hay afán","El proceso de cartera"],ok:1,hint:"No es un tema de una sola persona: hay corresponsabilidad operativa y de SST."},
  {level:2,cat:"Gestión Humana",q:"¿Qué proceso suele apoyar las contrataciones y el ingreso de personal?",options:["Gestión Humana","Bodega","Facturación","Diseño gráfico"],ok:0,hint:"Es el proceso que gestiona vinculación, hojas de vida e ingreso."},
  {level:2,cat:"Comunicación",q:"Olvidar responder correos puede generar retrasos en proyectos.",options:["Verdadero","Falso","Solo los lunes","Solo si el correo tiene adjunto"],ok:0,hint:"La comunicación oportuna evita esperas innecesarias."},
  {level:2,cat:"Servicio",q:"Cuando una solicitud llega incompleta, ¿qué debe hacerse primero?",options:["Pedir aclaración concreta y dejar registro","Cerrarla de inmediato","Ignorarla hasta fin de mes","Asignarla a todos al mismo tiempo"],ok:0,hint:"No se avanza sin información mínima, pero tampoco se pierde la trazabilidad."},
  {level:3,cat:"Inventarios",q:"¿Cuál es el principal objetivo de una auditoría de inventarios?",options:["Aumentar el precio de venta","Verificar exactitud y control del inventario","Contratar más personal","Cambiar los colores de la bodega"],ok:1,hint:"Una auditoría contrasta registros, existencias y controles."},
  {level:3,cat:"Inventarios",q:"¿Qué método ayuda a mejorar continuamente la precisión del inventario?",options:["Conteos cíclicos","Ignorar diferencias","Comprar sin control","No registrar entradas"],ok:0,hint:"La mejora viene de revisar por ciclos, no solo al final del año."},
  {level:3,cat:"Bodega",q:"¿Cuál es una buena práctica en bodegas?",options:["Mezclar referencias","Mantener orden y señalización","No etiquetar productos","Guardar todo donde quepa"],ok:1,hint:"El orden reduce errores de ubicación, despacho y conteo."},
  {level:4,cat:"Inventarios",q:"¿Cuál es una causa común de diferencias en inventarios?",options:["Registros incorrectos","Buena organización","Capacitación adecuada","Códigos claros"],ok:0,hint:"Las diferencias suelen nacer de errores de registro, movimientos no reportados o mala identificación."},
  {level:4,cat:"Inventarios",q:"¿Qué indicador mide la exactitud del inventario?",options:["Nivel de ventas","Rotación de personal","Precisión del inventario","Cantidad de reuniones"],ok:2,hint:"El indicador compara lo registrado contra lo físico."},
  {level:4,cat:"Control",q:"¿Qué acción mejora el control de inventarios?",options:["No registrar entradas","Implementar códigos de barras","Guardar productos sin clasificación","Contar solo lo que se ve fácil"],ok:1,hint:"La identificación reduce errores de lectura y ubicación."},
  {level:5,cat:"Auditoría",q:"¿Qué busca identificar una auditoría interna?",options:["Errores y riesgos en los procesos","Clientes nuevos","Diseños publicitarios","El almuerzo de mañana"],ok:0,hint:"La auditoría revisa cumplimiento, riesgos, evidencia y oportunidades de mejora."},
  {level:5,cat:"Calidad",q:"Una no conformidad debe tratarse principalmente con:",options:["Evidencia, análisis de causa y acción correctiva","Una conversación sin registro","Cambio de tema","Un archivo sin nombre"],ok:0,hint:"La mejora necesita soporte, causa y acción."},
  {level:5,cat:"Procesos",q:"¿Qué elemento hace más fuerte una trazabilidad?",options:["Fecha, responsable, soporte y estado","Solo memoria verbal","Un pantallazo borroso","Una nota sin autor"],ok:0,hint:"La trazabilidad permite reconstruir qué pasó, cuándo, quién y con qué soporte."},
  {level:6,cat:"Indicadores",q:"Si un indicador mejora pero las quejas aumentan, ¿qué debe revisarse?",options:["Si el indicador realmente mide el problema crítico","Si el color del tablero es bonito","Si se ocultan las quejas","Si se cambia el nombre del proceso"],ok:0,hint:"Un KPI útil debe representar desempeño real, no solo verse bien."},
  {level:6,cat:"Mejora continua",q:"El ciclo PHVA significa:",options:["Planear, Hacer, Verificar y Actuar","Pedir, Hacer, Vender y Archivar","Planear, Huir, Votar y Aplazar","Pegar, Hacer, Validar y Anular"],ok:0,hint:"Es la base clásica de la gestión de mejora."},
  {level:6,cat:"Riesgo",q:"¿Qué describe mejor un riesgo operativo?",options:["Un evento que puede afectar el resultado de un proceso","Una actividad ya finalizada","Una compra aprobada","Un logo institucional"],ok:0,hint:"El riesgo mira posibilidad e impacto antes o durante el proceso."},
  {level:7,cat:"Servicio",q:"Si una solicitud queda mucho tiempo sin respuesta, el primer impacto probable es:",options:["Aumento de espera y posible incumplimiento","Mejora automática","Reducción total del riesgo","Mayor exactitud de inventario"],ok:0,hint:"El tiempo muerto afecta oportunidad, satisfacción y planeación."},
  {level:7,cat:"Documentación",q:"¿Qué hace que un procedimiento sea realmente útil?",options:["Que describa pasos, responsables, controles y evidencias","Que sea largo sin necesidad","Que nadie lo lea","Que tenga muchas palabras técnicas sin claridad"],ok:0,hint:"Un procedimiento útil orienta ejecución y control."},
  {level:7,cat:"Bodega",q:"Cuando una referencia tiene diferencias repetidas, lo más correcto es:",options:["Analizar causa, revisar movimientos y reforzar control","Cambiarle el nombre","Sacarla del inventario sin soporte","Contarla solo cuando haya visita"],ok:0,hint:"Las diferencias repetidas requieren análisis, no maquillaje."},
  {level:8,cat:"Calidad",q:"¿Cuál es la diferencia más importante entre corrección y acción correctiva?",options:["La corrección atiende el error puntual; la acción correctiva busca eliminar la causa","Son exactamente iguales","La corrección solo aplica a ventas","La acción correctiva no necesita evidencia"],ok:0,hint:"Una cosa arregla el síntoma; la otra ataca la causa."},
  {level:8,cat:"Indicadores",q:"Si se quiere medir oportunidad de atención, el indicador más coherente sería:",options:["Tiempo promedio de respuesta o cumplimiento de plazo","Color del formulario","Cantidad de computadores","Número de reuniones sin acta"],ok:0,hint:"La oportunidad se mide con tiempos y cumplimiento."},
  {level:8,cat:"Auditoría",q:"¿Qué evidencia es más sólida durante una auditoría?",options:["Registro fechado, responsable definido y soporte verificable","Comentario de pasillo","Documento sin fecha","Archivo que nadie puede abrir"],ok:0,hint:"La evidencia debe ser verificable."},
  {level:9,cat:"Inventarios",q:"Si el inventario físico es menor que el sistema, ¿qué hipótesis debe revisarse primero?",options:["Salidas no registradas, errores de conteo o movimientos mal cargados","Que el sistema está triste","Que ventas aumentó el precio","Que el logo está pequeño"],ok:0,hint:"La diferencia puede venir de movimientos no registrados o conteo incorrecto."},
  {level:9,cat:"Gestión",q:"¿Qué implica priorizar una solicitud sin criterio definido?",options:["Riesgo de inequidad, reproceso y pérdida de control","Mejora automática del proceso","Inventario más exacto","Menos necesidad de evidencias"],ok:0,hint:"La prioridad debe tener reglas claras."},
  {level:9,cat:"Mejora continua",q:"Una causa raíz debe describir:",options:["Por qué ocurrió realmente el problema","Quién tiene la culpa únicamente","El color de la carpeta","La respuesta más rápida sin análisis"],ok:0,hint:"La causa raíz va más allá del síntoma visible."},
  {level:10,cat:"Control interno",q:"¿Cuál combinación fortalece más el control de un proceso?",options:["Responsables claros, evidencia, indicadores y seguimiento","Solo buena intención","Más reuniones sin acta","Menos registros para ir más rápido"],ok:0,hint:"El control mezcla personas, datos, evidencia y revisión."},
  {level:10,cat:"Calidad",q:"Si una acción correctiva se cierra sin validar eficacia, ¿qué riesgo queda abierto?",options:["Que el problema se repita","Que el indicador sea demasiado bonito","Que el proceso tenga muchas firmas","Que el ranking pierda emoción"],ok:0,hint:"Cerrar no es suficiente; hay que verificar si funcionó."},
  {level:10,cat:"Datos",q:"¿Qué problema genera una base de datos con campos libres sin estandarización?",options:["Dificulta análisis, filtros e indicadores confiables","Aumenta exactitud automáticamente","Reduce todos los errores","Hace innecesario auditar"],ok:0,hint:"Sin estándar, los datos se vuelven difíciles de comparar."},
  {level:11,cat:"Indicadores",q:"Un KPI puede estar técnicamente calculado y aun así ser inútil cuando:",options:["No está conectado a una decisión o riesgo del proceso","Tiene fórmula matemática","Se actualiza cada mes","Tiene responsable"],ok:0,hint:"Un indicador debe servir para decidir."},
  {level:11,cat:"Auditoría",q:"En una auditoría, un hallazgo debe formularse con:",options:["Criterio, condición, evidencia e impacto o riesgo","Opinión personal y emojis","Solo el nombre del proceso","Una frase muy larga sin soporte"],ok:0,hint:"El hallazgo debe ser verificable y útil para mejorar."},
  {level:11,cat:"Inventarios",q:"Si un conteo cíclico encuentra diferencias pequeñas pero recurrentes, ¿qué conviene hacer?",options:["Analizar tendencia y ajustar controles antes de que crezca","Ignorarlas porque son pequeñas","Esperar al cierre anual","Eliminar el indicador"],ok:0,hint:"La recurrencia es una alerta aunque el valor unitario sea bajo."},
  {level:12,cat:"Gestión por procesos",q:"¿Qué error es más grave al diseñar un flujo de proceso?",options:["No definir entradas, salidas, responsables ni controles","Usar iconos sobrios","Hacerlo en una sola página","Colocar colores corporativos"],ok:0,hint:"Un flujo sin responsabilidades ni controles no sirve para gestionar."},
  {level:12,cat:"Riesgo",q:"Una matriz de riesgos pierde valor cuando:",options:["No se actualiza con eventos reales y controles efectivos","Tiene niveles de probabilidad","Incluye responsables","Muestra impacto"],ok:0,hint:"La matriz debe vivir con la operación, no quedar decorativa."},
  {level:12,cat:"Calidad",q:"¿Qué decisión es más madura ante un incumplimiento repetitivo?",options:["Rediseñar control, revisar causa raíz y medir eficacia","Enviar el mismo correo otra vez sin cambios","Cambiar el nombre del incumplimiento","Ocultarlo del tablero"],ok:0,hint:"La repetición indica que el control actual no basta."},
  {level:13,cat:"Final",q:"Si Electroingeniería quiere mejorar integralmente la gestión, ¿qué combinación tiene mayor impacto sostenible?",options:["Cultura, datos confiables, procesos controlados e indicadores útiles","Solo más formatos","Solo más reuniones","Solo exigir más rápido sin cambiar controles"],ok:0,hint:"La mejora sostenible combina cultura, método, tecnología y seguimiento."},
  {level:13,cat:"Final",q:"¿Cuál es el mayor riesgo de digitalizar un proceso mal diseñado?",options:["Automatizar el desorden y hacerlo más rápido","Eliminar todos los errores por arte de magia","Mejorar sin medir","No necesitar responsables"],ok:0,hint:"La tecnología potencia lo bueno, pero también puede acelerar lo malo."},
  {level:13,cat:"Final",q:"Una organización aprende realmente cuando:",options:["Convierte errores en datos, decisiones y mejoras verificables","Nunca reconoce fallas","Cambia formatos cada semana","Confunde actividad con resultado"],ok:0,hint:"Aprender es cerrar el ciclo entre evidencia, decisión y mejora."},
  {level:11,cat:"Auditoría",q:"Cuando un hallazgo se documenta sin evidencia verificable, el principal problema es que:",options:["Se convierte en una opinión difícil de sostener","Automáticamente se vuelve acción correctiva","Ya no necesita criterio de auditoría","Puede cerrarse sin análisis"],ok:0,hint:"Sin evidencia suficiente, el hallazgo pierde solidez y trazabilidad."},
  {level:12,cat:"Gestión",q:"Si un control existe en el procedimiento pero nadie demuestra su ejecución, el riesgo más real es:",options:["Que el control sea solo formal y no reduzca el riesgo real","Que el proceso sea automáticamente conforme","Que la auditoría no pueda revisarlo","Que el indicador se calcule mejor"],ok:0,hint:"Un control sin evidencia ejecutada no garantiza efectividad."},
  {level:12,cat:"Indicadores",q:"¿Qué señal muestra mejor que un indicador está mal diseñado?",options:["Siempre se ve bien, pero no cambia ninguna decisión ni control","Tiene fórmula matemática","Se revisa periódicamente","Tiene meta y responsable"],ok:0,hint:"Un indicador útil mueve decisiones, no solo decoración."},
  {level:13,cat:"Final",q:"En una cultura madura de mejora, ¿qué debería ocurrir después de detectar un error relevante?",options:["Analizar causa, definir acción, verificar eficacia y aprender del caso","Corregir rápido y olvidar el asunto","Esperar a que otra proceso lo resuelva","Crear más formato aunque no controle nada"],ok:0,hint:"La madurez se nota cuando el error se transforma en aprendizaje verificable."},
  {level:13,cat:"Final",q:"¿Qué decisión demuestra mayor pensamiento sistémico ante fallas repetidas entre procesos?",options:["Revisar flujo completo, roles, datos, tiempos y controles interdependientes","Señalar solo al último que tocó el proceso","Aumentar correos sin cambiar el flujo","Cambiar el nombre del problema"],ok:0,hint:"Lo sistémico mira la cadena completa, no solo el síntoma final."}
];

const JOKE_BANK = [
  {cat:"Pregunta trampa",q:"¿Qué sobrevive más tiempo sin dañarse en una oficina?",options:["Un casco","Un Excel financiero","Un marcador de obra","El café de la oficina"],ok:3},
  {cat:"Pregunta imposible",q:"Si un auditor mira una carpeta durante 8 segundos y suspira, ¿cuántas observaciones trae mentalmente?",options:["3","7","Depende del café","Todas las anteriores"],ok:3},
  {cat:"Electro-misterio",q:"¿Dónde desaparecen los lapiceros cuando más se necesitan?",options:["Bodega","Gestión Humana","Otra dimensión documental","Compras"],ok:2},
  {cat:"Pregunta de supervivencia",q:"¿Qué pesa más en cierre de mes?",options:["Una caja de cable","Un pendiente sin responsable","Un casco mojado","Un mouse inalámbrico"],ok:1},
  {cat:"Cultura pop empresarial",q:"Si el Excel se cierra sin guardar, ¿qué proceso se activa?",options:["Gestión del pánico","Auditoría interna","Conteo cíclico","SST"],ok:0},
  {cat:"Alta complejidad",q:"¿Cuántos correos hacen falta para que alguien escriba 'reitero solicitud'?",options:["1","2","3","La paciencia del remitente decide"],ok:3},
  {cat:"Broma técnica",q:"¿Cuál es el indicador más sensible de la empresa?",options:["Precisión de inventario","Tiempo de respuesta","Nivel de café disponible","Rotación de personal"],ok:2},
  {cat:"Pregunta imposible",q:"Si una reunión empieza 10 minutos tarde pero todos dicen 'arranquemos rápido', ¿cuánto dura?",options:["15 minutos","30 minutos","1 hora","Hasta que alguien diga 'último punto'"],ok:3},
  {cat:"Pregunta sin contexto",q:"¿Cuál es la unidad oficial para medir el drama cuando alguien no adjunta el soporte?",options:["Decibeles","Correos por minuto","Pantallazos por segundo","No está aprobada por metrología"],ok:3},
  {cat:"Auditoría paranormal",q:"Si un documento desaparece justo antes de la revisión, ¿qué fenómeno ocurrió?",options:["Pérdida controlada","Migración espontánea de archivos","Actividad paranormal de oficina","Gestión documental cuántica"],ok:3},
  {cat:"Broma de proceso",q:"¿Qué aparece primero en un cierre complicado?",options:["La solución","Un café","La frase 'ya casi'","La trazabilidad perfecta"],ok:2},
  {cat:"Ciencia aplicada",q:"¿Qué tan rápido corre alguien cuando escucha 'auditoría sorpresa'?",options:["Más rápido que el Wi‑Fi","Depende del pendiente","A velocidad procedimiento","Lo suficiente para buscar evidencias"],ok:3},
  {cat:"Pregunta imposible",q:"¿Cuál es el principal depredador natural de un lapicero nuevo?",options:["La recepción","Las reuniones","El compañero que 'lo devuelve ahora'","La gravedad"],ok:2},
  {cat:"Humor corporativo",q:"¿Qué significa realmente 'te lo envío en cinco minutos'?",options:["Cinco minutos reales","Una unidad simbólica del universo","Una promesa auditable","Depende del tráfico de correos"],ok:1},
  {cat:"Electro‑leyenda",q:"Si una tarea no tiene responsable, ¿quién la hace?",options:["Todos","Nadie","El espíritu de mejora continua","El más optimista"],ok:1},
  {cat:"Alta complejidad",q:"¿Cuántas veces se puede decir 'ya casi' antes de que sea un indicador?",options:["3","7","12","Las suficientes para abrir una acción correctiva"],ok:3}
];

const state = {
  db:null,
  analyticsReady:false,
  firebaseReady:false,
  player:{name:"",area:""},
  selected:[],
  current:0,
  money:0,
  points:0,
  coins:0,
  correct:0,
  wrong:0,
  jokes:0,
  used:new Set(),
  doubleActive:false,
  doubleConsumed:false,
  currentJoke:null,
  hiddenOptions:new Set(),
  locked:false,
  timeLeft:90,
  timer:null,
  ranking:[],
  rankingAll:[],
  rankingFilter:"",
  usedJokes:new Set(),
  gifIndexes:{intro:0,correct:0,wrong:0,joke:0,win:0,neutral:0},
  soundIndexes:{correct:0,wrong:0},
  questionToken:0,
  lastAnswerAt:0,
  lastLifelineAt:0,
  mode:"single",
  tournament:{ id:null, teams:[], currentIndex:0, results:[] },
  lastSaved:false
};

const appEl = document.getElementById("app");

function fmt(n){ return new Intl.NumberFormat("es-CO").format(Number(n)||0); }
function sample(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function prepareQuestion(question){
  const entries = question.options.map((opt,i)=>({opt,isOk:i===question.ok}));
  const mixed = shuffle(entries);
  return {...question, options:mixed.map(x=>x.opt), ok:mixed.findIndex(x=>x.isOk)};
}
function nextGif(group){
  const list = GIFS[group] || GIFS.neutral;
  const idx = state.gifIndexes[group] % list.length;
  state.gifIndexes[group] += 1;
  return list[idx];
}
function nextDistinctPair(group){
  const first = nextGif(group);
  let second = nextGif(group);
  if(second === first){
    const list = GIFS[group] || GIFS.neutral;
    second = list[(list.indexOf(first) + 1) % list.length];
  }
  return [first, second];
}
function nextSound(type){
  const list = Array.isArray(SOUNDS[type]) ? SOUNDS[type] : [SOUNDS[type]];
  if(!list.length || !list[0]) return "";
  const idx = state.soundIndexes[type] % list.length;
  state.soundIndexes[type] += 1;
  return list[idx];
}
function currentQuestion(){ return state.currentJoke || state.selected[state.current]; }
function currentTeam(){ return state.tournament.teams[state.tournament.currentIndex] || null; }
function computePoints(){ return state.money + state.coins; }
function safeMoney(){
  let safe = 0;
  for(const idx of SAFE_INDEXES){ if(state.current > idx) safe = MONEY[idx]; }
  return safe;
}
function safeText(str){
  return String(str ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}
function toast(msg){
  const old = document.querySelector(".toast");
  if(old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}
function confetti(){
  for(let i=0;i<70;i++){
    const el=document.createElement("span");
    el.className="confetti";
    el.style.left=Math.random()*100+"vw";
    el.style.animationDelay=(Math.random()*.55)+"s";
    el.style.background=["#ffc857","#46d5ff","#58d68d","#ffffff","#ff7ab6"][i%5];
    el.style.transform=`rotate(${Math.random()*180}deg)`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2600);
  }
}

function playFx(type){
  const src = nextSound(type);
  if(!src) return;
  try{
    const audio = new Audio(src);
    audio.volume = type === "correct" ? .82 : .78;
    audio.play().catch(()=>{});
  }catch(err){
    console.warn("No se pudo reproducir el sonido.", err);
  }
}

function flashScreen(type){
  const old = document.querySelector(".screen-flash");
  if(old) old.remove();
  const el = document.createElement("div");
  el.className = `screen-flash ${type}`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),760);
}

function scoreBurst(text){
  const el = document.createElement("div");
  el.className = "score-burst";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}
function disableAnswerControls(){
  document.querySelectorAll(".option, .lifeline").forEach(el=>{ el.disabled = true; });
}
function enableRemainingAnswerControls(excludedIndex=null){
  document.querySelectorAll(".option").forEach((el,idx)=>{
    if(idx !== excludedIndex && !state.hiddenOptions.has(idx)) el.disabled = false;
  });
  document.querySelectorAll(".lifeline").forEach(el=>{ el.disabled = true; });
}
function makeTournamentId(){
  return `torneo-${Date.now()}-${Math.random().toString(16).slice(2,8)}`;
}

function addClickPulse(){
  document.addEventListener("pointermove", e=>{
    const el = e.target.closest("button, .card, .metric");
    if(!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
  document.addEventListener("click", e=>{
    const btn = e.target.closest("button");
    if(!btn || btn.disabled) return;
    btn.classList.remove("click-pop");
    void btn.offsetWidth;
    btn.classList.add("click-pop");
    setTimeout(()=>btn.classList.remove("click-pop"),260);
  });
}

async function initFirebase(){
  try{
    const app = initializeApp(firebaseConfig);
    state.db = getFirestore(app);
    try{
      if(await analyticsIsSupported()){
        getAnalytics(app);
        state.analyticsReady = true;
      }
    }catch(err){ console.warn("Analytics no disponible en este navegador.", err); }
    state.firebaseReady = true;
  }catch(err){
    console.warn("Firebase no inicializó. Se usará ranking local.", err);
    state.firebaseReady = false;
  }
}

function buildQuestionSet(){
  const chosen=[];
  for(let level=1; level<=13; level++){
    const pool = QUESTION_BANK.filter(q=>q.level===level);
    chosen.push(prepareQuestion(sample(pool)));
  }
  state.selected = chosen;
}

function renderLogin(){
  const [introGifA, introGifB] = nextDistinctPair("intro");
  appEl.innerHTML = `
    <section class="login screen-enter">
      <div class="login-card card">
        <div class="hero">
          <div class="hero-copy">
            <div class="brand-row">
              <img class="logo" src="${ASSETS.logo}" alt="Dream Team de Calidad y Mejoramiento Continuo" onerror="this.style.display='none'">
              <span class="badge gold">Actividad de integración</span>
            </div>
            <div class="eyebrow">Electroingeniería S.A.S.</div>
            <h1>Reto Millonario <span>Buena Energía</span></h1>
            <p class="lead">Hoy vamos a descubrir quién sabe de verdad, quién responde con seguridad sospechosa y quién está a una pregunta de pedir ayuda con toda la dignidad del mundo.</p>
            <div class="hero-metrics">
              <div class="metric"><strong>13</strong><span>niveles de premio</span></div>
              <div class="metric"><strong>5</strong><span>comodines especiales</span></div>
              <div class="metric"><strong>∞</strong><span>momentos épicos</span></div>
            </div>
            <div class="hero-stage hero-stage-two">
              <div class="sticker-card intro-card">
                <img class="hero-sticker hero-sticker-large" src="${introGifA}" alt="Animación institucional 1" loading="eager" onerror="this.src='${ASSETS.energy}'">
              </div>
              <div class="sticker-card intro-card">
                <img class="hero-sticker hero-sticker-large" src="${introGifB}" alt="Animación institucional 2" loading="eager" onerror="this.src='${ASSETS.document}'">
              </div>
            </div>
          </div>
        </div>
        <form class="form" id="loginForm">
          <span class="pill ${state.firebaseReady ? "ok" : "warn"}">${state.firebaseReady ? "☁️ Firestore conectado" : "💾 Modo local si Firestore bloquea reglas"}</span>
          <h2>Registrar participante</h2>
          <p>El nombre y el proceso se guardan únicamente para el ranking del juego.</p>
          <div class="field">
            <label for="playerName">Nombre del participante o equipo</label>
            <input id="playerName" maxlength="40" autocomplete="off" placeholder="Ej: Dream Team Logística" required>
          </div>
          <div class="field">
            <label for="playerArea">Proceso</label>
            <select id="playerArea" required>
              <option value="">Seleccionar proceso...</option>
              ${AREAS.map(a=>`<option value="${safeText(a)}">${safeText(a)}</option>`).join("")}
            </select>
          </div>
          <div class="actions vertical">
            <button class="btn primary" type="submit">Iniciar reto</button>
            <button class="btn ghost" type="button" id="rankingBtn">🏆 Ver ranking</button>
            <button class="btn ghost cache-btn" type="button" id="clearCacheBtn">🧹 Reiniciar ranking</button>
            <button class="btn tournament-btn" type="button" id="tournamentBtn">🎬 Modo torneo por equipos</button>
          </div>
          <div class="footer-note">Puntos seguros: $1.000 y $50.000. Las preguntas trampa no suman ni descuentan.</div>
        </form>
      </div>
    </section>`;
  document.getElementById("loginForm").addEventListener("submit", e=>{
    e.preventDefault();
    const name = document.getElementById("playerName").value.trim();
    const area = document.getElementById("playerArea").value.trim();
    if(!name || !area) return toast("Escribe nombre y proceso para iniciar.");
    state.mode = "single";
    state.tournament = { id:null, teams:[], currentIndex:0, results:[] };
    state.player = {name, area};
    startGame();
  });
  document.getElementById("rankingBtn").addEventListener("click", async()=>{ await loadRanking(); showRanking(); });
  document.getElementById("clearCacheBtn").addEventListener("click", clearRankingCacheWithCode);
  document.getElementById("tournamentBtn").addEventListener("click", showTournamentSetup);
}

function startGame(){
  buildQuestionSet();
  state.current=0; state.money=0; state.points=0; state.coins=0; state.correct=0; state.wrong=0; state.jokes=0;
  state.used=new Set(); state.doubleActive=false; state.doubleConsumed=false; state.currentJoke=null; state.hiddenOptions=new Set(); state.locked=false; state.usedJokes=new Set(); state.lastAnswerAt=0; state.lastLifelineAt=0; state.lastSaved=false;
  renderGame();
}

function renderGame(){
  clearInterval(state.timer);
  const q = currentQuestion();
  const token = ++state.questionToken;
  state.points = computePoints();
  appEl.innerHTML = `
    <section class="shell screen-enter">
      <div class="topbar">
        <div class="brand-row">
          <img class="logo-small" src="${ASSETS.logo}" alt="Electroingeniería" onerror="this.style.display='none'">
          <div>
            <strong>${safeText(state.player.name)}</strong><br>
            <span style="color:var(--muted);font-size:12px">Proceso: ${safeText(state.player.area)}</span>
          </div>
        </div>
        <div class="actions">
          <span class="pill ${state.firebaseReady ? "ok" : "warn"}">${state.firebaseReady ? "☁️ Ranking Firestore" : "💾 Ranking local"}</span>
          ${state.mode === "tournament" ? `<span class="pill gold">🎬 Equipo ${state.tournament.currentIndex+1}/${state.tournament.teams.length}</span>` : ""}
          <button class="btn ghost small" onclick="window.gameMillionaire.confirmExit()">Salir</button>
        </div>
      </div>
      <div class="game-layout">
        <div>
          <div class="status-grid">
            <div class="status"><span>Premio actual</span><strong>$${fmt(state.money)}</strong></div>
            <div class="status"><span>Puntos ranking</span><strong>${fmt(state.points)}</strong></div>
            <div class="status"><span>Monedas</span><strong>🪙 ${fmt(state.coins)}</strong></div>
            <div class="status"><span>Pregunta</span><strong>${state.currentJoke ? "Broma" : `${state.current+1}/13`}</strong></div>
          </div>
          <article class="stage card">
            <div class="question-head">
              <div>
                <span class="pill gold">${safeText(q.cat)}</span>
                ${state.currentJoke ? `<span class="pill warn">No vale puntos</span>` : `<span class="pill">Nivel ${state.current+1} · $${fmt(MONEY[state.current])}</span>`}
              </div>
              <span class="pill" id="timerText">⏱️ ${state.timeLeft}s</span>
            </div>
            <h2 class="question-text">${safeText(q.q)}</h2>
            <div class="timer-wrap"><div id="timerBar" class="timer-bar"></div></div>
            <div class="options">
              ${q.options.map((op,i)=>`
                <button id="option-${i}" class="option ${state.hiddenOptions.has(i)?"hidden-option":""}" style="animation-delay:${i*95}ms" onclick="window.gameMillionaire.answer(${i}, ${token})" ${state.hiddenOptions.has(i)?"disabled":""}>
                  <span class="letter">${LETTERS[i]}</span><span>${safeText(op)}</span>
                </button>`).join("")}
            </div>
            <div class="lifelines">
              <button class="lifeline ${state.used.has("fifty")?"used":""}" onclick="window.gameMillionaire.useLifeline('fifty')" ${state.currentJoke||state.used.has("fifty")?"disabled":""}>50:50</button>
              <button class="lifeline ${state.used.has("audience")?"used":""}" onclick="window.gameMillionaire.useLifeline('audience')" ${state.currentJoke||state.used.has("audience")?"disabled":""}>Tribuna</button>
              <button class="lifeline ${state.used.has("boss")?"used":""}" onclick="window.gameMillionaire.useLifeline('boss')" ${state.currentJoke||state.used.has("boss")?"disabled":""}>Jefe</button>
              <button class="lifeline ${state.used.has("switch")?"used":""}" onclick="window.gameMillionaire.useLifeline('switch')" ${state.currentJoke||state.used.has("switch")?"disabled":""}>Proceso</button>
              <button class="lifeline ${state.used.has("double")?"used":""}" onclick="window.gameMillionaire.useLifeline('double')" ${state.currentJoke||state.used.has("double")?"disabled":""}>Doble</button>
            </div>
          </article>
        </div>
        <aside class="side">
          <section class="ladder card">
            <div class="panel-title"><h3>Escalera</h3><span class="pill">⭐ seguro</span></div>
            <div class="ladder-list">
              ${MONEY.map((m,i)=>`<div class="money-row ${i===state.current&&!state.currentJoke?"current":""} ${SAFE_INDEXES.includes(i)?"safe":""} ${i<state.current?"passed":""}"><span>${i+1}</span><strong>${SAFE_INDEXES.includes(i)?"⭐ ":""}$${fmt(m)}</strong></div>`).join("")}
            </div>
          </section>
          <section class="ranking-mini card">
            <div class="panel-title"><h3>Top ranking</h3><button class="btn small ghost" onclick="window.gameMillionaire.loadRankingAndShow()">Ver</button></div>
            <div id="rankingMini">Cargando ranking...</div>
          </section>
        </aside>
      </div>
    </section>`;
  startTimer();
  loadRanking().then(()=>renderMiniRanking()).catch(()=>{});
}

function startTimer(){
  state.timeLeft = state.currentJoke ? 32 : Math.max(20, 75 - state.current*4);
  const total = state.timeLeft;
  const timerText = document.getElementById("timerText");
  const timerBar = document.getElementById("timerBar");
  clearInterval(state.timer);
  state.timer = setInterval(()=>{
    state.timeLeft -= 1;
    if(timerText) timerText.textContent = `⏱️ ${state.timeLeft}s`;
    if(timerBar) timerBar.style.width = `${Math.max(0,(state.timeLeft/total)*100)}%`;
    if(state.timeLeft<=0){ clearInterval(state.timer); timeoutQuestion(); }
  },1000);
}

function timeoutQuestion(){
  if(state.locked) return;
  if(state.currentJoke){ resolveJoke(-1); return; }
  state.locked = true;
  playFx("wrong");
  flashScreen("wrong");
  state.wrong++;
  finishGame(false, "Se acabó el tiempo", "La solicitud quedó vencida. El reloj no perdona, pero el ranking sí guarda la valentía.");
}

function answer(index, token){
  if(token !== state.questionToken) return;
  const now = Date.now();
  if(state.locked || now - state.lastAnswerAt < 650) return;
  state.lastAnswerAt = now;
  const q = currentQuestion();
  if(state.currentJoke){ disableAnswerControls(); resolveJoke(index); return; }
  state.locked = true;
  disableAnswerControls();
  clearInterval(state.timer);
  const correct = index === q.ok;
  const btn = document.getElementById(`option-${index}`);
  const okBtn = document.getElementById(`option-${q.ok}`);
  if(correct){
    playFx("correct");
    flashScreen("correct");
    if(btn) btn.classList.add("correct");
    state.correct++;
    state.money = MONEY[state.current];
    state.coins += Math.max(10, Math.round(state.timeLeft/2)) + (state.current+1)*8;
    state.points = computePoints();
    confetti();
    scoreBurst(`+$${fmt(state.money)} · +${fmt(state.coins)} monedas`);
    setTimeout(()=>{
      if(state.current >= MONEY.length-1){
        finishGame(true, "¡Ganaste el millón!", "Electroingeniería confirma: esta ronda tuvo buena energía, evidencia y criterio de mejora continua.");
      }else{
        modal("Respuesta correcta", `<p>${sample(funnyCorrect)}</p><p>Sumas <strong>$${fmt(state.money)}</strong> y quedas con <strong>${fmt(state.points)} puntos</strong>.</p>`, nextGif("correct"), [
          {label:"Continuar",class:"primary",action:()=>{ closeModal(); nextQuestion(); }}
        ]);
      }
    },650);
  }else{
    playFx("wrong");
    flashScreen("wrong");
    if(btn) btn.classList.add("wrong");
    if(state.doubleActive && !state.doubleConsumed){
      state.doubleConsumed=true;
      state.doubleActive=false;
      toast("Doble oportunidad activada: esa no era, pero todavía puedes salvar la ronda.");
      setTimeout(()=>{
        state.locked=false;
        enableRemainingAnswerControls(index);
      }, 520);
      return;
    }
    if(okBtn) okBtn.classList.add("correct");
    state.wrong++;
    const guaranteed = safeMoney();
    state.money = guaranteed;
    state.points = computePoints();
    setTimeout(()=>{
      finishGame(false, "Respuesta incorrecta", `${sample(funnyWrong)} La respuesta correcta era <strong>${LETTERS[q.ok]}</strong>. Te vas con el punto seguro de <strong>$${fmt(guaranteed)}</strong>.`);
    },800);
  }
}

function nextQuestion(){
  state.current++;
  state.currentJoke=null;
  state.hiddenOptions=new Set();
  state.doubleConsumed=false;
  state.locked=false;
  if(state.current > 0 && state.current < 13 && Math.random() < .26){
    launchJokeQuestion();
  }else{
    renderGame();
  }
}

function launchJokeQuestion(){
  const available = JOKE_BANK.map((q,i)=>({q,i})).filter(item=>!state.usedJokes.has(item.i));
  if(!available.length){
    state.currentJoke = null;
    state.hiddenOptions=new Set();
    state.locked=false;
    renderGame();
    return;
  }
  const picked = sample(available);
  state.usedJokes.add(picked.i);
  state.currentJoke = prepareQuestion(picked.q);
  state.hiddenOptions=new Set();
  state.locked=false;
  renderGame();
}
function resolveJoke(index){
  state.locked=true;
  clearInterval(state.timer);
  state.jokes++;
  if(index>=0){
    const btn = document.getElementById(`option-${index}`);
    if(btn) btn.classList.add("correct");
  }
  modal("Era una broma", `<p>${sample(jokeMessages)}</p><p>No suma, no descuenta, pero desbloquea risa corporativa.</p>`, nextGif("joke"), [
    {label:"Seguir jugando",class:"primary",action:()=>{ closeModal(); state.currentJoke=null; state.locked=false; renderGame(); }}
  ]);
}

function useLifeline(type){
  const now = Date.now();
  if(state.used.has(type) || state.currentJoke || state.locked || now - state.lastLifelineAt < 450) return;
  state.lastLifelineAt = now;
  const q = currentQuestion();
  state.used.add(type);
  if(type === "fifty"){
    const wrongs = [0,1,2,3].filter(i=>i!==q.ok);
    state.hiddenOptions = new Set(shuffle(wrongs).slice(0,2));
    toast("50:50 aplicado. Dos opciones se fueron a archivo muerto.");
    renderGame();
  }
  if(type === "audience"){
    const votes = makeAudienceVotes(q.ok);
    const html = `<p>La tribuna votó así. Ojo: la tribuna a veces viene con confianza de cierre de mes.</p><div class="audience">${votes.map((v,i)=>`<div class="aud-row"><strong>${LETTERS[i]}</strong><div class="aud-track"><div class="aud-fill" style="width:${v}%"></div></div><span>${v}%</span></div>`).join("")}</div>`;
    modal("Comodín de la tribuna", html, nextGif("neutral"), [{label:"Usar pista",class:"primary",action:closeModal}]);
  }
  if(type === "boss"){
    modal("Llamada al jefe", `<p><strong>Pista:</strong> ${safeText(q.hint || "Revisa cuál opción deja mejor evidencia y control del proceso.")}</p>`, nextGif("neutral"), [{label:"Entendido",class:"primary",action:closeModal}]);
  }
  if(type === "switch"){
    const pool = QUESTION_BANK.filter(item=>item.level===state.current+1 && item.q!==q.q);
    if(pool.length){ state.selected[state.current] = prepareQuestion(sample(pool)); state.hiddenOptions = new Set(); toast("Pregunta cambiada por consulta al proceso."); renderGame(); }
    else toast("No hay otra pregunta disponible para este nivel.");
  }
  if(type === "double"){
    state.doubleActive=true;
    toast("Doble oportunidad activada: si fallas, puedes intentar una vez más.");
    renderGame();
  }
}

function makeAudienceVotes(ok){
  const base = [8,12,14,10];
  base[ok] = 56 + Math.floor(Math.random()*18);
  let rest = 100 - base[ok];
  const indexes = [0,1,2,3].filter(i=>i!==ok);
  indexes.forEach((idx,pos)=>{
    if(pos === indexes.length-1) base[idx]=rest;
    else { const val = Math.floor(Math.random()*(rest/2))+5; base[idx]=val; rest-=val; }
  });
  return base;
}

async function finishGame(won, title, msg){
  state.locked=true;
  clearInterval(state.timer);
  state.points=computePoints();
  await saveScore();
  const img = won ? nextGif("win") : nextGif("wrong");
  const tournamentBlock = state.mode === "tournament" ? tournamentHtml() : "";
  const buttons = state.mode === "tournament"
    ? (
      state.tournament.currentIndex < state.tournament.teams.length - 1
        ? [
            {label:"Siguiente equipo",class:"primary",action:()=>{ closeModal(); nextTournamentTurn(); }},
            {label:"Ver tabla del torneo",class:"ghost",action:()=>{ closeModal(); showTournamentTable(); }}
          ]
        : [
            {label:"Ver campeón",class:"primary",action:()=>{ closeModal(); showTournamentTable(true); }},
            {label:"Nuevo torneo",class:"ghost",action:()=>{ closeModal(); showTournamentSetup(); }}
          ]
    )
    : [
        {label:"Jugar otra vez",class:"primary",action:()=>{ closeModal(); startGame(); }},
        {label:"Volver al inicio",class:"ghost",action:()=>{ closeModal(); renderLogin(); }}
      ];
  modal(title, `<p>${msg}</p><p><strong>Puntos finales:</strong> ${fmt(state.points)} · <strong>Monedas:</strong> ${fmt(state.coins)}</p>${tournamentBlock}${rankingHtml()}`, img, buttons, true);
}

async function saveScore(){
  if(state.lastSaved) return;
  state.lastSaved=true;
  const record = {
    game:"quien_quiere_ser_millonario_electro",
    player:state.player.name.slice(0,40),
    area:state.player.area.slice(0,60),
    points:Number(state.points)||0,
    money:Number(state.money)||0,
    coins:Number(state.coins)||0,
    level:Math.min(13, state.current+1),
    correct:state.correct,
    wrong:state.wrong,
    jokes:state.jokes,
    lifelinesUsed:[...state.used]
  };
  if(state.mode === "tournament"){
    state.tournament.results[state.tournament.currentIndex] = {...record, teamOrder:state.tournament.currentIndex+1};
    localStorage.setItem("electro_millonario_tournament_last", JSON.stringify({
      id:state.tournament.id,
      teams:state.tournament.teams,
      results:state.tournament.results,
      updatedAt:new Date().toISOString()
    }));
  }
  const local = JSON.parse(localStorage.getItem("electro_millonario_rankings") || "[]");
  local.push({...record, createdAtLocal:new Date().toISOString()});
  localStorage.setItem("electro_millonario_rankings", JSON.stringify(local.slice(-120)));
  if(state.firebaseReady && state.db){
    try{
      await addDoc(collection(state.db,"rankings"), {...record, createdAt:serverTimestamp()});
    }catch(err){
      console.warn("No se pudo guardar en Firestore. Revisa reglas.", err);
      toast("No se pudo guardar en Firestore; quedó guardado localmente.");
    }
  }
  await loadRanking();
}

async function loadRanking(){
  let list=[];
  if(state.firebaseReady && state.db){
    try{
      const q = query(collection(state.db,"rankings"), orderBy("points","desc"), limit(200));
      const snap = await getDocs(q);
      list = snap.docs.map(d=>d.data()).sort((a,b)=>(b.points-a.points)||(b.coins-a.coins));
    }catch(err){ console.warn("No se pudo leer ranking Firestore.", err); }
  }
  if(!list.length){
    list = JSON.parse(localStorage.getItem("electro_millonario_rankings") || "[]")
      .sort((a,b)=>(b.points-a.points)||(b.coins-a.coins));
  }
  state.rankingAll=list;
  const filtered = state.rankingFilter ? list.filter(r => (r.area || "") === state.rankingFilter) : list;
  state.ranking=filtered.slice(0,10);
  return state.ranking;
}

function rankingHtml(){
  const title = state.rankingFilter ? `Ranking · ${safeText(state.rankingFilter)}` : "Ranking general";
  const filter = `<div class="ranking-filter-row"><label>Filtrar por proceso</label><select class="ranking-filter" onchange="window.gameMillionaire.setRankingFilter(this.value)"><option value="">Todos los procesos</option>${AREAS.map(a=>`<option value="${safeText(a)}" ${state.rankingFilter===a?"selected":""}>${safeText(a)}</option>`).join("")}</select><button class="btn small ghost cache-inline-btn" type="button" onclick="window.gameMillionaire.clearRankingCacheWithCode()">🧹 Borrar caché local</button></div>`;
  const rows = state.ranking.length ? state.ranking.map((r,i)=>`
    <div class="rank-row">
      <div class="rank-pos">${i+1}</div>
      <div><div class="rank-name">${safeText(r.player||"Participante")}</div><div class="rank-area">${safeText(r.area||"Proceso")}</div></div>
      <div class="rank-score">${fmt(r.points)} pts<br><span style="font-size:11px;color:var(--muted)">$${fmt(r.money||0)}</span></div>
    </div>`).join("") : `<p>Aún no hay puntajes para este filtro. El primer valiente se lleva la gloria.</p>`;
  return `<div class="ranking-mini" style="padding:0"><div class="panel-title"><h3>${title}</h3><span class="pill gold">Top 10</span></div>${filter}${rows}</div>`;
}

function renderMiniRanking(){
  const el = document.getElementById("rankingMini");
  if(!el) return;
  const miniList = (state.rankingAll.length ? state.rankingAll : state.ranking).slice(0,5);
  if(!miniList.length){ el.innerHTML = `<p class="footer-note">Aún no hay puntajes guardados.</p>`; return; }
  el.innerHTML = miniList.map((r,i)=>`
    <div class="rank-row">
      <div class="rank-pos">${i+1}</div>
      <div><div class="rank-name">${safeText(r.player||"Jugador")}</div><div class="rank-area">${safeText(r.area||"")}</div></div>
      <div class="rank-score">${fmt(r.points)}</div>
    </div>`).join("");
}
async function setRankingFilter(area){
  state.rankingFilter = area || "";
  await loadRanking();
  showRanking();
}
async function showRanking(){
  await loadRanking();
  modal("Ranking del reto", rankingHtml(), nextGif("win"), [{label:"Cerrar",class:"primary",action:closeModal}], true);
}
async function loadRankingAndShow(){ await showRanking(); }

function areaOptions(selected=""){
  return AREAS.map(a=>`<option value="${safeText(a)}" ${selected===a?"selected":""}>${safeText(a)}</option>`).join("");
}
function showTournamentSetup(){
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="modal card tournament-modal" style="width:min(980px,100%)">
      <div class="panel-title"><div><h2>Modo torneo por equipos</h2><p>Registra de 2 a 8 equipos. Cada equipo juega su turno completo y al final queda tabla general del torneo.</p></div><span class="pill gold">🎬 por turnos</span></div>
      <form id="tournamentForm" class="tournament-form">
        <div class="team-setup-grid">
          ${Array.from({length:8}).map((_,i)=>`
            <div class="team-setup-row">
              <strong>${i+1}</strong>
              <input maxlength="40" name="teamName${i}" placeholder="Equipo ${i+1}${i<2?' obligatorio':''}" ${i<2?'required':''}>
              <select name="teamArea${i}"><option value="">Proceso...</option>${areaOptions()}</select>
            </div>`).join("")}
        </div>
        <div class="modal-actions">
          <button class="btn primary" type="submit">Iniciar torneo</button>
          <button class="btn ghost" type="button" id="cancelTournamentBtn">Cancelar</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById("cancelTournamentBtn").addEventListener("click", closeModal);
  document.getElementById("tournamentForm").addEventListener("submit", e=>{
    e.preventDefault();
    const teams=[];
    for(let i=0;i<8;i++){
      const name = e.target[`teamName${i}`].value.trim();
      const area = e.target[`teamArea${i}`].value.trim() || "Otro proceso";
      if(name) teams.push({name, area});
    }
    if(teams.length < 2) return toast("Registra mínimo 2 equipos para iniciar el torneo.");
    state.mode = "tournament";
    state.tournament = { id:makeTournamentId(), teams, currentIndex:0, results:[] };
    state.player = { name:teams[0].name, area:teams[0].area };
    closeModal();
    toast(`Arranca el equipo 1: ${teams[0].name}`);
    startGame();
  });
}
function nextTournamentTurn(){
  if(state.mode !== "tournament") return renderLogin();
  state.tournament.currentIndex++;
  const team = currentTeam();
  if(!team) return showTournamentTable(true);
  state.player = { name:team.name, area:team.area };
  toast(`Turno del equipo ${state.tournament.currentIndex+1}: ${team.name}`);
  startGame();
}
function tournamentHtml(){
  if(state.mode !== "tournament") return "";
  const rows = tournamentRowsHtml();
  return `<div class="tournament-table"><div class="panel-title"><h3>Tabla del torneo</h3><span class="pill gold">${state.tournament.results.filter(Boolean).length}/${state.tournament.teams.length} equipos</span></div>${rows}</div>`;
}
function tournamentRowsHtml(){
  const results = state.tournament.teams.map((team,i)=>({
    team,
    order:i+1,
    result:state.tournament.results[i] || null
  })).sort((a,b)=>((b.result?.points||-1)-(a.result?.points||-1)) || ((b.result?.coins||0)-(a.result?.coins||0)) || (a.order-b.order));
  return results.map((row,idx)=>`
    <div class="rank-row tournament-row ${row.result?'':'pending'}">
      <div class="rank-pos">${row.result ? idx+1 : '—'}</div>
      <div><div class="rank-name">${safeText(row.team.name)}</div><div class="rank-area">${safeText(row.team.area)} · Turno ${row.order}${row.result?'':' · pendiente'}</div></div>
      <div class="rank-score">${row.result ? `${fmt(row.result.points)} pts<br><span style="font-size:11px;color:var(--muted)">$${fmt(row.result.money||0)} · 🪙 ${fmt(row.result.coins||0)}</span>` : 'Pendiente'}</div>
    </div>`).join("");
}
function showTournamentTable(final=false){
  if(state.mode !== "tournament") return showRanking();
  const done = state.tournament.results.filter(Boolean).length;
  const champ = [...state.tournament.results].filter(Boolean).sort((a,b)=>(b.points-a.points)||(b.coins-a.coins))[0];
  const title = final && champ ? `Campeón: ${safeText(champ.player)}` : "Tabla general del torneo";
  const text = final && champ
    ? `<p>El torneo terminó. El equipo campeón dejó evidencia de conocimiento, reflejos y buena energía.</p>`
    : `<p>Van <strong>${done}</strong> de <strong>${state.tournament.teams.length}</strong> equipos jugados.</p>`;
  const buttons = final || done >= state.tournament.teams.length
    ? [
        {label:"Nuevo torneo",class:"primary",action:()=>{ closeModal(); showTournamentSetup(); }},
        {label:"Volver al inicio",class:"ghost",action:()=>{ closeModal(); state.mode="single"; state.tournament={id:null,teams:[],currentIndex:0,results:[]}; renderLogin(); }}
      ]
    : [
        {label:"Continuar torneo",class:"primary",action:()=>{ closeModal(); nextTournamentTurn(); }},
        {label:"Cerrar",class:"ghost",action:closeModal}
      ];
  modal(title, `${text}${tournamentHtml()}`, nextGif("win"), buttons, true);
}

function modal(title, html, img, buttons=[], wide=false){
  closeModal();
  const overlay = document.createElement("div");
  overlay.className="overlay";
  overlay.innerHTML = `
    <div class="modal card" style="${wide?"width:min(860px,100%)":""}">
      <div class="modal-body">
        <img src="${img}" alt="Animación" onerror="this.style.display='none'">
        <div>
          <h2>${safeText(title)}</h2>
          <div>${html}</div>
          <div class="modal-actions"></div>
        </div>
      </div>
    </div>`;
  const actions = overlay.querySelector(".modal-actions");
  buttons.forEach(b=>{
    const btn=document.createElement("button");
    btn.className=`btn ${b.class||"ghost"}`;
    btn.textContent=b.label;
    btn.addEventListener("click",b.action);
    actions.appendChild(btn);
  });
  document.body.appendChild(overlay);
}
function closeModal(){ const el=document.querySelector(".overlay"); if(el) el.remove(); }
async function clearRankingCacheWithCode(){
  const code = prompt("Código para reiniciar el ranking completo:");
  if(code === null) return;
  if(code !== CACHE_ADMIN_CODE){
    toast("Código incorrecto. El ranking no se reinició.");
    return;
  }

  const confirmReset = confirm("Esto reiniciará el ranking visible y eliminará los puntajes guardados en Firestore. ¿Deseas continuar?");
  if(!confirmReset) return;

  try{
    // 1) Limpieza local del navegador
    localStorage.removeItem("electro_millonario_rankings");
    localStorage.removeItem("electro_millonario_tournament_last");

    // 2) Limpieza real en Firestore
    let deleted = 0;
    if(state.firebaseReady && state.db){
      const snapshot = await getDocs(collection(state.db, "rankings"));
      let batch = writeBatch(state.db);
      let count = 0;

      for(const docSnap of snapshot.docs){
        batch.delete(docSnap.ref);
        count++;
        deleted++;

        // Firestore permite máximo 500 operaciones por batch.
        // Dejamos margen con 450 para evitar errores si luego se agregan operaciones.
        if(count >= 450){
          await batch.commit();
          batch = writeBatch(state.db);
          count = 0;
        }
      }

      if(count > 0){
        await batch.commit();
      }
    }

    state.ranking = [];
    state.rankingAll = [];
    state.rankingFilter = "";
    state.tournament = {id:null, teams:[], currentIndex:0, results:[]};

    if("caches" in window){
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(name=>name.includes("millonario") || name.includes("electro"))
          .map(name=>caches.delete(name))
      );
    }

    await loadRanking();
    renderMiniRanking();
    toast(`Ranking reiniciado correctamente. Registros eliminados: ${deleted}.`);
  }catch(err){
    console.warn("No se pudo reiniciar el ranking.", err);
    toast("No se pudo reiniciar el ranking. Revisa que hayas publicado las Firestore Rules nuevas.");
  }
}

function confirmExit(){
  modal("Salir del reto", `<p>Si sales ahora, el puntaje de esta ronda no se guardará como partida final. Puedes volver al inicio y registrar otro participante.</p>`, nextGif("neutral"), [
    {label:"Cancelar",class:"ghost",action:closeModal},
    {label:"Salir",class:"danger",action:()=>{ closeModal(); clearInterval(state.timer); state.mode="single"; state.tournament={id:null,teams:[],currentIndex:0,results:[]}; renderLogin(); }}
  ]);
}

window.gameMillionaire = { answer, useLifeline, confirmExit, loadRankingAndShow, setRankingFilter, showTournamentSetup, clearRankingCacheWithCode };
addClickPulse();

await initFirebase();
await loadRanking();
renderLogin();
