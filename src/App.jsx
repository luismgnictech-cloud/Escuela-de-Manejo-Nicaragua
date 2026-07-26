import { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  BookOpenCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Gauge,
  Home,
  Medal,
  Menu,
  Play,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  Target,
  TrafficCone,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import questions from './data/questions.json';

const MODULES = [
  {
    id: 'motos',
    name: 'Motocicletas',
    short: 'Categorías 1 y 2',
    description: 'Seguridad, postura, frenado, curvas y circulación en motocicleta.',
    icon: Bike,
  },
  {
    id: 'mecanica',
    name: 'Mecánica',
    short: 'Vehículo liviano',
    description: 'Revisión diaria, frenos, tablero, llantas y conducción del vehículo.',
    icon: CarFront,
  },
  {
    id: 'manejo-defensivo',
    name: 'Manejo defensivo',
    short: 'Todas las categorías',
    description: 'Prevención, distancia, intersecciones, curvas y condiciones adversas.',
    icon: ShieldCheck,
  },
  {
    id: 'ley-431',
    name: 'Ley 431',
    short: 'Normativa vial',
    description: 'Conceptos, infracciones, velocidades, licencias y reglas de circulación.',
    icon: BookOpenCheck,
  },
  {
    id: 'senales',
    name: 'Señales de tránsito',
    short: 'Teoría visual',
    description: 'Señales verticales, horizontales, agentes, semáforos y marcas viales.',
    icon: TrafficCone,
  },
];

const EMPTY_PROGRESS = {
  totalAnswered: 0,
  totalCorrect: 0,
  practiceSessions: 0,
  examsCompleted: 0,
  byModule: {},
  mistakes: {},
  examHistory: [],
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function useStoredProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem('emn-progress-v1');
      return stored ? { ...EMPTY_PROGRESS, ...JSON.parse(stored) } : EMPTY_PROGRESS;
    } catch {
      return EMPTY_PROGRESS;
    }
  });

  useEffect(() => {
    localStorage.setItem('emn-progress-v1', JSON.stringify(progress));
  }, [progress]);

  return [progress, setProgress];
}

function assetUrl(path) {
  return path ? `${import.meta.env.BASE_URL}${path}` : '';
}

function moduleMeta(id) {
  return MODULES.find((module) => module.id === id);
}

