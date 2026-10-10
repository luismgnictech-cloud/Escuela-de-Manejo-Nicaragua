import signals from './data/signalCatalog.json';
import SignalIllustration from './SignalIllustration';

const SOURCE='https://tramitesenlinea.policia.gob.ni/DocT/MaterialdeEstudio/Se%C3%B1alesdeTransito.pdf';
const GROUPS=[
 {id:'verticales',title:'1. Señales verticales',description:'Se colocan junto a la vía para advertir peligros, establecer restricciones y orientar a quienes circulan.',kinds:['Preventiva','Reglamentaria','Informativa','Temporal']},
 {id:'horizontales',title:'2. Señalización horizontal',description:'Líneas, flechas y marcas sobre el pavimento. Identificá el color, la continuidad y el carril al que corresponden.'},
 {id:'luminosas',title:'3. Señales luminosas',description:'Cada ilustración distingue la luz activa. Los rayos alrededor de una luz representan su funcionamiento intermitente.'},
 {id:'manuales',title:'4. Señales manuales',description:'Gestos de los agentes para regular el tránsito y señales del conductor para comunicar sus maniobras.'},
];
function Cards({items,nested=false}){const Heading=nested?'h5':'h4';return <div className="ts-grid">{items.map(item=><article className="ts-card" key={item.id} data-signal-id={item.id}><SignalIllustration id={item.id} title={item.title}/><div>{item.kind&&<span className="eyebrow">{item.kind}</span>}<Heading>{item.title}</Heading><p>{item.description}</p><small>{item.source}</small></div></article>)}</div>}
export default function TrafficSignals(){return <section id="rg-signs" className="ts-catalog">
 <h2>Conocé los tipos de señalización</h2>
 <p>Un catálogo de señales con ilustraciones recreadas para el curso. Cada señal aparece una sola vez; los estados y marcas diferentes tienen su propio ejemplo.</p>
 <p className="ts-note">Esquemas educativos basados en el material de referencia. Los números y distancias dibujados son ejemplos: en la vía, seguí la señal instalada y las indicaciones del agente.</p>
 <nav className="rg-index" aria-label="Tipos de señalización">{GROUPS.map(group=><a key={group.id} href={'#ts-'+group.id}>{group.title.slice(3)}</a>)}</nav>
 {GROUPS.map(group=><section key={group.id} id={'ts-'+group.id} className="ts-group"><header><h3>{group.title}</h3><p>{group.description}</p></header>{group.kinds?group.kinds.map(kind=><div key={kind} className="ts-subgroup"><h4>{({Preventiva:'Preventivas',Reglamentaria:'Reglamentarias',Informativa:'Informativas',Temporal:'Temporales y de obras'})[kind]}</h4><Cards nested items={signals.filter(item=>item.group===group.id&&item.kind===kind)}/></div>):<Cards items={signals.filter(item=>item.group===group.id)}/>}</section>)}
 <p className="ts-source"><a href={SOURCE} target="_blank" rel="noreferrer">Consultar el material oficial de señales de tránsito ↗</a></p>
 </section>}
