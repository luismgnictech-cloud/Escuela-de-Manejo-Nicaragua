import { useId } from 'react';
import { BookOpenCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import './visual-guides.css';
const INTER='https://tramitesenlinea.policia.gob.ni/DocT/EnsenanzasTransito/CirculacionenIntersecciones.pdf';
const DEF='https://tramitesenlinea.policia.gob.ni/DocT/EnsenanzasTransito/ManejoDefensivo.pdf';
const SIGNALS='https://tramitesenlinea.policia.gob.ni/DocT/MaterialdeEstudio/Se%C3%B1alesdeTransito.pdf';
export const GUIDES=[
 {id:'intersecciones',title:'Tipos de intersecciones',intro:'Reconocé la forma del cruce antes de decidir cómo continuar.',source:INTER,items:[
 ['t','Intersección en T','Una vía termina al encontrarse con otra. Identificá los accesos y la señalización de cada aproximación.'],
 ['cross','Intersección en cruz','Dos vías se cruzan y forman cuatro accesos. La forma del cruce no determina por sí sola la prioridad.'],
 ['y','Intersección en Y','Los accesos se unen en ángulo. Observá las islas y las líneas que canalizan el tránsito.'],
 ['lights','Cruce con semáforo','El dispositivo regula los movimientos. No entrés si vas a quedar detenido bloqueando el cruce.'],
 ['stop','Cruce con señal de pare','La señal y su línea se observan desde el acceso al que corresponden.'],
 ['unsigned','Cruce sin señales','Compará las vías y las trayectorias; revisá las situaciones de la guía de prioridad.'],
 ]},
 {id:'prioridad',title:'Prioridad de paso',intro:'Ejemplos sin señales, con condiciones explícitas para comprender la preferencia.',source:INTER,items:[
 ['priority-main','Vía principal y secundaria','Sin señales, el vehículo en la vía principal tiene preferencia frente al que viene de una secundaria. A: principal. B: secundaria.'],
 ['priority-paved','Vía pavimentada y sin pavimentar','Sin señales, A circula sobre pavimento y tiene preferencia frente a B, que llega desde una vía sin pavimentar.'],
 ['priority-turn','Giros hacia la misma vía','Si llegan al mismo tiempo desde sentidos opuestos y toman la misma vía en el mismo sentido, A gira a la derecha y tiene preferencia frente a B, que gira a la izquierda.'],
 ]},
 {id:'giros',title:'Giros y cambios de dirección',intro:'Observá la posición inicial y la trayectoria, sin confundir las flechas con una autorización para girar.',source:INTER,items:[
 ['right','Giro a la derecha','Ubicate con anticipación y señalizá. Revisá el lado derecho, especialmente la presencia de motos, bicicletas y peatones.'],
 ['left','Giro a la izquierda','Prepará el carril antes del cruce. Comprobá el tránsito contrario y la señalización antes de ejecutar la maniobra.'],
 ['lane','Cambio de carril en un tramo recto','Ejemplo fuera de una intersección. Revisá espejos y punto ciego, señalizá y esperá un espacio seguro.'],
 ],extra:'La guía oficial prohíbe cambiar de carril, aventajar, estacionarse o girar en U dentro de las intersecciones.'},
 {id:'senales',title:'Señales y marcas viales',intro:'Reconocé los símbolos y el lugar donde se aplican.',source:SIGNALS,items:[
 ['sign-stop','Pare','La señal exige detenerse. Observá la línea correspondiente antes de continuar.'],
 ['sign-yield','Ceda el paso','Indica que debés respetar la preferencia de los otros usuarios de la vía.'],
 ['sign-warning','Señal preventiva','Advierte un riesgo o condición próxima. El pictograma identifica la situación: aquí, un cruce.'],
 ['sign-info','Señal informativa','Orienta hacia un destino o servicio. El ejemplo identifica estacionamiento.'],
 ['markings','Líneas del pavimento','La línea continua indica que no debe cruzarse. Las marcas organizan carriles y movimientos.'],
 ['crosswalk','Paso peatonal','Las franjas identifican el espacio de cruce de peatones. Observá sus aproximaciones.'],
 ]},
 {id:'puntos-ciegos',title:'Puntos ciegos',intro:'Las zonas coloreadas representan áreas que pueden quedar fuera de la visión del conductor.',source:DEF,items:[
 ['blind-car','Alrededor de un automóvil','Los espejos no cubren todos los ángulos. Ajustalos antes de conducir y comprobá el punto ciego antes de una maniobra lateral.'],
 ['blind-truck','Alrededor de un vehículo grande','El tamaño y la posición de los espejos modifican las zonas ocultas. Evitá permanecer junto al vehículo en un área donde el conductor pueda no verte.'],
 ],extra:'Las áreas son ilustrativas: cambian con el vehículo, la posición del conductor, los espejos y la carga.'},
 {id:'estacionamiento',title:'Tipos de estacionamiento',intro:'Compará la orientación del vehículo y el espacio. Son posiciones finales, no instrucciones paso a paso para maniobrar.',source:SIGNALS,items:[
 ['park-parallel','Paralelo','El vehículo queda alineado con el borde de la vía. Verificá que el lugar permita estacionar.'],
 ['park-perpendicular','Perpendicular','El vehículo queda a 90° respecto al pasillo. Respetá las plazas demarcadas.'],
 ['park-diagonal','En diagonal','Las plazas forman un ángulo con el pasillo. Observá el sentido de circulación indicado.'],
 ],extra:'No ocupés aceras, pasos peatonales ni accesos. Antes de retroceder comprobá el entorno y los peatones.'},
 {id:'distancia',title:'Distancia de seguridad',intro:'Separá el espacio de seguimiento de las fases necesarias para detener el vehículo.',source:DEF,items:[
 ['following','Espacio de seguimiento','El espacio entre vehículos permite anticipar y responder. Adaptalo a la visibilidad, al estado de la vía y al tránsito.'],
 ['reaction','Percepción y reacción','El vehículo sigue avanzando mientras identificás el riesgo y empezás a frenar.'],
 ['braking','Frenado y detención','La distancia total incluye percepción, reacción y frenado. El dibujo compara fases; no calcula metros reales.'],
 ],extra:'Las proporciones son esquemáticas. Velocidad, adherencia, frenos y condiciones del conductor influyen en la detención.'},
];
function Car({x,y,angle=0,label='A',color='#147dac',large=false}) {return <g transform={`translate(${x} ${y}) rotate(${angle})`}><rect x="-13" y={large ? -42 : -22} width="32" height={large ? 90 : 50} rx="7" fill="#182c3c" opacity=".25"/><rect x="-16" y={large ? -45 : -25} width="32" height={large ? 90 : 50} rx="7" fill={color} stroke="white" strokeWidth="2"/><rect x="-11" y="-19" width="22" height="10" rx="2" fill="#173748"/><rect x="-11" y={large ? 30 : 13} width="22" height="6" rx="2" fill="#243e50"/><path d="M-13 -22h6m13 0h6" stroke="#fff4ad" strokeWidth="3"/><text y="7" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">{label}</text></g>;}
function Symbol({type,x=250,y=140}) {return <g transform={`translate(${x} ${y})`}>{type==='stop' ? <><path d="M-20-34H20L34-20V20L20 34H-20L-34 20V-20Z" fill="#d43e4c" stroke="white" strokeWidth="3"/><text y="5" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">PARE</text></> : type==='yield' ? <><path d="M-37-28H37L0 36Z" fill="white" stroke="#d43e4c" strokeWidth="7"/><text y="-6" textAnchor="middle" fontSize="9" fontWeight="800">CEDA</text><text y="5" textAnchor="middle" fontSize="9" fontWeight="800">EL PASO</text></> : type==='info' ? <><rect x="-38" y="-38" width="76" height="76" rx="6" fill="#147dac"/><text y="17" textAnchor="middle" fontSize="48" fontWeight="900" fill="white">P</text></> : <><path d="M0-44L44 0L0 44L-44 0Z" fill="#f9cb47" stroke="#243b49" strokeWidth="3"/><path d="M0-25V25M-25 0H25" stroke="#243b49" strokeWidth="9"/></>}</g>;}
export function GuideDiagram({type,title}) {
 const id=useId().replace(/:/g,'');
 if(type==='t'||type==='cross') return <img className="vg-diagram" src={import.meta.env.BASE_URL+'images/guides/'+type+'.webp'} alt={title} loading="lazy" decoding="async"/>;
 const sign=type.startsWith('sign-'); const blind=type.startsWith('blind-');const park=type.startsWith('park-');const distance=['following','reaction','braking'].includes(type);
 const road=<><rect x="0" y="105" width="500" height="110" stroke="#f8faf7" strokeWidth="8" fill={`url(#${id}-asphalt)`}/><path d="M0 160H500" stroke="white" strokeWidth="3" strokeDasharray="12 10"/></>;
 const vertical=<><rect x="195" width="110" height="320" stroke="#f8faf7" strokeWidth="8" fill={`url(#${id}-asphalt)`}/><path d="M250 0V320" stroke="white" strokeWidth="3" strokeDasharray="12 10"/></>;
 let content;
 if(sign) content=<>{road}<Car x={100} y={185} angle={90}/><path d="M335 64V105" stroke="#52616b" strokeWidth="5"/><Symbol type={type.replace('sign-','')} x={335} y={54}/>{type==='sign-stop'&&<path d="M295 164V210" stroke="white" strokeWidth="6"/>}<path d="M140 185H265" className="vg-route" markerEnd={`url(#${id})`}/><text x="250" y="277" textAnchor="middle" fill="#324f60" fontSize="15">{title}: ejemplo junto a la vía</text></>;
 else if(blind) content=<><rect x="90" width="320" height="320" fill={`url(#${id}-asphalt)`}/><path d="M180 0V320M320 0V320" stroke="white" strokeDasharray="12 10"/><path d={type==='blind-truck' ? 'M230 85L185 8H315L270 85ZM228 118L105 95V280L230 190ZM272 118L395 95V280L270 190ZM230 205L170 305H330L270 205Z':'M230 140L140 180L140 270L233 195ZM270 140L360 180L360 270L267 195Z'} fill="#f9cb47" opacity=".65"/><Car x={250} y={155} large={type==='blind-truck'}/><text x="250" y="302" textAnchor="middle" fontSize="13" fill="white">Amarillo: zonas ocultas ilustrativas</text></>;
 else if(park){const angle=type==='park-parallel'?90:type==='park-diagonal'?40:0;content=<><rect y="190" width="500" height="130" fill={`url(#${id}-asphalt)`}/><rect y="30" width="500" height="160" fill="#d8e4e9"/>{[110,250,390].map(x=><g key={x} transform={`translate(${x} 110) rotate(${angle})`}><rect x="-28" y="-46" width="56" height="92" fill="none" stroke="white" strokeWidth="4"/><Car x={0} y={0} label=""/></g>)}<text x="250" y="263" textAnchor="middle" fill="white" fontSize="16">Pasillo de circulación</text></>;}
 else if(distance) content=<>{road}{type==='following'?<><Car x={110} y={185} angle={90}/><Car x={395} y={185} angle={90} label="B" color="#ce6e3c"/><path d="M155 180H345" stroke="#f9cb47" strokeWidth="8"/><text x="250" y="260" textAnchor="middle" fontSize="15">Espacio para anticipar y responder</text></>:<><Car x={55} y={185} angle={90}/>{[['Percepción',100,90,'#50a9cf'],['Reacción',190,90,'#e9b745'],['Frenado',280,150,'#ce6e3c']].map(([label,x,width,color])=><g key={label}><rect x={x} y="175" width={width} height="20" fill={color}/><text x={x+width/2} y="245" textAnchor="middle" fontSize="13">{label}</text></g>)}<path d="M435 135V210" stroke="white" strokeWidth="5"/></>}</>;
 else if(type==='y') content=<><path d="M250 320V170L95 0M250 170L405 0" fill="none" stroke="#eff2ed" strokeWidth="114"/><path d="M250 320V170L95 0M250 170L405 0" fill="none" stroke="#64727d" strokeWidth="100"/><path d="M250 320V170L95 0M250 170L405 0" fill="none" stroke="white" strokeWidth="3" strokeDasharray="12 10"/></>;
 else if(type==='t') content=<>{road}<rect x="195" y="160" width="110" height="160" fill={`url(#${id}-asphalt)`}/><path d="M250 215V320" stroke="white" strokeWidth="3" strokeDasharray="12 10"/></>;
 else if(type==='lane') content=<>{road}<Car x={80} y={187} angle={90}/><path d="M110 187H185Q245 187 285 130H420" className="vg-route" markerEnd={`url(#${id})`}/></>;
 else if(type==='markings')content=<><rect x="80" width="340" height="320" fill={`url(#${id}-asphalt)`}/><path d="M250 0V320" stroke="white" strokeWidth="5"/><text x="250" y="285" textAnchor="middle" fill="#f9cb47" fontSize="15">Línea continua</text></>;
 else if(type==='crosswalk')content=<>{road}{[180,210,240,270,300].map(x=><rect key={x} x={x} y="110" width="18" height="100" fill="white"/>)}</>;
 else content=<>{road}{vertical}
 {type==='priority-paved'&&<rect x="195" width="110" height="105" fill="#bb956f"/>}
 {type==='lights'&&<g transform="translate(335 235)"><rect width="25" height="70" rx="8" fill="#253b49"/>{['#d84444','#ecc64c','#56b564'].map((c,i)=><circle key={c} cx="12" cy={12+i*22} r="8" fill={c}/>)}</g>}
 {type==='stop'&&<><Symbol type="stop" x={348} y={260}/><path d="M258 233H302" stroke="white" strokeWidth="5"/></>}
 {['right','left'].includes(type)&&<><Car x={280} y={275}/><path d={type==='right'?'M280 246V220Q280 185 345 185H450':'M280 246V225Q280 185 225 185H50'} className="vg-route" markerEnd={`url(#${id})`}/></>}
 {type==='priority-main'&&<><Car x={100} y={185} angle={90}/><Car x={280} y={270} label="B" color="#ce6e3c"/><text x="60" y="145" fill="white" fontSize="13">Principal</text><text x="310" y="300" fontSize="13">Secundaria</text></>}
 {type==='priority-paved'&&<><Car x={100} y={185} angle={90}/><Car x={220} y={45} angle={180} label="B" color="#ce6e3c"/></>}
 {type==='priority-turn'&&<><Car x={280} y={275}/><Car x={220} y={45} angle={180} label="B" color="#ce6e3c"/><path d="M280 245V220Q280 185 355 185H460" className="vg-route" markerEnd={`url(#${id})`}/><path d="M220 75V130Q220 185 345 185" fill="none" stroke="#ce6e3c" strokeWidth="5" strokeDasharray="9 6"/></>}
 </>;
 return <svg className="vg-diagram" viewBox="0 0 500 320" role="img" aria-label={`${title}. Diagrama esquemático, no está a escala.`}><defs><pattern id={id+"-asphalt"} width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#65727e"/><circle cx="3" cy="5" r=".7" fill="#87949d" opacity=".55"/><circle cx="10" cy="11" r=".6" fill="#3f535e" opacity=".6"/></pattern><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#f9cb47"/></marker></defs><rect width="500" height="320" rx="16" fill="#cfdfb7"/>
 {!sign && !blind && !park && <g aria-hidden="true">{[[40,42],[440,42],[40,270],[440,270]].map(([x,y])=><g key={x+','+y} transform={`translate(${x} ${y})`}><ellipse cx="4" cy="7" rx="22" ry="20" fill="#466534" opacity=".22"/><circle r="20" fill="#83b14d"/><circle cx="-8" cy="-5" r="13" fill="#9ac765"/><circle cx="7" cy="-5" r="12" fill="#739e40"/></g>)}</g>}
 {content}
 {['cross','unsigned','t'].includes(type) && <><Car x={280} y={275}/><Car x={100} y={185} angle={90} label="B" color="#d88446"/></>}
 {type==='lights'&&<><Car x={280} y={280}/><path d="M259 239H302" stroke="white" strokeWidth="5"/>{[320,340,360].map(x=><rect key={x} x={x} y="110" width="10" height="100" fill="white"/>)}</>}
 {type==='stop'&&<Car x={280} y={280}/>}
 {distance&&<path d="M0 108H500M0 213H500" stroke="white" strokeWidth="4"/>}
 </svg>;
}
export default function VisualGuides({guideId,onOpen,onBack}) {
 const guide=GUIDES.find(g=>g.id===guideId);
 if(!guide)return <section className="workspace vg-hub"><header className="workspace-header"><span className="eyebrow"><BookOpenCheck size={16}/> Biblioteca visual</span><h1>Guías para aprender a conducir</h1><p>Diagramas y ejemplos para estudiar a tu ritmo.</p></header><div className="vg-grid">{GUIDES.map(g=><a className="vg-link" href={'#guia-'+g.id} key={g.id} onClick={()=>onOpen(g.id)}><GuideDiagram type={g.items[0][0]} title={g.title}/><div><h2>{g.title}</h2><p>{g.intro}</p><span>Ver guía <ChevronRight size={16}/></span></div></a>)}</div></section>;
 return <section className="workspace vg-page"><a className="vg-back" href="#guias" onClick={onBack}><ArrowLeft size={17}/> Todas las guías</a><header className="workspace-header"><span className="eyebrow">Guía visual</span><h1>{guide.title}</h1><p>{guide.intro}</p></header><div className="vg-examples">{guide.items.map(([type,title,text])=><article className="vg-example" key={type}><GuideDiagram type={type} title={title}/><div><h2>{title}</h2><p>{text}</p></div></article>)}</div>{guide.extra&&<aside className="vg-note"><h2>Para recordar</h2><p>{guide.extra}</p></aside>}<aside className="vg-source"><h2>Material de referencia</h2><p>Ilustraciones propias y simplificadas. La señalización del lugar y las indicaciones del agente determinan la circulación.</p><a href={guide.source} target="_blank" rel="noreferrer">Consultar material de la Policía Nacional ↗</a></aside><nav className="vg-related" aria-label="Más guías">{GUIDES.filter(g=>g.id!==guide.id).map(g=><a href={'#guia-'+g.id} key={g.id} onClick={()=>onOpen(g.id)}>{g.title} <ChevronRight size={15}/></a>)}</nav></section>;
}
