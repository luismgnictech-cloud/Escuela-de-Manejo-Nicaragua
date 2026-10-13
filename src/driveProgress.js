export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
export const BACKUP_NAME = 'escuela-manejo-progreso-v1.json';
const API = 'https://www.googleapis.com/drive/v3/files';
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const count = value => Number.isSafeInteger(value) && value >= 0;
const safeKeys = value => object(value) && Object.keys(value).every(k => !['__proto__','constructor','prototype'].includes(k));

export function validateBackup(value) {
  const p = value?.progress;
  if (value?.schema !== 1 || !object(p) || !['totalAnswered','totalCorrect','practiceSessions','examsCompleted'].every(k => count(p[k])) || p.totalCorrect > p.totalAnswered) throw new Error('La copia de progreso no es compatible.');
  if (!safeKeys(p.byModule) || !Object.values(p.byModule).every(m => object(m) && count(m.answered) && count(m.correct) && m.correct <= m.answered)) throw new Error('La copia contiene módulos inválidos.');
  if (!safeKeys(p.mistakes) || !Object.values(p.mistakes).every(count) || !safeKeys(p.mastered) || !Object.values(p.mastered).every(v => typeof v === 'boolean') || !safeKeys(p.roundabouts)) throw new Error('La copia contiene datos inválidos.');
  if (!Array.isArray(p.examHistory) || p.examHistory.length > 20 || !p.examHistory.every(h => object(h) && typeof h.date === 'string' && Number.isFinite(Date.parse(h.date)) && count(h.correct) && count(h.total) && h.correct <= h.total)) throw new Error('El historial de pruebas no es válido.');
  if (!Array.isArray(value.usedQuestions) || !value.usedQuestions.every(id => typeof id === 'string' || Number.isSafeInteger(id))) throw new Error('El historial de preguntas no es válido.');
  return value;
}
export function fingerprint(value) {
  const stable = v => Array.isArray(v) ? v.map(stable) : object(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k,stable(v[k])])) : v;
  return JSON.stringify(stable({progress:value.progress,usedQuestions:[...new Set(value.usedQuestions)].sort()}));
}
export function makeBackup(progress, storage = localStorage) {
  let usedQuestions = [];
  try { const parsed = JSON.parse(storage.getItem('emn-exam-used-v1') || '[]'); if (Array.isArray(parsed)) usedQuestions = parsed; } catch { /* Keep the local progress available even if the deck is corrupt. */ }
  return validateBackup({schema:1,progress,usedQuestions,savedAt:new Date().toISOString()});
}
export function restoreBackup(backup, setProgress, storage = localStorage) {
  validateBackup(backup);
  // Keep already used local questions when changing devices or restoring an older copy.
  const local = makeBackup(backup.progress,storage).usedQuestions;
  storage.setItem('emn-exam-used-v1',JSON.stringify([...new Set([...local,...backup.usedQuestions])]));
  setProgress(backup.progress);
  window.dispatchEvent(new Event('emn-deck-change'));
}
export class DriveProgress {
  constructor(token, fetcher = fetch) { this.token = token; this.fetcher = fetcher; }
  async request(url, options = {}) {
    const response = await this.fetcher(url,{...options,headers:{...options.headers,Authorization:`Bearer ${this.token}`},signal:AbortSignal.timeout(20000)});
    if (!response.ok) {
      if (response.status === 401) throw new Error('Tu sesión de Google venció. Volvé a conectar para guardar.');
      if (response.status === 403) throw new Error('Google no permitió el acceso. Revisá el permiso de Drive o intentá más tarde.');
      throw new Error('No se pudo sincronizar con Drive. Tu progreso sigue guardado en este dispositivo.');
    }
    return response;
  }
  async latest() {
    const query = new URLSearchParams({spaces:'appDataFolder',q:`trashed = false and name = '${BACKUP_NAME}'`,orderBy:'modifiedTime desc',pageSize:'1',fields:'files(id,modifiedTime)'});
    const {files} = await (await this.request(`${API}?${query}`)).json();
    if (!files?.length) return null;
    const response = await this.request(`${API}/${encodeURIComponent(files[0].id)}?alt=media`);
    const text = await response.text();
    if (text.length > 1000000) throw new Error('La copia de progreso es demasiado grande.');
    let backup; try { backup = validateBackup(JSON.parse(text)); } catch { throw new Error('La copia de Drive no es compatible. Tu progreso local se conserva.'); }
    return {...files[0],backup};
  }
  async save(backup) {
    validateBackup(backup);
    // Immutable snapshots prevent simultaneous devices from overwriting each other's copy.
    const boundary = `emn_${crypto.randomUUID()}`;
    const metadata = {name:BACKUP_NAME,mimeType:'application/json',parents:['appDataFolder']};
    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(backup)}\r\n--${boundary}--`;
    return (await this.request('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime',{method:'POST',headers:{'Content-Type':`multipart/related; boundary=${boundary}`},body})).json();
  }
}
let loading;
export function loadGoogleIdentity() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!loading) loading = new Promise((resolve,reject) => {
    const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    const timeout = setTimeout(() => { script.remove(); loading = null; reject(new Error('Google no respondió. Revisá tu conexión e intentá de nuevo.')); },15000);
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = () => { clearTimeout(timeout); script.remove(); loading = null; reject(new Error('No se pudo cargar Google. Revisá tu conexión.')); };
    document.head.appendChild(script);
  });
  return loading;
}
