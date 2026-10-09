import { ArrowUpRight, ArrowRight, BookOpenCheck, ShieldCheck, CarFront, Bike, TrafficCone, Route, Target, RotateCcw, Check, Clock3 } from 'lucide-react';
import questions from './data/questions.json';
import { levels, lessons } from './LearningPath';

const subjects = [
  { id:'senales', name:'Leé el camino', topic:'Señales de tránsito', description:'Reconocé señales, semáforos y marcas antes de tomar una decisión.', Icon:TrafficCone },
  { id:'ley-431', name:'Conocé las reglas', topic:'Normativa vial', description:'Estudiá prioridades, velocidades, licencias y reglas de circulación.', Icon:BookOpenCheck },
  { id:'manejo-defensivo', name:'Anticipá los riesgos', topic:'Manejo defensivo', description:'Preparáte para cruces, curvas, lluvia y situaciones imprevistas.', Icon:ShieldCheck },
  { id:'mecanica', name:'Entendé tu vehículo', topic:'Mecánica básica', description:'Aprendé a revisar frenos, llantas y los indicadores del tablero.', Icon:CarFront },
  { id:'motos', name:'Rodá con seguridad', topic:'Motocicletas', description:'Reforzá postura, frenado, equilibrio y circulación en motocicleta.', Icon:Bike },
];
const guideLinks = [['intersecciones','Intersecciones'],['prioridad','Prioridad de paso'],['giros','Giros y maniobras'],['senales','Señales y marcas'],['puntos-ciegos','Puntos ciegos'],['estacionamiento','Estacionamiento'],['distancia','Distancia de seguridad']];

function RoundaboutArt() {
  return <svg viewBox="0 0 480 360" role="img" aria-label="Ilustración de una rotonda; representación esquemática">
    <rect width="480" height="360" rx="24" fill="#cbd8be"/>
    <path d="M0 180H480M240 0V360" stroke="#f5f2e7" strokeWidth="96"/>
    <path d="M0 180H480M240 0V360" stroke="#536259" strokeWidth="72"/>
    <circle cx="240" cy="180" r="124" fill="#f5f2e7"/><circle cx="240" cy="180" r="112" fill="#536259"/>
    <circle cx="240" cy="180" r="75" fill="none" stroke="#f8f7ed" strokeWidth="2" strokeDasharray="10 9"/>
    <circle cx="240" cy="180" r="45" fill="#cbd8be" stroke="#f5f2e7" strokeWidth="10"/>
    <path d="M258 340V301C258 266 329 250 333 185C337 129 303 85 251 83" fill="none" stroke="#edbd55" strokeWidth="8" strokeLinecap="round"/>
    <path d="M0 180H104M375 180H480M240 0V57M240 304V360" stroke="#fff" strokeWidth="2" strokeDasharray="9 9"/>
    <g transform="translate(245 288)"><rect width="25" height="46" rx="7" fill="#fbfbf3"/><rect x="4" y="8" width="17" height="12" rx="2" fill="#263f39"/></g>
    <circle cx="50" cy="51" r="19" fill="#8da57e"/><circle cx="427" cy="300" r="27" fill="#8da57e"/>
  </svg>;
}

