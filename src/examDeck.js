import { EXAM_QUESTIONS } from './examRules.js';
const KEY = 'emn-exam-used-v1';
export function randomized(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function createExam(pool, storage = localStorage, random = Math.random) {
  let used;
  try { const saved = JSON.parse(storage.getItem(KEY) || '[]'); used = new Set(Array.isArray(saved) ? saved : []); } catch { used = new Set(); }
  const available = pool.filter(q => !used.has(q.id));
  if (available.length < EXAM_QUESTIONS) return { questions:null, remaining:available.length };
  const picked = randomized(available,random).slice(0,EXAM_QUESTIONS);
  const formatted = picked.map((q,i) => {
    const option = q.options[q.correctIndex].text;
    const tokens = [...option.matchAll(/[\p{L}\p{N}]+/gu)].filter(m => m[0].length >= 4);
    if (i % 5 === 2 && tokens.length) {
      const token = tokens[Math.floor(random()*tokens.length)];
      return {...q, examFormat:'complete', missingWord:token[0], sentence:option.slice(0,token.index)+'________'+option.slice(token.index+token[0].length)};
    }
    if (i % 5 === 4 && q.options.length > 1) {
      const proposedIndex = random() < .5 ? q.correctIndex : q.options.findIndex((_,idx)=>idx!==q.correctIndex);
      return {...q, examFormat:'boolean', proposedIndex};
    }
    return {...q,examFormat:'choice', optionOrder:randomized(q.options.map((_,idx)=>idx),random)};
  });
  storage.setItem(KEY,JSON.stringify([...used,...picked.map(q=>q.id)]));
  return {questions:formatted,remaining:available.length-EXAM_QUESTIONS};
}
export function normalizeAnswer(value) {
  return value.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.,;:!?¿¡]/g,'').replace(/\s+/g,' ');
}
