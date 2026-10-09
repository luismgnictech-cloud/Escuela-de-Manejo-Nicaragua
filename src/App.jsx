import { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  BookOpenCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Gauge,
  Home,
  Medal,
  Menu,
  Play,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Target,
  TrafficCone,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import questions from './data/questions.json';
import LearningPath from './LearningPath';
import HomePage from './HomePage';
import VisualGuides from './VisualGuides';
import Roundabouts from './Roundabouts';
import RoundaboutExample from './RoundaboutExample';
import { EXAM_QUESTIONS, POINTS_PER_ANSWER, PASS_SCORE, EXAM_MINUTES, scoreExam } from './examRules';

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
  roundabouts: {},
  mastered: {},
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function useInstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() =>
    window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true,
  );

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setDeferredPrompt(null);
    return choice.outcome === 'accepted';
  };

  return {
    canInstall: Boolean(deferredPrompt) && !installed,
    installed,
    install,
  };
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

function Header({ view, setView, canInstall, onInstall }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ['home', 'Inicio', Home],
    ['learning', 'Mi ruta', Play],
    ['exam', 'Prueba', Target],
    ['roundabouts', 'Rotondas', RotateCcw],
    ['guides', 'Guías', BookOpenCheck],
    ['progress', 'Progreso', TrendingUp],
  ];

  const navigate = (next) => {
    setView(next);
    window.history.replaceState(null, '', next === 'guides' ? '#guias' : next === 'learning' ? '#ruta' : next === 'home' ? window.location.pathname + window.location.search : '#'+next);
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
            <button key={id} className={view === id || (id === 'guides' && view.startsWith('guide-')) ? 'active' : ''} onClick={() => navigate(id)}>
              <Icon size={17} /> {label}
            </button>
          ))}
          {canInstall && (
            <button className="install-nav-button" onClick={onInstall}>
              <Download size={17} /> Instalar app
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function HomeView(props) {
  return <HomePage {...props}/>;
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

function QuestionVisual({ question, reveal = false }) {
  if (/rotonda/i.test(question.question)) return <RoundaboutExample question={question} reveal={reveal} />;
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
        <QuestionVisual question={question} reveal={revealed} />
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
  const available = module === 'all' ? questions.length : questions.filter((q) => q.module === module).length;

  return (
    <section className="workspace">
      <div className="workspace-header">
        <span className="eyebrow"><Target size={16} /> Prueba de conocimientos</span>
        <h1>Probá tus conocimientos sin pistas</h1>
        <p>La prueba dura 30 minutos. Las respuestas se revisan únicamente al finalizar.</p>
      </div>
      <div className="setup-card">
        <h2>1. Contenido</h2>
        <ModuleSelector selected={module} onSelect={setModule} />

        <h2>2. Preguntas y puntuación</h2>
        <p>{EXAM_QUESTIONS} preguntas · {POINTS_PER_ANSWER} puntos por respuesta correcta · 100 puntos en total.</p>
        <p>Para aprobar necesitás al menos {PASS_SCORE} puntos: 20 respuestas correctas de 25. Las respuestas incorrectas o sin responder valen 0 puntos.</p>
        {available < EXAM_QUESTIONS && <p role="alert">Este módulo no tiene suficientes preguntas para una prueba de 25.</p>}

        <button className="button primary full-width" disabled={available < EXAM_QUESTIONS} onClick={() => onStart(module)}>
          Comenzar prueba <ChevronRight size={18} />
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
    const summary = { correct, total: session.length, details, ...scoreExam(correct) };
    setResult(summary);
    recordExam(summary);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    const { score, passed } = result;
    return (
      <section className="exam-result">
        <div className="result-card compact">
          <span className="result-icon"><Medal /></span>
          <span className="eyebrow">Prueba finalizada</span>
          <h1>{score} / 100 puntos</h1>
          <h2>{passed ? 'Aprobado' : 'No aprobado'}</h2>
          <p>Mínimo para aprobar: {PASS_SCORE} puntos.</p>
          <p>{result.correct} respuestas correctas de {result.total}.</p>
          <button className="button primary" onClick={onExit}>Hacer otra prueba</button>
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
              <RoundaboutExample question={question} reveal />
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
        <div className="question-meta"><span>{moduleMeta(question.module)?.name}</span><span>Pregunta {index + 1} · {POINTS_PER_ANSWER} puntos</span></div>
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
        <div className="stat-card"><Target /><span>Pruebas</span><strong>{progress.examsCompleted}</strong></div>
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
            <div className="empty-state"><Medal /><strong>Aún no hay errores guardados</strong><p>Completá una práctica o una prueba para ver recomendaciones.</p></div>
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
  const [view, setView] = useState(() => window.location.hash.startsWith('#guia-') ? 'guide-' + window.location.hash.slice(6) : window.location.hash === '#ruta' ? 'learning' : ['#practice','#exam','#progress'].includes(window.location.hash) ? window.location.hash.slice(1) : window.location.hash === '#guias' ? 'guides' : /^(#mapa-|#rg-|#roundabouts)/.test(window.location.hash) ? 'roundabouts' : 'home');
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#guia-')) setView('guide-' + hash.slice(6));
      else if (hash === '#ruta') setView('learning');
      else if (['#practice','#exam','#progress'].includes(hash)) setView(hash.slice(1));
      else if (!hash || hash === '#home') setView('home');
      else if (hash === '#guias') setView('guides');
      else if (/^(#mapa-|#rg-|#roundabouts)/.test(hash)) setView('roundabouts');
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    if (view !== 'roundabouts' || !/^(#mapa-|#rg-)/.test(window.location.hash)) return;
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [view]);
  const [practiceSession, setPracticeSession] = useState(null);
  const [examSession, setExamSession] = useState(null);
  const [progress, setProgress] = useStoredProgress();
  const { canInstall, installed, install } = useInstallApp();

  const mistakeIds = useMemo(() => Object.keys(progress.mistakes), [progress.mistakes]);

  const startPractice = (module = 'all', random = true, mistakesOnly = false) => {
    let pool;
    if (module === 'mistakes' || mistakesOnly) {
      pool = questions.filter((question) => mistakeIds.includes(question.id) && (module === 'mistakes' || question.module === module));
    } else {
      pool = module === 'all' ? questions : questions.filter((question) => question.module === module);
    }
    if (!pool.length) return;
    setPracticeSession(random ? shuffle(pool) : [...pool]);
    setView('practice-session');
    setProgress((current) => ({ ...current, practiceSessions: current.practiceSessions + 1 }));
    window.scrollTo({ top: 0 });
  };

  const startExam = (module) => {
    const pool = module === 'all' ? questions : questions.filter((question) => question.module === module);
    if (pool.length < EXAM_QUESTIONS) return;
    setExamSession(shuffle(pool).slice(0, EXAM_QUESTIONS));
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
        mastered: { ...current.mastered, ...(correct ? { [question.id]: true } : {}) },
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

  const recordExam = ({ correct, total, details, score, passed }) => {
    setProgress((current) => {
      const next = {
        ...current,
        examsCompleted: current.examsCompleted + 1,
        examHistory: [
          { date: new Date().toISOString(), correct, total, score, passed },
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
        next.mastered = { ...next.mastered, ...(isCorrect ? { [question.id]: true } : {}) };
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
  if (view === 'home') {
    content = (
      <HomeView
        setView={setView}
        startPractice={startPractice}
        startLesson={(pool) => {
          setPracticeSession([...pool]);
          setView('practice-session');
          setProgress(current => ({ ...current, practiceSessions: current.practiceSessions + 1 }));
          window.scrollTo({ top: 0 });
        }}
        progress={progress}
        canInstall={canInstall}
        installed={installed}
        onInstall={install}
      />
    );
  }
  if (view === 'learning') content = <LearningPath setView={setView} startPractice={startPractice} progress={progress} startLesson={pool => { setPracticeSession([...pool]); setView('practice-session'); setProgress(current => ({...current, practiceSessions:current.practiceSessions+1})); window.scrollTo({top:0}); }} />;
  if (view === 'guides' || view.startsWith('guide-')) content = <VisualGuides guideId={view.slice(6)} onOpen={id => { setView('guide-' + id); window.scrollTo({ top: 0 }); }} onBack={() => { setView('guides'); window.scrollTo({ top: 0 }); }} />;
  if (view === 'roundabouts') content = <Roundabouts />;
  if (view === 'practice') content = <PracticeSetup onStart={startPractice} mistakeCount={mistakeIds.length} />;
  if (view === 'practice-session' && practiceSession) {
    content = <PracticeSession session={practiceSession} onExit={() => setView('practice')} recordAnswer={recordAnswer} />;
  }
  if (view === 'exam') content = <ExamSetup onStart={startExam} />;
  if (view === 'exam-session' && examSession) {
    content = <ExamSession session={examSession} minutes={EXAM_MINUTES} onExit={() => setView('exam')} recordExam={recordExam} />;
  }
  if (view === 'progress') {
    content = <ProgressView progress={progress} onReview={() => startPractice('mistakes', true)} onReset={resetProgress} />;
  }

  return (
    <div className="app-shell">
      <Header view={view.replace('-session', '')} setView={setView} canInstall={canInstall} onInstall={install} />
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
