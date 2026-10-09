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
  const formats = randomized([...Array(10).fill('multiple'), ...Array(5).fill('boolean'), ...Array(10).fill('development')], random);
  const formatted = picked.map((q,index)=>{
    if(formats[index] !== 'boolean') return {...q,examFormat:formats[index]};
    const candidates=q.options.map((option,i)=>({text:option.text,correct:i===q.correctIndex})).filter(option=>! /^(todas|ninguna|ambas)\b.*anteriores/i.test(option.text));
    const statement=candidates[Math.floor(random()*candidates.length)];
    return {...q,examFormat:'boolean',statement:statement.text,statementCorrect:statement.correct};
  });
  storage.setItem(KEY,JSON.stringify([...used,...picked.map(q=>q.id)]));
  return {questions:formatted,remaining:available.length-EXAM_QUESTIONS};
}
export function normalizeAnswer(value) {
  return value.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.,;:!?¿¡]/g,'').replace(/\s+/g,' ');
}
