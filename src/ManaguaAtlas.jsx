import { useId, useState, useRef, useEffect } from 'react';
import { MANAGUA_MAPS } from './managuaMaps';
const COLORS=['#ffd44b','#f2689b','#36d8ef','#c89bff'];
function Trace({place,from,to}) {
 const uid=useId().replace(/:/g,'');
 const [cx,cy,rx,ry]=place.ring;
 const entry=place.access[from], exit=place.access[to];
 const start=entry[1]-8, finish=exit[1]+8;
 let span=(start-finish+360)%360;if(from===to)span=344;
 const pts=Array.from({length:Math.ceil(span/5)+1},(_,i)=>{let a=(start-span*i/Math.ceil(span/5))*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
 const endpoint=(a,incoming)=>{const dx=cx-a[2],dy=cy-a[3],length=Math.hypot(dx,dy),side=incoming?12:-12;return [a[2]-dy/length*side,a[3]+dx/length*side];};
 const origin=endpoint(entry,true),destination=endpoint(exit,false),first=pts[0],last=pts[pts.length-1];
 const tangent=a=>[rx*Math.sin(a*Math.PI/180),-ry*Math.cos(a*Math.PI/180)];
 const ti=tangent(start),te=tangent(start-span);const scale=v=>v.map(n=>n/Math.hypot(...v)*30);
 const t1=scale(ti),t2=scale(te);
 const path=`M${origin.join(' ')} C${origin.join(' ')} ${first[0]-t1[0]} ${first[1]-t1[1]} ${first.join(' ')} L${pts.slice(1).map(p=>p.join(' ')).join(' L')} C${last[0]+t2[0]} ${last[1]+t2[1]} ${destination.join(' ')} ${destination.join(' ')}`;

 return <figure className="ma-trace"><svg viewBox={place.frame||'300 180 850 650'} role="img" aria-label={`${place.name}: de ${entry[0]} a ${exit[0]}. Trazo orientativo sobre imagen satelital.`}><defs><marker id={uid} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill={COLORS[to]}/></marker></defs><image href={`${import.meta.env.BASE_URL}maps/${place.id}.jpg`} width="1363" height="936"/><path d={path} fill="none" stroke="#102736" strokeWidth="15" opacity=".8" strokeLinejoin="round"/><path d={path} fill="none" stroke={COLORS[to]} strokeWidth="8" strokeLinejoin="round" markerEnd={`url(#${uid})`}/><circle cx={entry[2]} cy={entry[3]} r="15" fill="white" stroke="#102736" strokeWidth="3"/><text x={entry[2]} y={entry[3]+6} textAnchor="middle" fontSize="18" fontWeight="900">{from+1}</text></svg><figcaption>{from+1} → {to+1} · {from===to?'Retorno al mismo acceso':exit[0]}<p>Entrá desde {entry[0]}, seguí el recorrido marcado en sentido contrario a las agujas del reloj y {from===to ? 'completá la vuelta para regresar al mismo acceso, únicamente si el retorno está permitido.' : `tomá la conexión hacia ${exit[0]}.`}</p><small>Trazo de orientación; no representa un carril específico. Verificá la señalización y las restricciones del lugar.</small></figcaption></figure>;
}
export default function ManaguaAtlas(){
 const [selected,setSelected]=useState(null),[slide,setSlide]=useState(0);
 const dialog=useRef(null),trigger=useRef(null);
 const place=MANAGUA_MAPS.find(p=>p.id===selected);
 const routes=place?.access?.flatMap((_,from)=>place.access.map((_,to)=>({from,to}))) || [];
 const total=routes.length+1;
 const close=()=>{dialog.current?.close();setSelected(null);trigger.current?.focus();};
 useEffect(()=>{if(!place)return;dialog.current.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[selected]);
 const move=direction=>setSlide(value=>(value+direction+total)%total);
 return <div className="ma-atlas">
 <p>Elegí una rotonda para abrir su galería de capturas y recorridos. Cada imagen incluye su explicación.</p>
 <nav className="ma-index" aria-label="Rotondas de Managua">{MANAGUA_MAPS.map(p=><button type="button" key={p.id} aria-haspopup="dialog" onClick={event=>{trigger.current=event.currentTarget;setSlide(0);setSelected(p.id);}}>{p.name}</button>)}</nav>
 <dialog ref={dialog} className="ma-dialog" aria-labelledby="ma-gallery-title" onCancel={event=>{event.preventDefault();close();}} onClick={event=>{if(event.target===dialog.current)close();}} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}}>
 {place&&<div className="ma-dialog-content">
 <header className="ma-gallery-header"><div><span className="eyebrow">Galería de rotondas</span><h2 id="ma-gallery-title">{place.name}</h2></div><button type="button" className="ma-close" aria-label="Cerrar galería" onClick={close}>×</button></header>
 <div className="ma-gallery-slide" key={place.id+'-'+slide}>
 {slide===0?<figure className="ma-trace"><img className="ma-gallery-original" src={`${import.meta.env.BASE_URL}maps/${place.id}.jpg`} alt={`Vista satelital de ${place.name}, Google Maps`} width="1363" height="936"/><figcaption>Vista general de {place.name}<p>{place.note}</p><small>Captura de Google Maps tomada el 9 de octubre de 2026. La fecha de captura no es la fecha de la imagen aérea.</small></figcaption></figure>:<Trace place={place} from={routes[slide-1].from} to={routes[slide-1].to}/>}
 </div>
 <nav className="ma-gallery-controls" aria-label="Navegación de la galería"><button type="button" onClick={()=>move(-1)} disabled={total===1} aria-label="Imagen anterior">← Anterior</button><span aria-live="polite">Imagen {slide+1} de {total}</span><button type="button" onClick={()=>move(1)} disabled={total===1} aria-label="Imagen siguiente">Siguiente →</button></nav>
 <a className="ma-gallery-source" href={`${import.meta.env.BASE_URL}maps/${place.id}.jpg`} target="_blank" rel="noreferrer">Ver captura completa y atribución ↗</a>
 <p className="ma-gallery-note">{routes.length?'Los trazos son orientativos; no se han verificado los carriles ni todas las restricciones en sitio.':'Se conserva la captura como referencia; no se trazan rutas sin confirmar la configuración actual.'}</p>
 </div>}
 </dialog></div>
}
