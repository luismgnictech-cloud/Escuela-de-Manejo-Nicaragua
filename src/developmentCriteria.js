import questions from './data/questions.json';
import { normalizeAnswer } from './examDeck.js';
// Equivalence is intentionally conservative: unrecognized paraphrases need review.
const synonyms = [
 [/\bdisminuir|bajar|reducir\b/g,'reducir'], [/\bvelocidades\b/g,'velocidad'],
 [/\borillarse|orillarme\b/g,'orillar'], [/\bdetenerse|detenerme|detenga|detener\b/g,'detener'],
 [/\btelefonos?|celulares?|celular\b/g,'telefono'], [/\bretrovisores?\b/g,'retrovisor'],
 [/\bneumaticos?|llantas?\b/g,'llanta'], [/\bdos\b/g,'2'], [/\btres\b/g,'3'],
 [/\btreinta\b/g,'30'], [/\bochenta\b/g,'80'], [/\bsegundas|segundos\b/g,'segundo'],
 [/\bkilometros por hora|km\s*\/\s*h|kmh\b/g,'km/h'],
];
export function canonical(value) {
 let text=normalizeAnswer(value); for(const [pattern,replacement] of synonyms)text=text.replace(pattern,replacement); return text;
}
const isMeta = text => /^(todas|ninguna|ambas)\b.*anteriores/i.test(text.trim());
export const criteria = Object.fromEntries(questions.map(q=>{
 const original=q.options[q.correctIndex].text;
 const expanded=/^todas\b.*anteriores/i.test(original.trim()) ? q.options.filter(o=>!isMeta(o.text)).map(o=>o.text) : [original];
 const ready=!/^ninguna\b.*anteriores/i.test(original.trim());
 return [q.id,{ready, reference:expanded.join('; '), requiredIdeas:expanded, accepted:[expanded.join('; ')], rejected:q.options.filter((o,i)=>i!==q.correctIndex&&!isMeta(o.text)&&!expanded.includes(o.text)).map(o=>o.text), source:q.source.label}];
}));
const overrides={
 'motos-004':{requiredIdeas:['Aplicar la regla de dos segundos'],accepted:['Aplicar la regla de dos segundos','Mantener al menos dos segundos de distancia','Dos segundos','2 segundos'],concepts:[['regla de 2 segundo','2 segundo']],contradictions:['1 segundo','un segundo','medio segundo']},
 'motos-005':{requiredIdeas:['Zonas que no se ven en los espejos retrovisores'],accepted:['Zonas que no se ven en los espejos retrovisores','Son los espacios que no cubren los retrovisores','Areas no visibles en los espejos'],concepts:[['no se ven','no son visibles','no cubren','no se pueden ver','no visibles'],['espejo','retrovisor']],contradictions:['si se ven en los espejos','son visibles en los espejos']},
 'motos-007':{requiredIdeas:['Detenerse y orillarse antes de contestar el teléfono'],accepted:['Detenerme y orillarme antes de contestar el celular','Orillarme y detener la moto para contestar'],concepts:[['detener','parar'],['orillar','a la orilla'],['contestar','responder']],contradictions:['sin detener','seguir conduciendo','mientras conduzco','mientras conduce']},
 'motos-008':{requiredIdeas:['No soltar el manubrio porque se puede perder el control'],accepted:['No, puedo perder el control','No debo soltarlo porque puedo perder el control','No, hay riesgo de perder el control'],concepts:[['no'],['perder el control','perdida de control']],contradictions:['si debo','si puedo','no se pierde el control']},
 'motos-016':{requiredIdeas:['Un pasajero','El pasajero debe ser mayor de ocho años'],accepted:['Un pasajero mayor de ocho años','Solo uno, mayor de 8 años','Uno y debe ser mayor de ocho años'],concepts:[['un pasajero','solo uno','solamente uno'],['mayor de ocho','mayor de 8']],contradictions:['dos pasajeros','2 pasajeros','menor de ocho','menor de 8']},
};
for(const [id,rule] of Object.entries(overrides))criteria[id]={...criteria[id],...rule,accepted:[criteria[id].reference,...rule.accepted]};
export function evaluateDevelopment(question,text) {
 const rule=criteria[question.id];const answer=canonical(text);
 if(!answer)return {status:'incorrect',reason:'Sin respuesta',correct:false};
 if(!rule?.ready)return {status:'pending',reason:'El material requiere un criterio específico de desarrollo.',correct:false};
 if(rule.contradictions?.some(term=>answer.includes(canonical(term))))return {status:'incorrect',reason:'La respuesta contiene una contradicción del criterio.',correct:false};
 if(rule.accepted.some(value=>canonical(value)===answer))return {status:'correct',reason:'Cumple los criterios aceptados.',correct:true};
 if(rule.rejected.some(value=>canonical(value)===answer))return {status:'incorrect',reason:'Coincide con una respuesta incorrecta del material.',correct:false};
 return {status:'pending',reason:'La redacción necesita revisión; no se considera incorrecta automáticamente.',correct:false};
}
