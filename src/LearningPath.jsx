import { Bike, CarFront, ShieldCheck, BookOpenCheck, TrafficCone, Check, Play, Target, RotateCcw, TrendingUp } from 'lucide-react';
import questions from './data/questions.json';
const modules = [
  ['senales', 'Señales de tránsito', TrafficCone],
  ['ley-431', 'Reglas de circulación', BookOpenCheck],
  ['manejo-defensivo', 'Manejo defensivo', ShieldCheck],
  ['mecanica', 'Conocé tu vehículo', CarFront],
  ['motos', 'Seguridad en motocicleta', Bike],
];
export const levels = [
  { id: 'desde-cero', name: 'Desde cero', description: 'Reconocé señales y aprendé los conceptos esenciales.' },
  { id: 'basico', name: 'Básico', description: 'Prepará tu vehículo y desarrollá hábitos de seguridad.' },
  { id: 'intermedio', name: 'Intermedio', description: 'Practicá maniobras, prioridades y decisiones en la vía.' },
  { id: 'avanzado', name: 'Avanzado', description: 'Resolvé situaciones de riesgo y condiciones difíciles.' },
];
// Group by the skill being practiced, rather than the source question order.
export function questionLevel(question) {
  const text = question.question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/emergencia|accidente|choque|colision|derrap|deslumbr|lluvia|niebla|noche|falla|revent|temeraria|advers|alta velocidad/.test(text)) return 'avanzado';
  if (/rotonda|interseccion|adelant|rebas|prioridad|preferencia|curva|girar|giro|frenado|distancia|punto ciego|estacion|cruce/.test(text)) return 'intermedio';
  if (question.module === 'senales' || /que es |que significa|quien es |que son /.test(text)) return 'desde-cero';
  return 'basico';
}
export const lessons = levels.flatMap(level => modules.flatMap(([module, title, Icon]) => {
  const pool = questions.filter(q => q.module === module && questionLevel(q) === level.id);
  return Array.from({length: Math.ceil(pool.length / 10)}, (_, index) => ({
    id: `${level.id}-${module}-${index}`, level: level.id, module, title, Icon, index,
    questions: pool.slice(index * 10, (index + 1) * 10),
  }));
}));
export default function LearningPath({progress, startLesson, startPractice, setView}) {
  const mastered = progress.mastered || {};
  const complete = lesson => lesson.questions.every(q => mastered[q.id]);
  const next = lessons.find(l => !complete(l)) || lessons[0];
  const done = lessons.filter(complete).length;
  const accuracy = progress.totalAnswered ? Math.round(progress.totalCorrect / progress.totalAnswered * 100) : 0;
  return <section className="learning-path" aria-label="Ruta de aprendizaje">
    <div className="path-stats"><span><Check size={20}/><strong>{done}/{lessons.length}</strong> completadas</span><span><Target size={20}/><strong>{accuracy}%</strong> aciertos</span><button onClick={() => setView('progress')}><TrendingUp size={20}/> Mi progreso</button></div>
    <header className="path-heading"><span>TU RUTA DE APRENDIZAJE</span><h1>Desde cero hasta avanzado</h1><p>Prácticas de hasta 10 preguntas. Respondé correctamente cada pregunta para completar una etapa.</p></header>
    <button className="path-continue button primary" onClick={() => startLesson(next.questions)}>Continuar <Play size={18}/></button>
    <div className="path-map">
      {levels.map((level, group) => <section className="path-unit" key={level.id}>
        <h2><small>NIVEL {group + 1}</small>{level.name}<span className="path-level-description">{level.description}</span></h2>
        <div className="path-nodes">{lessons.filter(l => l.level === level.id).map((lesson, i, list) => {
          const completed = complete(lesson); const active = lesson.id === next.id; const Icon = lesson.Icon;
          const count = lesson.questions.filter(q => mastered[q.id]).length;
          return <div className={`path-step position-${i % 4}${active ? ' current' : ''}${completed ? ' completed' : ''}`} key={lesson.id}>
            {i < list.length - 1 && <span className="path-connector" aria-hidden="true"/>}
            {active && <span className="path-bubble">CONTINUAR</span>}
            <button className="path-node" onClick={() => startLesson(lesson.questions)} aria-label={`${level.name}, ${lesson.title}, etapa ${i + 1}, ${completed ? 'completada' : `${count} de ${lesson.questions.length} preguntas dominadas`}`} aria-current={active ? 'step' : undefined}>{completed ? <Check/> : <Icon/>}</button>
            <strong>{lesson.title}</strong><span className="path-stage-label">Etapa {i + 1}</span><small>{count} de {lesson.questions.length} dominadas</small>
          </div>;
        })}</div>
      </section>)}
      <section className="path-finish"><Target size={36}/><h2>Tu siguiente desafío</h2><p>Poné a prueba lo aprendido: 25 preguntas en 30 minutos.</p><button className="button primary" onClick={() => setView('exam')}>Hacer prueba</button><button className="button secondary" onClick={() => setView('roundabouts')}>Practicar rotondas</button></section>
    </div>
    {Object.keys(progress.mistakes).length > 0 && <button className="path-review button secondary" onClick={() => startPractice('mistakes')}><RotateCcw size={18}/> Reforzar {Object.keys(progress.mistakes).length} preguntas</button>}
  </section>;
}