function Header({ view, setView }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ['home', 'Inicio', Home],
    ['practice', 'Practicar', Play],
    ['exam', 'Simulacro', Target],
    ['progress', 'Progreso', TrendingUp],
  ];

  const navigate = (next) => {
    setView(next);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="Ir al inicio">
          <span className="brand-mark"><TrafficCone size={24} /></span>
          <span>
            <strong>Escuela de Manejo</strong>
            <small>Nicaragua</small>
          </span>
        </button>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? 'main-nav open' : 'main-nav'}>
          {nav.map(([id, label, Icon]) => (
            <button key={id} className={view === id ? 'active' : ''} onClick={() => navigate(id)}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HomeView({ setView, startPractice, progress }) {
  const totalQuestions = questions.length;
  const accuracy = progress.totalAnswered
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><ShieldCheck size={16} /> Preparación para el examen teórico</span>
          <h1>Estudiá, practicá y medí tu progreso antes del examen.</h1>
          <p>
            Una plataforma móvil con preguntas oficiales organizadas por tema, práctica inmediata,
            simulacros y revisión de errores.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => setView('practice')}>
              Empezar a practicar <ChevronRight size={18} />
            </button>
            <button className="button secondary" onClick={() => setView('exam')}>
              Hacer un simulacro
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat main-stat">
            <span>Banco disponible</span>
            <strong>{totalQuestions}</strong>
            <small>preguntas verificadas</small>
          </div>
          <div className="mini-stats">
            <div><strong>{MODULES.length}</strong><span>módulos</span></div>
            <div><strong>{progress.totalAnswered}</strong><span>respondidas</span></div>
            <div><strong>{accuracy}%</strong><span>aciertos</span></div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Temario completo</span>
            <h2>Elegí un módulo</h2>
          </div>
          <p>Las respuestas correctas se toman de las opciones resaltadas en los documentos fuente.</p>
        </div>

        <div className="module-grid">
          {MODULES.map((module) => {
            const Icon = module.icon;
            const count = questions.filter((question) => question.module === module.id).length;
            const moduleProgress = progress.byModule[module.id] || { answered: 0, correct: 0 };
            const percentage = moduleProgress.answered
              ? Math.round((moduleProgress.correct / moduleProgress.answered) * 100)
              : 0;
            return (
              <article className="module-card" key={module.id}>
                <div className="module-card-top">
                  <span className="module-icon"><Icon /></span>
                  <span className="question-count">{count} preguntas</span>
                </div>
                <h3>{module.name}</h3>
                <span className="module-short">{module.short}</span>
                <p>{module.description}</p>
                <div className="module-progress">
                  <div><span>Rendimiento</span><strong>{percentage}%</strong></div>
                  <div className="progress-track"><span style={{ width: `${percentage}%` }} /></div>
                </div>
                <button className="text-button" onClick={() => startPractice(module.id)}>
                  Practicar este módulo <ChevronRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="feature-strip">
        <div><CheckCircle2 /><strong>Corrección inmediata</strong><span>Con fuente y página del material.</span></div>
        <div><Shuffle /><strong>Preguntas aleatorias</strong><span>Para evitar memorizar el orden.</span></div>
        <div><Medal /><strong>Progreso local</strong><span>Se guarda en este navegador.</span></div>
      </section>
    </>
  );
}

function ModuleSelector({ selected, onSelect, includeAll = true }) {
  return (
    <div className="selector-grid">
      {includeAll && (
        <button className={selected === 'all' ? 'selector-card selected' : 'selector-card'} onClick={() => onSelect('all')}>
          <span className="selector-icon"><Shuffle /></span>
          <strong>Todos los módulos</strong>
          <small>{questions.length} preguntas disponibles</small>
        </button>
      )}
      {MODULES.map((module) => {
        const Icon = module.icon;
        const count = questions.filter((question) => question.module === module.id).length;
        return (
          <button key={module.id} className={selected === module.id ? 'selector-card selected' : 'selector-card'} onClick={() => onSelect(module.id)}>
            <span className="selector-icon"><Icon /></span>
            <strong>{module.name}</strong>
            <small>{count} preguntas</small>
          </button>
        );
      })}
    </div>
  );
}

function PracticeSetup({ onStart, mistakeCount }) {
  const [module, setModule] = useState('all');
  const [random, setRandom] = useState(true);

  return (
    <section className="workspace">
      <div className="workspace-header">
        <span className="eyebrow"><Play size={16} /> Modo práctica</span>
        <h1>Aprendé con corrección inmediata</h1>
        <p>Respondé una pregunta, revisá la opción oficial y avanzá a tu ritmo.</p>
      </div>

      <div className="setup-card">
        <h2>1. Seleccioná el contenido</h2>
        <ModuleSelector selected={module} onSelect={setModule} />

        <h2>2. Elegí el orden</h2>
        <div className="toggle-row">
          <button className={random ? 'option-tile selected' : 'option-tile'} onClick={() => setRandom(true)}>
            <Shuffle /> <span><strong>Aleatorio</strong><small>Mezcla las preguntas</small></span>
          </button>
          <button className={!random ? 'option-tile selected' : 'option-tile'} onClick={() => setRandom(false)}>
            <BookOpenCheck /> <span><strong>Orden del material</strong><small>Sigue la numeración original</small></span>
          </button>
        </div>

        <div className="setup-actions">
          <button className="button primary" onClick={() => onStart(module, random)}>
            Iniciar práctica <ChevronRight size={18} />
          </button>
          {mistakeCount > 0 && (
            <button className="button secondary" onClick={() => onStart('mistakes', true)}>
              Repasar {mistakeCount} preguntas falladas
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function QuestionVisual({ question }) {
  if (!question.image) return null;
  return (
    <div className="question-visual">
      <img src={assetUrl(question.image)} alt={question.imageAlt || 'Ilustración de la pregunta'} />
    </div>
  );
}

function AnswerOptions({ question, selected, onSelect, reveal = false, disabled = false }) {
  return (
    <div className="answer-list">
      {question.options.map((option, index) => {
        const isSelected = selected === index;
        const isCorrect = question.correctIndex === index;
        let className = 'answer-option';
        if (isSelected) className += ' selected';
        if (reveal && isCorrect) className += ' correct';
        if (reveal && isSelected && !isCorrect) className += ' incorrect';
        return (
          <button key={`${question.id}-${index}`} className={className} onClick={() => onSelect(index)} disabled={disabled}>
            <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
            <span>{option.text}</span>
            {reveal && isCorrect && <CheckCircle2 className="answer-status" size={20} />}
            {reveal && isSelected && !isCorrect && <XCircle className="answer-status" size={20} />}
          </button>
        );
      })}
    </div>
  );
}

function PracticeSession({ session, onExit, recordAnswer }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = session[index];
  const progress = ((index + (revealed ? 1 : 0)) / session.length) * 100;

  const check = () => {
    if (selected === null || revealed) return;
    const correct = selected === question.correctIndex;
    setRevealed(true);
    if (correct) setCorrectCount((value) => value + 1);
    recordAnswer(question, correct, 'practice');
  };

  const next = () => {
    if (index === session.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setRevealed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (finished) {
    const percentage = Math.round((correctCount / session.length) * 100);
    return (
      <section className="result-card">
        <span className="result-icon"><Medal /></span>
        <span className="eyebrow">Práctica finalizada</span>
        <h1>{percentage}% de aciertos</h1>
        <p>Respondiste correctamente {correctCount} de {session.length} preguntas.</p>
        <div className="result-actions">
          <button className="button primary" onClick={onExit}>Volver a practicar</button>
          <button className="button secondary" onClick={() => window.location.reload()}><RotateCcw size={17} /> Reiniciar</button>
        </div>
      </section>
    );
  }

  const meta = moduleMeta(question.module);
  return (
    <section className="question-workspace">
      <div className="session-toolbar">
        <button className="back-button" onClick={onExit}>Salir</button>
        <div className="session-position">Pregunta {index + 1} de {session.length}</div>
        <div className="session-score"><CheckCircle2 size={17} /> {correctCount}</div>
      </div>
      <div className="session-progress"><span style={{ width: `${progress}%` }} /></div>

      <article className="question-card">
        <div className="question-meta">
          <span>{meta?.name}</span>
          <span>Pregunta {question.number}</span>
        </div>
        <h1>{question.question}</h1>
        <QuestionVisual question={question} />
        <AnswerOptions question={question} selected={selected} onSelect={setSelected} reveal={revealed} disabled={revealed} />

        {revealed && (
          <div className={selected === question.correctIndex ? 'feedback correct-feedback' : 'feedback wrong-feedback'}>
            {selected === question.correctIndex ? <CheckCircle2 /> : <CircleAlert />}
            <div>
              <strong>{selected === question.correctIndex ? 'Respuesta correcta' : 'La respuesta oficial es otra'}</strong>
              <p>{question.options[question.correctIndex].text}</p>
              <small>Fuente: {question.source.label}</small>
            </div>
          </div>
        )}

        <div className="question-actions">
          {!revealed ? (
            <button className="button primary" disabled={selected === null} onClick={check}>Comprobar respuesta</button>
          ) : (
            <button className="button primary" onClick={next}>
              {index === session.length - 1 ? 'Ver resultado' : 'Siguiente pregunta'} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </article>
    </section>
  );
}

function ExamSetup({ onStart }) {
  const [module, setModule] = useState('all');
  const [amount, setAmount] = useState(20);
  const [minutes, setMinutes] = useState(20);
  const available = module === 'all' ? questions.length : questions.filter((q) => q.module === module).length;

  return (
    <section className="workspace">
      <div className="workspace-header">
        <span className="eyebrow"><Target size={16} /> Simulador de examen</span>
        <h1>Probá tus conocimientos sin pistas</h1>
        <p>Las respuestas se revisan únicamente al finalizar el simulacro.</p>
      </div>
      <div className="setup-card">
        <h2>1. Contenido</h2>
        <ModuleSelector selected={module} onSelect={setModule} />

        <h2>2. Cantidad de preguntas</h2>
        <div className="pill-options">
          {[10, 20, 30, 40].filter((value) => value <= available).map((value) => (
            <button key={value} className={amount === value ? 'selected' : ''} onClick={() => setAmount(value)}>{value}</button>
          ))}
        </div>

        <h2>3. Tiempo</h2>
        <div className="pill-options">
          {[10, 20, 30].map((value) => (
            <button key={value} className={minutes === value ? 'selected' : ''} onClick={() => setMinutes(value)}>{value} min</button>
          ))}
        </div>

        <button className="button primary full-width" onClick={() => onStart(module, Math.min(amount, available), minutes)}>
          Comenzar simulacro <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

function ExamSession({ session, minutes, onExit, recordExam }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(minutes * 60);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (result) return undefined;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [result]);

  useEffect(() => {
    if (remaining === 0 && !result) submit();
  }, [remaining]);

  const submit = () => {
    const correct = session.filter((question) => answers[question.id] === question.correctIndex).length;
    const details = session.map((question) => ({
      question,
      selected: answers[question.id] ?? null,
      correct: answers[question.id] === question.correctIndex,
    }));
    const summary = { correct, total: session.length, details };
    setResult(summary);
    recordExam(summary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    const percentage = Math.round((result.correct / result.total) * 100);
    return (
      <section className="exam-result">
        <div className="result-card compact">
          <span className="result-icon"><Medal /></span>
          <span className="eyebrow">Simulacro finalizado</span>
          <h1>{percentage}%</h1>
          <p>{result.correct} respuestas correctas de {result.total}.</p>
          <button className="button primary" onClick={onExit}>Hacer otro simulacro</button>
        </div>
        <div className="review-list">
          <h2>Revisión</h2>
          {result.details.map(({ question, selected, correct }, detailIndex) => (
            <article className={correct ? 'review-item correct-review' : 'review-item wrong-review'} key={question.id}>
              <div className="review-heading">
                <span>{correct ? <CheckCircle2 /> : <XCircle />}</span>
                <div><small>Pregunta {detailIndex + 1}</small><strong>{question.question}</strong></div>
              </div>
              {!correct && (
                <p>Tu respuesta: {selected === null ? 'Sin responder' : question.options[selected]?.text}</p>
              )}
              <p>Respuesta oficial: <strong>{question.options[question.correctIndex].text}</strong></p>
              <small>Fuente: {question.source.label}</small>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const question = session[index];
  const answered = Object.keys(answers).length;
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');

  return (
    <section className="question-workspace">
      <div className="session-toolbar exam-toolbar">
        <button className="back-button" onClick={onExit}>Salir</button>
        <div className="session-position">{answered}/{session.length} respondidas</div>
        <div className={remaining < 60 ? 'timer urgent' : 'timer'}><Clock3 size={17} /> {min}:{sec}</div>
      </div>
      <div className="session-progress"><span style={{ width: `${(answered / session.length) * 100}%` }} /></div>

      <article className="question-card">
        <div className="question-meta"><span>{moduleMeta(question.module)?.name}</span><span>Pregunta {index + 1}</span></div>
        <h1>{question.question}</h1>
        <QuestionVisual question={question} />
        <AnswerOptions
          question={question}
          selected={answers[question.id] ?? null}
          onSelect={(option) => setAnswers((current) => ({ ...current, [question.id]: option }))}
        />
        <div className="question-actions split-actions">
          <button className="button secondary" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Anterior</button>
          {index < session.length - 1 ? (
            <button className="button primary" onClick={() => setIndex((value) => value + 1)}>Siguiente <ChevronRight size={18} /></button>
          ) : (
            <button className="button primary" onClick={submit}>Finalizar examen</button>
          )}
        </div>
      </article>

      <div className="question-map">
        {session.map((item, mapIndex) => (
          <button
            key={item.id}
            className={`${mapIndex === index ? 'current ' : ''}${answers[item.id] !== undefined ? 'answered' : ''}`}
            onClick={() => setIndex(mapIndex)}
          >
            {mapIndex + 1}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProgressView({ progress, onReview, onReset }) {
  const accuracy = progress.totalAnswered ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;
  const mistakeEntries = Object.entries(progress.mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({ question: questions.find((item) => item.id === id), count }))
    .filter((item) => item.question);

  return (
    <section className="workspace">
      <div className="workspace-header">
        <span className="eyebrow"><TrendingUp size={16} /> Tu progreso</span>
        <h1>Identificá qué dominás y qué debés repasar</h1>
        <p>Los datos se almacenan únicamente en este navegador.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><Gauge /><span>Aciertos</span><strong>{accuracy}%</strong></div>
        <div className="stat-card"><CheckCircle2 /><span>Respondidas</span><strong>{progress.totalAnswered}</strong></div>
        <div className="stat-card"><Target /><span>Simulacros</span><strong>{progress.examsCompleted}</strong></div>
        <div className="stat-card"><CircleAlert /><span>Por repasar</span><strong>{Object.keys(progress.mistakes).length}</strong></div>
      </div>

      <div className="progress-layout">
        <div className="progress-panel">
          <h2>Rendimiento por módulo</h2>
          {MODULES.map((module) => {
            const data = progress.byModule[module.id] || { answered: 0, correct: 0 };
            const value = data.answered ? Math.round((data.correct / data.answered) * 100) : 0;
            return (
              <div className="module-row" key={module.id}>
                <div><strong>{module.name}</strong><span>{data.answered} respuestas</span></div>
                <div className="module-row-bar"><span style={{ width: `${value}%` }} /></div>
                <strong>{value}%</strong>
              </div>
            );
          })}
        </div>

        <div className="progress-panel">
          <div className="panel-heading"><h2>Errores frecuentes</h2>{mistakeEntries.length > 0 && <button onClick={onReview}>Repasar</button>}</div>
          {mistakeEntries.length === 0 ? (
            <div className="empty-state"><Medal /><strong>Aún no hay errores guardados</strong><p>Completá una práctica o un simulacro para ver recomendaciones.</p></div>
          ) : (
            <div className="mistake-list">
              {mistakeEntries.map(({ question, count }) => (
                <div key={question.id}>
                  <span>{moduleMeta(question.module)?.name}</span>
                  <p>{question.question}</p>
                  <strong>{count} {count === 1 ? 'fallo' : 'fallos'}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="danger-link" onClick={onReset}>Borrar progreso de este navegador</button>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState('home');
  const [practiceSession, setPracticeSession] = useState(null);
  const [examSession, setExamSession] = useState(null);
  const [examMinutes, setExamMinutes] = useState(20);
  const [progress, setProgress] = useStoredProgress();

  const mistakeIds = useMemo(() => Object.keys(progress.mistakes), [progress.mistakes]);

  const startPractice = (module = 'all', random = true) => {
    let pool;
    if (module === 'mistakes') {
      pool = questions.filter((question) => mistakeIds.includes(question.id));
    } else {
      pool = module === 'all' ? questions : questions.filter((question) => question.module === module);
    }
    if (!pool.length) return;
    setPracticeSession(random ? shuffle(pool) : [...pool]);
    setView('practice-session');
    setProgress((current) => ({ ...current, practiceSessions: current.practiceSessions + 1 }));
    window.scrollTo({ top: 0 });
  };

  const startExam = (module, amount, minutes) => {
    const pool = module === 'all' ? questions : questions.filter((question) => question.module === module);
    setExamSession(shuffle(pool).slice(0, amount));
    setExamMinutes(minutes);
    setView('exam-session');
    window.scrollTo({ top: 0 });
  };

  const recordAnswer = (question, correct) => {
    setProgress((current) => {
      const moduleData = current.byModule[question.module] || { answered: 0, correct: 0 };
      const mistakes = { ...current.mistakes };
      if (correct) delete mistakes[question.id];
      else mistakes[question.id] = (mistakes[question.id] || 0) + 1;
      return {
        ...current,
        totalAnswered: current.totalAnswered + 1,
        totalCorrect: current.totalCorrect + (correct ? 1 : 0),
        mistakes,
        byModule: {
          ...current.byModule,
          [question.module]: {
            answered: moduleData.answered + 1,
            correct: moduleData.correct + (correct ? 1 : 0),
          },
        },
      };
    });
  };

  const recordExam = ({ correct, total, details }) => {
    setProgress((current) => {
      const next = {
        ...current,
        examsCompleted: current.examsCompleted + 1,
        examHistory: [
          { date: new Date().toISOString(), correct, total },
          ...current.examHistory,
        ].slice(0, 20),
      };
      details.forEach(({ question, correct: isCorrect }) => {
        const moduleData = next.byModule[question.module] || { answered: 0, correct: 0 };
        next.totalAnswered += 1;
        next.totalCorrect += isCorrect ? 1 : 0;
        next.byModule = {
          ...next.byModule,
          [question.module]: {
            answered: moduleData.answered + 1,
            correct: moduleData.correct + (isCorrect ? 1 : 0),
          },
        };
        next.mistakes = { ...next.mistakes };
        if (isCorrect) delete next.mistakes[question.id];
        else next.mistakes[question.id] = (next.mistakes[question.id] || 0) + 1;
      });
      return next;
    });
  };

  const resetProgress = () => {
    if (window.confirm('¿Querés borrar todo el progreso guardado en este navegador?')) {
      setProgress(EMPTY_PROGRESS);
    }
  };

  let content;
  if (view === 'home') content = <HomeView setView={setView} startPractice={startPractice} progress={progress} />;
  if (view === 'practice') content = <PracticeSetup onStart={startPractice} mistakeCount={mistakeIds.length} />;
  if (view === 'practice-session' && practiceSession) {
    content = <PracticeSession session={practiceSession} onExit={() => setView('practice')} recordAnswer={recordAnswer} />;
  }
  if (view === 'exam') content = <ExamSetup onStart={startExam} />;
  if (view === 'exam-session' && examSession) {
    content = <ExamSession session={examSession} minutes={examMinutes} onExit={() => setView('exam')} recordExam={recordExam} />;
  }
  if (view === 'progress') {
    content = <ProgressView progress={progress} onReview={() => startPractice('mistakes', true)} onReset={resetProgress} />;
  }

  return (
    <div className="app-shell">
      <Header view={view.replace('-session', '')} setView={setView} />
      <main>{content}</main>
      <footer>
        <div>
          <strong>Escuela de Manejo Nicaragua</strong>
          <span>Material de práctica para fines educativos.</span>
        </div>
        <p>Verificá siempre la normativa vigente y las indicaciones oficiales de la Policía Nacional.</p>
      </footer>
    </div>
  );
}
