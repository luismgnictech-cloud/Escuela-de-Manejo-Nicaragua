import { Bike, CarFront, ShieldCheck, BookOpenCheck, TrafficCone, Check, Play, Target, RotateCcw, TrendingUp } from 'lucide-react';
import questions from './data/questions.json';
const modules = [
  ['senales', 'Señales de tránsito', TrafficCone],
  ['ley-431', 'Reglas de circulación', BookOpenCheck],
  ['manejo-defensivo', 'Manejo defensivo', ShieldCheck],
  ['mecanica', 'Conocé tu vehículo', CarFront],
  ['motos', 'Seguridad en motocicleta', Bike],
];
export const lessons = modules.flatMap(([module, title, Icon]) => {
  const pool = questions.filter(q => q.module === module);
  return Array.from({length: Math.ceil(pool.length / 10)}, (_, index) => ({
    id: `${module}-${index}`, module, title, Icon, index,
    questions: pool.slice(index * 10, (index + 1) * 10),
  }));
});
export default function LearningPath({progress, startLesson, startPractice, setView}) {
  const mastered = progress.mastered || {};
  const complete = lesson => lesson.questions.every(q => mastered[q.id]);
  const next = lessons.find(l => !complete(l)) || lessons[0];
  const done = lessons.filter(complete).length;
  const accuracy = progress.totalAnswered ? Math.round(progress.totalCorrect / progress.totalAnswered * 100) : 0;
  return <section className="learning-path" aria-label="Ruta de aprendizaje">
    <div className="path-stats"><span><Check size={20}/><strong>{done}</strong> etapas</span><span><Target size={20}/><strong>{accuracy}%</strong> aciertos</span><button onClick={() => setView('progress')}><TrendingUp size={20}/> Mi progreso</button></div>
    <header className="path-heading"><span>TU RUTA DE APRENDIZAJE</span><h1>Aprendé a conducir, paso a paso</h1><p>Prácticas de hasta 10 preguntas. Respondé correctamente cada pregunta para completar una etapa.</p></header>
    <button className="path-continue button primary" onClick={() => startLesson(next.questions)}>Continuar <Play size={18}/></button>
    <div className="path-map">
      {modules.map(([module, title], group) => <section className="path-unit" key={module}>
        <h2><small>MÓDULO {group + 1}</small>{title}</h2>
        <div className="path-nodes">{lessons.filter(l => l.module === module).map((lesson, i, list) => {
          const completed = complete(lesson); const active = lesson.id === next.id; const Icon = lesson.Icon;
          const count = lesson.questions.filter(q => mastered[q.id]).length;
          return <div className={`path-step position-${i % 4}${active ? ' current' : ''}${completed ? ' completed' : ''}`} key={lesson.id}>
            {i < list.length - 1 && <span className="path-connector" aria-hidden="true"/>}
            {active && <span className="path-bubble">CONTINUAR</span>}
            <button className="path-node" onClick={() => startLesson(lesson.questions)} aria-label={`${title}, etapa ${i + 1}, ${completed ? 'completada' : `${count} de ${lesson.questions.length} preguntas dominadas`}`} aria-current={active ? 'step' : undefined}>{completed ? <Check/> : <Icon/>}</button>
            <strong>Etapa {i + 1}</strong><small>{count}/{lesson.questions.length}</small>
          </div>;
        })}</div>
      </section>)}
      <section className="path-finish"><Target size={36}/><h2>Tu siguiente desafío</h2><p>Prepará tu examen: 25 preguntas en 30 minutos.</p><button className="button primary" onClick={() => setView('exam')}>Hacer simulacro</button><button className="button secondary" onClick={() => setView('roundabouts')}>Practicar rotondas</button></section>
    </div>
    {Object.keys(progress.mistakes).length > 0 && <button className="path-review button secondary" onClick={() => startPractice('mistakes')}><RotateCcw size={18}/> Reforzar {Object.keys(progress.mistakes).length} preguntas</button>}
  </section>;
}
