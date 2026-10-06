export const CHALLENGES = [
  { id: 'right', name: 'Primera salida', exit: 1, description: 'Entrá desde el sur y salí hacia el este.' },
  { id: 'straight', name: 'Seguir de frente', exit: 2, description: 'Entrá desde el sur y salí hacia el norte.' },
  { id: 'left', name: 'Tercera salida', exit: 3, description: 'Entrá desde el sur y salí hacia el oeste.' },
];
export const SOURCE = 'https://tramitesenlinea.policia.gob.ni/DocT/EnsenanzasTransito/CirculacionenIntersecciones.pdf';
export function validLane(lanes, exit, lane) {
  return lanes === 1 || (exit === 1 ? lane === 'outer' : exit === 3 ? lane === 'inner' : true);
}
export function point(angle, radius) {
  const radians = angle * Math.PI / 180;
  return { x: 250 + Math.cos(radians) * radius, y: 250 + Math.sin(radians) * radius };
}
export function trafficAngle(time, index) { return (150 - time * 24 + index * 120 + 7200) % 360; }
export function safeGap(time) {
  return [0, 1, 2].every(i => { const a = trafficAngle(time, i); return Math.abs(((a - 90 + 540) % 360) - 180) > 40; });
}
