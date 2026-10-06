import { useEffect, useRef, useState } from 'react';
import { RotateCcw, ArrowRight, CarFront, CheckCircle2 } from 'lucide-react';
import { CHALLENGES, SOURCE, point, trafficAngle, safeGap, validLane } from './roundabout';
import './roundabouts.css';

function Car({ x, y, angle, color, signal = false }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}><rect x="-10" y="-17" width="20" height="34" rx="5" fill={color} stroke="#fff" strokeWidth="2"/><rect x="-7" y="-9" width="14" height="9" rx="2" fill="#17324c"/><rect x="-7" y="9" width="14" height="4" rx="1" fill="#17324c"/>{signal && <circle cx="12" cy="-11" r="4" fill="#facc15"/>}</g>;
}

function Map({ lanes, lane, phase, angle, distance, time, signal, exit }) {
  const radius = lanes === 2 && lane === 'inner' ? 112 : 148;
  let position = phase === 'approach' || phase === 'wait' ? { x: 278, y: 452 - distance } : point(angle, radius);
  let rotation = phase === 'approach' || phase === 'wait' ? 0 : angle;
  if (phase === 'done') {
    const a = 90 - exit * 90;
    position = point(a, 220); rotation = a + 90;
  }
  return <svg className="rb-map" viewBox="0 0 500 500" role="img" aria-label={`Rotonda de ${lanes} carril${lanes === 2 ? 'es' : ''}. Tu vehículo es azul. Destino: salida ${exit}.`}>
    <rect width="500" height="500" rx="24" fill="#dbeadc"/>
    {[0, 90, 180, 270].map(a => <g key={a} transform={`rotate(${a} 250 250)`}><rect x="192" y="0" width="116" height="250" fill="#465569"/><path d="M250 0V90" stroke="#f8dd73" strokeWidth="3" strokeDasharray="12 10"/><path d="M270 55v-25m-7 7 7-7 7 7" fill="none" stroke="white" strokeWidth="3"/></g>)}
    <circle cx="250" cy="250" r="174" fill="#465569" stroke="#fff" strokeWidth="3"/>
    {lanes === 2 && <circle cx="250" cy="250" r="130" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="12 10"/>}
    <circle cx="250" cy="250" r={lanes === 2 ? 90 : 120} fill="#98c3a1" stroke="#fff" strokeWidth="3"/>
    <text x="250" y="242" textAnchor="middle" fill="#1e4c3a" fontSize="17" fontWeight="700">PRÁCTICA</text><text x="250" y="267" textAnchor="middle" fill="#1e4c3a" fontSize="14">{lanes} carril{lanes === 2 ? 'es' : ''}</text>
    {[1, 2, 3].map(n => { const p = point(90 - n * 90, 215); return <g key={n}><circle cx={p.x} cy={p.y} r="21" fill={exit === n ? '#f5c842' : '#fff'}/><text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="#142235">{n}</text></g>; })}
    <path d="M256 405h46" stroke="white" strokeWidth="5"/><text x="340" y="425" fontSize="12" fill="#142235">PARE</text>
    {[0, 1, 2].map(i => { const a = trafficAngle(time, i); const p = point(a, 148); return <Car key={i} {...p} angle={a} color="#e89552"/>; })}
    <Car {...position} angle={rotation} color="#1573e8" signal={signal}/>
  </svg>;
}