export default function HomePage({ setView, startPractice, progress, canInstall, installed, onInstall }) {
  const mastered = Object.keys(progress.mastered || {}).length;
  const mistakes = Object.keys(progress.mistakes || {}).length;
  const go = (next) => {
    setView(next);
    const hash = next === 'learning' ? '#ruta' : next === 'guides' ? '#guias' : next.startsWith('guide-') ? '#guia-'+next.slice(6) : '#'+next;
    window.history.replaceState(null,'',hash);
    window.scrollTo({top:0});
  };
  return <div className="new-home">
    <section className="drive-hero">
      <div className="drive-hero-copy">
        <span className="drive-kicker"><span/> EDUCACIÓN VIAL · NICARAGUA</span>
        <h1>Un buen camino<br/>empieza con<br/><em>vos.</em></h1>
        <p>De tus primeras señales a decisiones más seguras. Aprendé, practicá y preparáte para tu prueba de manejo, a tu ritmo.</p>
        <div className="drive-actions"><button className="button primary" onClick={()=>go('learning')}>{mastered ? 'Continuar mi ruta' : 'Empezar desde cero'}<ArrowUpRight size={19}/></button><button className="drive-text-link" onClick={()=>go('practice')}>Ir a practicar<ArrowRight size={18}/></button></div>
        <div className="drive-hero-note"><Check size={16}/> Sin registro <span/> Tu avance se guarda en este dispositivo</div>
      </div>
      <div className="drive-hero-visual">
        <img src={`${import.meta.env.BASE_URL}images/learning-drive.jpg`} width="1774" height="887" alt="Escena ilustrativa de una conductora con cinturón durante una lección" fetchPriority="high"/>
        <span className="drive-photo-label"><ShieldCheck size={16}/> APRENDÉ PARA LA VIDA</span>
        <div className="drive-goal"><div><span>TU PRÓXIMA META</span><strong>Prepararte con confianza.</strong><small>25 preguntas · 30 minutos · mínimo 80 puntos</small></div><button onClick={()=>go('exam')} aria-label="Ir a la prueba"><ArrowUpRight/></button></div>
      </div>
    </section>

    <section className="drive-stats" aria-label="Contenido disponible">{[[questions.length,'preguntas para practicar'],[lessons.length,'etapas en tu ruta'],['7','guías visuales'],['12','rotondas de Managua']].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>

    <section className="drive-section">
      <div className="drive-section-heading"><div><span className="drive-kicker">UNA RUTA PARA CADA ETAPA</span><h2>Desde cero.<br/>Hasta sentirte preparado.</h2></div><p>Avanzá paso a paso. Volvé a una lección cuando lo necesités y reforzá las preguntas que te cuestan más.</p></div>
      <div className="drive-levels">{levels.map((level,i)=><button className="drive-level" key={level.id} onClick={()=>go('learning')}><span className="drive-level-top"><span>0{i+1}</span><ArrowUpRight size={22}/></span><h3>{level.name}</h3><p>{level.description}</p><span className="drive-level-bottom">{lessons.filter(l=>l.level===level.id).length} etapas <span>Explorar ruta</span></span></button>)}</div>
      {mastered>0 && <div className="drive-personal"><Check size={20}/><p>Ya dominás <strong>{mastered} preguntas</strong>. Tu próximo paso está en la ruta.</p><button className="drive-text-link" onClick={()=>go('progress')}>Ver mi progreso<ArrowRight size={18}/></button></div>}
    </section>

    <section className="drive-section drive-modules-section">
      <div className="drive-section-heading"><div><span className="drive-kicker">CONOCIMIENTO QUE TE ACOMPAÑA</span><h2>Prepará cada parte<br/>de tu recorrido.</h2></div><button className="drive-text-link" onClick={()=>go('practice')}>Todos los módulos<ArrowUpRight size={20}/></button></div>
      <div className="drive-modules">{subjects.map(({id,name,topic,description,Icon},i)=>{const count=questions.filter(q=>q.module===id).length;const errors=questions.filter(q=>q.module===id&&progress.mistakes?.[q.id]).length;return <article className="drive-module" key={id}><div className={'drive-module-art tone-'+i}><Icon strokeWidth={1.2}/><span>{String(i+1).padStart(2,'0')}</span></div><div className="drive-module-body"><span className="drive-kicker">{topic}</span><h3>{name}</h3><p>{description}</p><div className="drive-module-bottom"><span>{count} preguntas</span><button onClick={()=>startPractice(id)} aria-label={`Practicar ${topic}`}><ArrowUpRight size={22}/></button></div>{errors>0&&<button className="drive-review" onClick={()=>startPractice(id,true,true)}><RotateCcw size={16}/> Reforzar {errors} preguntas</button>}</div></article>})}<article className="drive-module drive-module-callout"><Route size={40}/><h3>Hacé del aprendizaje<br/>un hábito.</h3><p>Una lección a la vez. Un poco más de confianza en cada paso.</p><button className="button primary" onClick={()=>go('learning')}>Seguir mi ruta<ArrowUpRight size={18}/></button>{mistakes>0&&<button className="drive-review" onClick={()=>startPractice('mistakes')}><RotateCcw size={16}/> Repasar mis errores</button>}</article></div>
    </section>

    <section className="drive-visual-section">
      <div className="drive-roundabout-art"><RoundaboutArt/><span>OBSERVÁ · COMPRENDÉ · APLICÁ</span></div>
      <div className="drive-visual-copy"><span className="drive-kicker">APRENDÉ A VER EL CAMINO</span><h2>Las maniobras,<br/>mucho más claras.</h2><p>Recorridos, señales y situaciones explicadas con diagramas. Descubrí también ejemplos de rotondas de Managua sobre capturas reales del mapa.</p><button className="button primary" onClick={()=>go('roundabouts')}>Explorar rotondas<ArrowUpRight size={18}/></button><div className="drive-guide-links">{guideLinks.map(([id,label])=><button key={id} onClick={()=>go('guide-'+id)}>{label}<ArrowUpRight size={15}/></button>)}</div></div>
    </section>

    <section className="drive-section">
      <div className="drive-section-heading"><div><span className="drive-kicker">TU MÉTODO DE APRENDIZAJE</span><h2>Pequeños pasos.<br/>Decisiones más seguras.</h2></div></div>
      <div className="drive-method">{[[BookOpenCheck,'01','Comprendé','Estudiá las reglas y apoyáte en las guías visuales.'],[RotateCcw,'02','Practicá y reforzá','Recibí corrección inmediata y volvé a tus preguntas incorrectas.'],[Target,'03','Poné a prueba lo aprendido','Completá una prueba y revisá tus resultados al finalizar.']].map(([Icon,n,title,text])=><div key={n}><div><Icon size={26}/><span>{n}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div>
    </section>

    <section className="drive-exam"><div><span className="drive-kicker">TU SIGUIENTE DESAFÍO</span><h2>¿Listo para la prueba?</h2><p>Medí lo que aprendiste y descubrí qué podés mejorar.</p></div><div><div className="drive-exam-rules"><span><Target size={18}/>25 preguntas</span><span><Clock3 size={18}/>30 minutos</span><span><ShieldCheck size={18}/>80 puntos para aprobar</span></div><button className="button primary" onClick={()=>go('exam')}>Comenzar prueba<ArrowUpRight size={18}/></button></div></section>

    <section className="drive-section drive-faq"><div><span className="drive-kicker">ANTES DE EMPEZAR</span><h2>Tu aprendizaje,<br/>sin complicaciones.</h2></div><div className="drive-faq-list"><details><summary>¿Necesito crear una cuenta?</summary><p>No. Tu progreso se guarda en este navegador o en la app instalada en el mismo dispositivo. No se sincroniza entre dispositivos y puede perderse si borrás los datos del sitio.</p></details><details><summary>¿Puedo usarlo como una app?</summary><p>En Android, abrí el sitio en Chrome y buscá la opción de instalar o agregar a la pantalla de inicio. La app usa el mismo contenido de la web.</p>{canInstall&&<button className="button secondary" onClick={onInstall}>Instalar app<ArrowUpRight size={18}/></button>}{installed&&<p>La app ya está instalada en este dispositivo.</p>}</details><details><summary>¿Cómo funciona la puntuación?</summary><p>Son 25 preguntas. Cada respuesta correcta vale 4 puntos. Para aprobar necesitás al menos 80 puntos, es decir, 20 respuestas correctas.</p></details><details><summary>¿Este material sustituye una escuela de manejo?</summary><p>Es una herramienta educativa de apoyo para estudiar y practicar teoría. La formación práctica y las indicaciones oficiales de la Policía Nacional siguen siendo esenciales.</p></details></div></section>
    <div className="drive-closing"><span>El próximo paso lo das vos.</span><button className="drive-text-link" onClick={()=>go('learning')}>Empezar mi ruta<ArrowUpRight size={22}/></button></div>
  </div>;
}
