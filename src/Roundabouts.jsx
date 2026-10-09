import { useId } from 'react';
import { RotateCcw, BookOpenCheck } from 'lucide-react';
import './roundabout-guide.css';
import ManaguaAtlas from './ManaguaAtlas';
const SOURCE = 'https://tramitesenlinea.policia.gob.ni/DocT/EnsenanzasTransito/CirculacionenIntersecciones.pdf';
function RouteDiagram({ exit, lanes = 2, color, title, lane }) {
  const uid = useId().replace(/:/g, '');
  const radius = lane === 'right' || exit === 1 ? 158 : lane === 'center' ? 142 : lanes === 3 ? 100 : 125;
  const end = exit === 1 ? 15 : exit === 2 ? -75 : exit === 3 ? -165 : -255;
  const point = angle => [250 + radius * Math.cos(angle * Math.PI / 180), 250 + radius * Math.sin(angle * Math.PI / 180)];
  const start = point(75), finish = point(end);
  const destination = exit === 1 ? [482, finish[1]] : exit === 2 ? [finish[0], 18] : exit === 3 ? [18, finish[1]] : [finish[0], 482];
  const route = `M ${start[0]} 482 L ${start[0]} ${start[1] + 28} Q ${start[0]} ${start[1]} ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${75 - end > 180 ? 1 : 0} 0 ${finish[0]} ${finish[1]} L ${destination[0]} ${destination[1]}`;
  return <svg viewBox="0 0 500 500" role="img" aria-labelledby={uid + '-title'} className="rg-map">
    <title id={uid + '-title'}>{title}. Entrada desde abajo y circulación en sentido contrario a las agujas del reloj. Esquema didáctico.</title>
    <defs><marker id={uid + '-arrow'} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill={color}/></marker></defs>
    <rect width="500" height="500" rx="24" fill="#e4efda"/>
    {[0,90,180,270].map(a => <g key={a} transform={`rotate(${a} 250 250)`}><rect x="171" y="0" width="158" height="250" fill="#64717d" stroke="#fff" strokeWidth="5"/><path d="M250 0V65" stroke="#fff" strokeWidth="3"/><path d="M211 0V65M289 0V65" stroke="#fff" strokeWidth="2" strokeDasharray="10 8"/></g>)}
    <circle cx="250" cy="250" r="184" fill="#64717d" stroke="#fff" strokeWidth="5"/>
    <circle cx="250" cy="250" r={lanes === 3 ? 156 : 142} fill="none" stroke="#fff" strokeWidth="2"/>
    {lanes === 3 && <circle cx="250" cy="250" r="128" fill="none" stroke="#fff" strokeWidth="2"/>}
    <circle cx="250" cy="250" r={lanes === 3 ? 78 : 103} fill="#a9cb79" stroke="#fff" strokeWidth="5"/>
    <text x="250" y="244" textAnchor="middle" fontSize="20" fontWeight="800" fill="#36522c">{exit === 4 ? 'RETORNO' : `${exit}ª SALIDA`}</text>
    <text x="250" y="270" textAnchor="middle" fontSize="13" fill="#36522c">MODELO DIDÁCTICO</text>
    <path d="M256 442H326" stroke="#fff" strokeWidth="6"/>
    <path d="M350 440L374 440L362 462Z" fill="#fff" stroke="#d94141" strokeWidth="4"/>
    <path d={route} fill="none" stroke={color} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" markerEnd={`url(#${uid}-arrow)`}/>
    <g transform={`translate(${start[0]} 475)`}><rect x="-9" y="-15" width="18" height="30" rx="4" fill="#fff" stroke="#1c3447" strokeWidth="2"/><rect x="-6" y="-9" width="12" height="7" fill="#1c3447"/></g>
    <text x="356" y="487" fontSize="13" fill="#334b3c">ENTRADA</text>
  </svg>;
}
function Sign({ type }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true" className="rg-sign">
    {type === 'yield' ? <><path d="M12 18H88L50 84Z" fill="white" stroke="#d43d46" strokeWidth="9"/><text x="50" y="39" textAnchor="middle" fontSize="10" fontWeight="800">CEDA</text><text x="50" y="51" textAnchor="middle" fontSize="10" fontWeight="800">EL PASO</text></> :
    type === 'stop' ? <><path d="M30 8H70L92 30V70L70 92H30L8 70V30Z" fill="#d43d46"/><text x="50" y="57" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">PARE</text></> :
    type === 'line' ? <><rect x="10" y="8" width="80" height="84" rx="8" fill="#64717d"/><path d="M20 60H80" stroke="white" strokeWidth="8"/></> :
    <><circle cx="50" cy="50" r="42" fill="white" stroke="#d43d46" strokeWidth="8"/><text x="50" y="62" textAnchor="middle" fontSize="35" fontWeight="800">30</text></>}
  </svg>;
}
export default function Roundabouts() {
  const examples = [
    {exit:1,color:'#df9c12',title:'Primera salida · Girar a la derecha',text:'Elegí el carril derecho antes de entrar. Este recorrido muestra la primera salida desde el acceso inferior.'},
    {exit:2,color:'#ca4070',title:'Segunda salida · Continuar de frente',text:'En el modelo de dos carriles, ambos carriles permiten seguir de frente. Aquí se ilustra el recorrido desde el izquierdo.'},
    {exit:3,color:'#098eaf',title:'Tercera salida · Girar a la izquierda',text:'En el modelo de dos carriles, elegí el carril izquierdo antes de entrar. La salida se cuenta desde tu acceso.'},
    {exit:4,color:'#7565af',title:'Retorno · Volver por el mismo acceso',text:'En el modelo de dos carriles, elegí el carril izquierdo antes de entrar. El recorrido completa la vuelta y regresa por el acceso de origen. Verificá que el retorno esté permitido.'},
    {exit:2,lane:'right',color:'#3d8763',title:'De frente · Desde el carril derecho',text:'En el modelo de dos carriles, el derecho también permite continuar de frente. Este ejemplo complementa el recorrido desde el izquierdo; conservá el carril elegido.'},
    {exit:1,lanes:3,lane:'right',color:'#df9c12',title:'Tres carriles · Primera salida',text:'En el modelo de tres carriles, elegí el derecho para girar a la derecha. Observá la señalización y mantené tu carril hasta la salida.'},
    {exit:2,lanes:3,lane:'center',color:'#ca4070',title:'Tres carriles · De frente desde el centro',text:'El carril central permite continuar de frente en este modelo. Prepará tu recorrido antes de entrar y señalizá la salida.'},
    {exit:2,lanes:3,color:'#3d8763',title:'Tres carriles · De frente desde el izquierdo',text:'La guía también permite seguir de frente desde el carril izquierdo en el modelo de tres carriles. Conservá el carril de entrada hasta salir, según el esquema oficial.'},
    {exit:3,lanes:3,color:'#098eaf',title:'Tres carriles · Tercera salida',text:'Elegí el carril izquierdo antes de incorporarte para tomar la tercera salida. Contá las salidas desde tu entrada y usá la direccional derecha al salir.'},
    {exit:4,lanes:3,color:'#7565af',title:'Tres carriles · Retorno',text:'El modelo de tres carriles asigna el retorno al carril izquierdo. Completá la vuelta solo donde esté permitido y seguí las indicaciones del lugar.'},
  ];
  return <section className="workspace rg-guide">
    <header className="workspace-header"><span className="eyebrow"><RotateCcw size={16}/> Guía visual</span><h1>Entendé los recorridos en rotondas</h1><p>Observá las entradas, seguí las flechas y reconocé las señales. Una guía para estudiar a tu ritmo.</p></header>
    <nav className="rg-index" aria-label="Contenido de la guía"><a href="#rg-routes">Recorridos</a><a href="#rg-lanes">Carriles</a><a href="#rg-signs">Señales</a><a href="#rg-managua">Managua</a></nav>
    <section id="rg-routes"><h2>Una salida, un recorrido</h2><p>Esquemas con cuatro accesos, organizados según la cantidad de carriles. Las flechas indican el destino; los dibujos no representan una rotonda específica de Managua.</p>{[2,3].map(lanes=><section className="rg-lane-examples" key={lanes} aria-labelledby={`rg-examples-${lanes}`}><header className="rg-lane-header"><span className="eyebrow">Modelo de {lanes} carriles</span><h3 id={`rg-examples-${lanes}`}>Rotondas de {lanes === 2 ? 'dos' : 'tres'} carriles</h3><p>{lanes === 2 ? 'Primera, segunda y tercera salida, retorno y la variante de frente desde el carril derecho.' : 'Primera salida desde el derecho, variantes de frente desde el centro y el izquierdo, tercera salida y retorno.'}</p></header><div className="rg-routes">{examples.filter(e=>(e.lanes || 2)===lanes).map(e=><article className="rg-route-card" key={e.title}><RouteDiagram {...e}/><div><span className="rg-badge" style={{background:e.color}}>{e.exit === 4 ? 'Retorno' : `${e.exit}ª salida`}</span><h4>{e.title}</h4><p>{e.text}</p></div></article>)}</div></section>)}</section>
    <section className="rg-panel" id="rg-lanes"><h2>Elegí el carril antes de entrar</h2><div className="rg-table-wrap"><table><caption>Destinos por carril según la guía de la Policía Nacional</caption><thead><tr><th>Modelo</th><th>Derecho</th><th>Centro</th><th>Izquierdo</th></tr></thead><tbody><tr><th>Dos carriles</th><td>Derecha o de frente</td><td>No aplica</td><td>De frente, izquierda o retorno</td></tr><tr><th>Tres carriles</th><td>Derecha</td><td>De frente</td><td>De frente, izquierda o retorno</td></tr></tbody></table></div><p>La guía indica conservar el carril de entrada hasta la salida, evitar cambios de carril y usar la direccional derecha al salir. Respetá las señales y las indicaciones del agente en el lugar.</p></section>
    <section id="rg-signs"><h2>Reconocé la señalización</h2><p>Estos símbolos explican la señalización; su ubicación en los modelos es ilustrativa.</p><div className="rg-signs">{[
      ['yield','Ceda el paso','Respetá la prioridad del tráfico que circula dentro. La guía oficial indica detenerse antes de incorporarse.'],
      ['stop','Pare','Detenete ante la señal y observá antes de continuar.'],
      ['line','Línea de pare','Marca el punto donde detener el vehículo antes de entrar.'],
      ['speed','Velocidad','La guía oficial establece un máximo de 30 km/h en rotondas.'],
    ].map(([type,title,text]) => <article className="rg-sign-card" key={type}><Sign type={type}/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="rg-panel"><h3>También mirá el pavimento</h3><p>Las flechas orientan el sentido de circulación, las líneas continuas delimitan los carriles y las islas canalizadoras ordenan los accesos. Revisá espejos, peatones y el espacio disponible antes de entrar.</p></div></section>
    <section id="rg-managua"><h2>Rotondas de Managua · recorridos sobre capturas reales</h2><ManaguaAtlas/></section>
    <aside className="rg-source"><BookOpenCheck size={24}/><div><h2>Fuente del contenido vial</h2><p>Policía Nacional de Nicaragua · Circulación en Intersecciones y Rotondas, páginas 14–20. Diagramas propios simplificados; no están a escala.</p><a href={SOURCE} target="_blank" rel="noreferrer">Consultar material oficial ↗</a></div></aside>
  </section>;
}