export default function Roundabouts({ progress, onComplete }) {
  const [lanes, setLanes] = useState(1);
  const [challenge, setChallenge] = useState(0);
  const [guided, setGuided] = useState(true);
  const [lane, setLane] = useState('outer');
  const [phase, setPhase] = useState('approach');
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(90);
  const [speed, setSpeed] = useState(0);
  const [time, setTime] = useState(0);
  const [signal, setSignal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('Elegí tu carril y avanzá hasta la línea de pare.');
  const finished = useRef(false);
  const task = CHALLENGES[challenge];
  const target = 90 - task.exit * 90;
  const gap = safeGap(time);
  const nearExit = phase === 'circle' && angle <= target + 28;
  const result = progress?.[`${lanes}-${task.id}`];

  const reset = () => {
    setPhase('approach'); setDistance(0); setAngle(90); setSpeed(0); setTime(0); setSignal(false); setErrors([]); finished.current = false;
    setMessage('Elegí tu carril y avanzá hasta la línea de pare.');
  };
  useEffect(() => { reset(); setLane('outer'); }, [lanes, challenge]);
  useEffect(() => {
    if (phase === 'done') return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setTime(t => t + .1);
      if (phase === 'approach' && speed > 0) setDistance(d => Math.min(42, d + speed * .14));
      if (phase === 'circle' && speed > 0) setAngle(a => Math.max(target, a - speed * .12));
    }, 100);
    return () => clearInterval(timer);
  }, [phase, speed, target]);
  useEffect(() => {
    if (distance >= 42 && phase === 'approach') {
      setSpeed(0); setPhase('wait'); setMessage('Te detuviste en la línea de pare. Observá el tráfico antes de entrar.');
    }
    if (phase === 'circle' && angle <= target) setSpeed(0);
  }, [distance, phase, angle, target]);
  function mistake(id, text) {
    setErrors(previous => previous.some(e => e.id === id) ? previous : [...previous, { id, text }]); setMessage(text);
  }
  function enter() {
    if (!validLane(lanes, task.exit, lane)) return mistake('lane', 'Revisá tu carril: en este modelo de dos carriles, el derecho permite primera o segunda salida; el izquierdo permite segunda o tercera.');
    if (!gap) return mistake('priority', 'Hay un vehículo cerca del acceso. Esperá un espacio seguro y respetá su prioridad.');
    setPhase('circle'); setSpeed(15); setSignal(false); setMessage('Ya estás dentro. Conservá tu carril y prepará la direccional derecha antes de salir.');
  }
  function leave() {
    if (!nearExit) return mistake('early', 'Todavía no llegaste a tu salida. Seguí circulando hasta el destino marcado en amarillo.');
    if (!signal) return mistake('signal', 'Activá la direccional derecha antes de tomar la salida.');
    if (finished.current) return;
    finished.current = true; setPhase('done'); setSpeed(0); setMessage('Recorrido completado. Revisá tus decisiones y probá otro desafío.');
    onComplete(`${lanes}-${task.id}`, { errors: errors.length, date: new Date().toISOString() });
  }
  return <section className="workspace rb-workspace">
    <div className="workspace-header"><span className="eyebrow"><RotateCcw size={16}/> Práctica interactiva</span><h1>Práctica en rotondas</h1><p>Elegí tu destino, observá el tráfico y practicá tus decisiones al volante.</p></div>
    <div className="rb-settings">
      <label>Escenario<select value={lanes} onChange={e => setLanes(Number(e.target.value))}><option value="1">Rotonda de un carril</option><option value="2">Rotonda de dos carriles</option></select></label>
      <label>Desafío<select value={challenge} onChange={e => setChallenge(Number(e.target.value))}>{CHALLENGES.map((c, i) => <option key={c.id} value={i}>{c.name}</option>)}</select></label>
      <label>Ayuda<select value={guided ? 'guided' : 'challenge'} onChange={e => setGuided(e.target.value === 'guided')}><option value="guided">Práctica guiada</option><option value="challenge">Sin pistas</option></select></label>
    </div>
    <div className="rb-layout"><div className="rb-scene"><div className="rb-scene-heading"><strong>{task.description}</strong><span>{speed} km/h</span></div><Map {...{ lanes, lane, phase, angle, distance, time, signal }} exit={task.exit}/><div className="rb-legend"><span>🔵 Tu vehículo</span><span>🟠 Tráfico</span><span>🟡 Tu salida</span></div></div>
    <div className="rb-panel"><span className="eyebrow">Tu recorrido</span><h2>{phase === 'done' ? 'Resultado' : task.name}</h2>
      <p role="status" aria-live="polite" className="rb-feedback">{message}</p>
      {guided && phase !== 'done' && <p className="rb-hint">{phase === 'approach' ? 'Usá Avanzar. El vehículo se detiene automáticamente en el acceso para que puedas observar.' : phase === 'wait' ? `${gap ? 'Ahora hay un espacio disponible.' : 'Esperá a que pase el vehículo naranja.'} ${lanes === 2 ? 'Seleccioná el carril antes de entrar.' : ''}` : nearExit ? 'Activá la direccional derecha y pulsá Tomar salida.' : 'Usá Avanzar para continuar. El trazado se sigue automáticamente.'}</p>}
      {lanes === 2 && <fieldset className="rb-lanes" disabled={phase === 'circle' || phase === 'done'}><legend>Carril de entrada</legend><button className={lane === 'outer' ? 'selected' : ''} aria-pressed={lane === 'outer'} onClick={() => setLane('outer')}>Derecho</button><button className={lane === 'inner' ? 'selected' : ''} aria-pressed={lane === 'inner'} onClick={() => setLane('inner')}>Izquierdo</button></fieldset>}
      {phase !== 'done' && <div className="rb-controls"><button className="button primary" disabled={phase === 'wait' || (phase === 'circle' && angle <= target)} onClick={() => setSpeed(s => Math.min(30, s + 10))}><CarFront size={18}/> Avanzar</button><button className="button" disabled={speed === 0} onClick={() => {setSpeed(0); setMessage('Vehículo detenido. Pulsá Avanzar cuando estés listo.');}}>Frenar</button><button className={`button ${signal ? 'rb-signal-on' : ''}`} disabled={phase !== 'circle'} aria-pressed={signal} onClick={() => setSignal(s => !s)}><ArrowRight size={18}/> Direccional derecha</button>{phase === 'wait' && <button className="button primary" onClick={enter}>Entrar a la rotonda</button>}{phase === 'circle' && <button className="button primary" onClick={leave}>Tomar salida {task.exit}</button>}</div>}
      {phase === 'done' && <div className="rb-result"><CheckCircle2/><strong>{errors.length === 0 ? '¡Completado sin errores!' : `${errors.length} decisiones para repasar`}</strong>{errors.length > 0 && <ul>{errors.map(e => <li key={e.id}>{e.text}</li>)}</ul>}<p>Conservaste el carril y señalizaste la salida.</p></div>}
      <button className="text-button" onClick={reset}><RotateCcw size={17}/> Reiniciar recorrido</button>
      <p className="rb-saved">{result ? `Último intento guardado: ${result.errors} errores.` : 'Completá el recorrido para guardar tu resultado.'}</p>
    </div></div>
    <div className="rb-notes"><h2>Antes de conducir</h2><p>Modelos didácticos con trazado simplificado. Las versiones de rotondas específicas de Managua se incorporarán después de verificar sus accesos y señalización.</p><p>Elegí el carril con anticipación, detenete antes de la línea de pare, respetá la prioridad del tráfico interior y señalizá a la derecha para salir. En el modelo de dos carriles conservá el carril de entrada hasta la salida. La velocidad del ejercicio está limitada a 30 km/h; respetá siempre la señalización del lugar.</p><a href={SOURCE} target="_blank" rel="noreferrer">Consultar guía de la Policía Nacional ↗</a></div>
  </section>;
}
