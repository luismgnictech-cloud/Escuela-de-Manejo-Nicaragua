import { useEffect, useRef, useState } from 'react';
import { Cloud, LogOut, RefreshCw } from 'lucide-react';
import { DriveProgress, DRIVE_SCOPE, loadGoogleIdentity, makeBackup, fingerprint, restoreBackup } from './driveProgress';
import './drive-progress.css';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function useDriveProgress(progress, setProgress) {
  const [state,setState] = useState({ready:false,busy:false,account:null,message:'',conflict:null,active:false});
  const [deckVersion,setDeckVersion] = useState(0);
  const session = useRef(null); const current = useRef(progress); current.current = progress;
  const baseline = useRef(null); const saved = useRef(null); const operation = useRef(false); const generation = useRef(0);
  const update = patch => setState(s => ({...s,...patch}));
  useEffect(() => {
    if (CLIENT_ID) loadGoogleIdentity().then(()=>update({ready:true})).catch(e=>update({message:e.message}));
    const changed = () => setDeckVersion(v=>v+1);
    window.addEventListener('emn-deck-change',changed);
    return () => { window.removeEventListener('emn-deck-change',changed); generation.current++; session.current=null; };
  },[]);

  const sync = async () => {
    const auth = session.current;
    if (!auth || operation.current || !state.active || state.conflict) return;
    operation.current=true; const run=generation.current; update({busy:true,message:'Sincronizando…'});
    try {
      if (Date.now() >= auth.expires) throw new Error('Tu sesión de Google venció. Volvé a conectar para guardar.');
      const cloud = await auth.drive.latest();
      if (run!==generation.current) return;
      const local = makeBackup(current.current);
      const remote = cloud ? fingerprint(cloud.backup) : null;
      if (remote!==baseline.current && remote!==fingerprint(local)) {
        update({conflict:{cloud,initial:false},active:false,message:'Hay cambios en Drive. Elegí qué progreso continuar.'}); return;
      }
      if (remote===fingerprint(local)) { baseline.current=remote; saved.current=remote; update({message:'Tu progreso está guardado en Drive.'}); return; }
      await auth.drive.save(local);
      if (run!==generation.current) return;
      baseline.current=fingerprint(local); saved.current=baseline.current;
      update({message:`Guardado en Drive a las ${new Date().toLocaleTimeString('es-NI',{hour:'2-digit',minute:'2-digit'})}.`});
    } catch(e) { if(run===generation.current) update({message:e.message,active:false}); }
    finally { operation.current=false; if(run===generation.current) update({busy:false}); }
  };
  const connect = () => {
    if (!CLIENT_ID || !state.ready || operation.current) return;
    const run=++generation.current; session.current=null; baseline.current=null; saved.current=null;
    update({busy:true,active:false,account:null,conflict:null,message:'Elegí tu cuenta de Google…'});
    const client=window.google.accounts.oauth2.initTokenClient({client_id:CLIENT_ID,scope:`${DRIVE_SCOPE} openid email profile`,include_granted_scopes:false,
      error_callback:()=>{if(run===generation.current)update({busy:false,message:'La conexión se canceló o el navegador bloqueó la ventana. Podés intentarlo otra vez.'});},
      callback:async response=>{
        if(run!==generation.current)return;
        if(response.error || !response.access_token || !window.google.accounts.oauth2.hasGrantedAllScopes(response,DRIVE_SCOPE,'openid','email','profile')) {update({busy:false,message:'Para conectar, autorizá Google Drive y los datos básicos de tu cuenta.'});return;}
        operation.current=true;
        try {
          const drive=new DriveProgress(response.access_token);
          const profile=await (await drive.request('https://www.googleapis.com/oauth2/v3/userinfo')).json();
          if(!profile.sub || !profile.email)throw new Error('No se pudo identificar la cuenta de Google.');
          const cloud=await drive.latest(); if(run!==generation.current)return;
          session.current={drive,expires:Date.now()+Math.max(0,Number(response.expires_in)-60)*1000};
          const local=makeBackup(current.current); baseline.current=cloud?fingerprint(cloud.backup):null;
          update({account:profile.email,message:''});
          if(cloud && fingerprint(local)===baseline.current){saved.current=baseline.current;update({active:true,message:'Tu progreso está guardado en Drive.'});}
          else update({conflict:{cloud,initial:true},message:cloud?'Elegí el progreso que querés continuar.':'Esta cuenta todavía no tiene progreso guardado.'});
        }catch(e){if(run===generation.current)update({message:e.message});}
        finally {operation.current=false;if(run===generation.current)update({busy:false});}
      }});
    try { client.requestAccessToken({prompt:'select_account'}); } catch { update({busy:false,message:'No se pudo abrir Google. Intentá de nuevo desde tu navegador.'}); }
  };
  const choose = async source => {
    if(operation.current || !session.current)return;
    const cloud=state.conflict?.cloud; const run=generation.current;
    if(source==='cloud' && cloud){
      try { restoreBackup(cloud.backup,setProgress); baseline.current=fingerprint(cloud.backup); saved.current=baseline.current; update({conflict:null,active:true,message:'Progreso de Drive recuperado. Guardaremos tus próximos cambios.'}); } catch(e){update({message:e.message});}
    }else{
      operation.current=true;update({busy:true});
      try {
        const local=makeBackup(current.current); await session.current.drive.save(local);
        if(run!==generation.current)return;
        baseline.current=fingerprint(local);saved.current=baseline.current;update({conflict:null,active:true,message:'Tu progreso de este dispositivo está guardado en Drive.'});
      }catch(e){if(run===generation.current)update({message:e.message});}
      finally{operation.current=false;if(run===generation.current)update({busy:false});}
    }
  };
  const disconnect = () => {
    generation.current++; session.current=null; baseline.current=null;saved.current=null;
    update({account:null,active:false,busy:false,conflict:null,message:'Cuenta desconectada. El progreso sigue en este dispositivo; las copias de Drive se conservan.'});
  };
  useEffect(()=>{
    if(!state.active || state.busy || state.conflict || !session.current)return;
    if(saved.current===fingerprint(makeBackup(progress)))return;
    const timer=setTimeout(sync,5000);return()=>clearTimeout(timer);
  },[progress,deckVersion,state.active,state.busy,state.conflict]);
  useEffect(()=>{
    const online=()=>{if(state.active)sync();};window.addEventListener('online',online);return()=>window.removeEventListener('online',online);
  },[state.active,state.conflict]);

  return <section className="drive-progress" aria-labelledby="drive-progress-title">
    <div className="drive-progress-heading"><Cloud aria-hidden="true"/><div><h2 id="drive-progress-title">Tu progreso con Google Drive</h2><p>Continuá desde la web o la app con la misma cuenta de Google.</p></div></div>
    {!CLIENT_ID ? <p className="drive-notice">La conexión con Google está en preparación. Por ahora, tu progreso se guarda en este dispositivo.</p> : <>
      <p>{state.account ? <>Cuenta: <strong>{state.account}</strong></> : 'Conectá tu cuenta para guardar y recuperar tu progreso.'}</p>
      <div className="drive-actions">
        {!state.ready&&<button type="button" className="button secondary" onClick={()=>{update({busy:true});loadGoogleIdentity().then(()=>update({ready:true,busy:false,message:'Google está listo. Podés conectar tu cuenta.'})).catch(e=>update({busy:false,message:e.message}));}} disabled={state.busy}>Reintentar conexión</button>}
        <button type="button" className="button primary" onClick={connect} disabled={!state.ready||state.busy}>{state.account?'Volver a conectar':'Conectar con Google'}</button>
        {state.account&&<><button type="button" className="button secondary" onClick={sync} disabled={state.busy||!state.active}><RefreshCw size={16}/> Sincronizar ahora</button><button type="button" className="button secondary" onClick={disconnect} disabled={state.busy}><LogOut size={16}/> Desconectar</button></>}
      </div>
      {state.conflict&&<div className="drive-choice"><h3>¿Qué progreso querés continuar?</h3><p>En este dispositivo: {progress.totalAnswered} respuestas y {progress.examsCompleted} pruebas.</p>{state.conflict.cloud&&<p>En Drive: {state.conflict.cloud.backup.progress.totalAnswered} respuestas y {state.conflict.cloud.backup.progress.examsCompleted} pruebas. Guardado el {new Date(state.conflict.cloud.modifiedTime).toLocaleString('es-NI')}.</p>}<div className="drive-actions">{state.conflict.cloud&&<button type="button" className="button primary" disabled={state.busy} onClick={()=>choose('cloud')}>Continuar con Drive</button>}<button type="button" className="button secondary" disabled={state.busy} onClick={()=>choose('local')}>Guardar el progreso de este dispositivo</button></div><p>Las copias anteriores de Drive se conservan. No se suman los resultados de dos dispositivos.</p></div>}
      <p role="status" aria-live="polite">{state.message}</p>
      <small>Solo accedemos a los datos de esta aplicación en Drive. El guardado automático funciona con internet y una sesión activa; al volver a abrir la app puede ser necesario conectar de nuevo. Sin conexión, tu progreso queda en este dispositivo.</small>
    </>}
  </section>;
}
