import './roundabout-example.css';

export function roundaboutExample(question) {
  if (!/rotonda/i.test(question.question)) return null;
  const text = question.question.toLowerCase();
  const lane = /izquierd/.test(text) ? 'left' : /centro/.test(text) ? 'center' : /derecha/.test(text) ? 'right' : null;
  return { lane, threeEntries: /tres carriles/.test(text), speed: /velocidad/.test(text) };
}

export default function RoundaboutExample({ question, reveal = false }) {
  const example = roundaboutExample(question);
  if (!example) return null;
  const { lane, threeEntries, speed } = example;
  const incomingWidth = threeEntries ? 75 : 50;
  const laneX = lane === 'left' ? 292.5 : lane === 'center' ? 317.5 : 342.5;
  const laneName = { left: 'izquierdo', center: 'central', right: 'derecho' }[lane];
  const caption = lane ? `El vehículo azul está en el carril ${laneName} de entrada. Observá las salidas antes de responder.` : speed ? 'El vehículo azul circula dentro de la rotonda. La velocidad no se indica para que puedas responder.' : 'El vehículo azul se aproxima al acceso; el naranja circula dentro de la rotonda.';
  return <figure className="roundabout-example">
    <div className="roundabout-example-heading"><strong>Ejemplo visual</strong><span>Vista desde arriba</span></div>
    <svg viewBox="0 0 560 500" role="img" aria-label={`Ejemplo de rotonda. ${caption}`}>
      <rect width="560" height="500" rx="20" fill="#e7efe7"/>
      {[0,90,180,270].map(a => <g key={a} transform={`rotate(${a} 280 250)`}>
        <rect x="230" y="250" width={50 + incomingWidth} height="250" fill="#485769"/>
        <path d="M280 425V500" stroke="#f4d776" strokeWidth="3"/>
        <path d="M255 425V500" stroke="white" strokeWidth="2" strokeDasharray="10 8"/>
        <path d="M305 425V500" stroke="white" strokeWidth="2" strokeDasharray="10 8"/>
        {threeEntries && <path d="M330 425V500" stroke="white" strokeWidth="2" strokeDasharray="10 8"/>}
      </g>)}
      <circle cx="280" cy="250" r="168" fill="#485769" stroke="white" strokeWidth="3"/>
      <circle cx="280" cy="250" r="126" fill="none" stroke="white" strokeWidth="2" strokeDasharray="12 10"/>
      <circle cx="280" cy="250" r="84" fill="#abcbb0" stroke="white" strokeWidth="3"/>
      <text x="280" y="245" textAnchor="middle" fill="#244f3b" fontSize="16" fontWeight="700">ROTONDA</text><text x="280" y="267" textAnchor="middle" fill="#244f3b" fontSize="13">Modelo didáctico</text>
      <text x="486" y="238" textAnchor="middle" fontSize="14" fill="#17324c">Derecha</text>
      <text x="280" y="32" textAnchor="middle" fontSize="14" fill="#17324c">De frente</text>
      <text x="65" y="238" textAnchor="middle" fontSize="14" fill="#17324c">Izquierda</text>
      {lane && <rect x={laneX-10} y="425" width="20" height="73" rx="6" fill="#7cbeff" opacity=".5"/>}
      <g transform={`translate(${speed ? 416 : lane ? laneX : 307} ${speed ? 245 : 460}) rotate(${speed ? 0 : 0})`}><rect x="-9" y="-17" width="18" height="34" rx="4" fill="#1769dd" stroke="white" strokeWidth="2"/><rect x="-6" y="-8" width="12" height="8" rx="2" fill="#15364f"/></g>
      {!speed && <g transform="translate(165 180) rotate(140)"><rect x="-9" y="-17" width="18" height="34" rx="4" fill="#dc7f38" stroke="white" strokeWidth="2"/><rect x="-6" y="-8" width="12" height="8" rx="2" fill="#15364f"/></g>}
      <text x="170" y="477" textAnchor="middle" fontSize="13" fill="#17324c">Entrada ↑</text>
    </svg>
    <figcaption>{caption}<small>Esquema simplificado; no representa una rotonda específica de Managua.</small></figcaption>
    {reveal && <div className="roundabout-example-answer"><strong>Aplicación al ejemplo</strong><p>{question.options[question.correctIndex].text}</p></div>}
  </figure>;
}
