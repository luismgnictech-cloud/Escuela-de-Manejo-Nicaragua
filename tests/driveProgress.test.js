import test from 'node:test';
import assert from 'node:assert/strict';
import { DriveProgress, validateBackup, makeBackup, restoreBackup, fingerprint } from '../src/driveProgress.js';
const progress = {totalAnswered:2,totalCorrect:1,practiceSessions:1,examsCompleted:0,byModule:{senales:{answered:2,correct:1}},mistakes:{q2:1},mastered:{q1:true},roundabouts:{},examHistory:[]};
const backup = () => ({schema:1,progress:structuredClone(progress),usedQuestions:['q1'],savedAt:'2026-10-13T00:00:00Z'});
const storage = value => ({value,getItem(){return this.value;},setItem(key,v){this.value=v;}});
test('reject incompatible or malformed cloud data before restore',()=>{
 for(const p of [null,{schema:2},{...backup(),progress:{...progress,totalCorrect:3}},{...backup(),progress:{...progress,mistakes:[]}},{...backup(),usedQuestions:{}}])assert.throws(()=>validateBackup(p));
 assert.equal(validateBackup(backup()).schema,1);
});
test('fingerprints ignore save dates and object key order',()=>{
 const a=backup(),b={...backup(),savedAt:'other',progress:Object.fromEntries(Object.entries(progress).reverse())};
 assert.equal(fingerprint(a),fingerprint(b));
 b.progress.totalAnswered=3;assert.notEqual(fingerprint(a),fingerprint(b));
});
test('recover the used-question deck without repeating local questions',()=>{
 global.window={dispatchEvent(){}};const s=storage('["q2"]');let restored;
 restoreBackup(backup(),p=>restored=p,s);assert.deepEqual(JSON.parse(s.value),['q2','q1']);assert.equal(restored.totalAnswered,2);
 delete global.window;
});
test('invalid backup cannot mutate local storage or progress',()=>{
 global.window={dispatchEvent(){}};const s=storage('["q2"]');let changed=false;
 assert.throws(()=>restoreBackup({schema:9},()=>changed=true,s));assert.equal(changed,false);assert.equal(s.value,'["q2"]');delete global.window;
});
test('a damaged local question deck keeps valid progress',()=>assert.deepEqual(makeBackup(progress,storage('bad')).usedQuestions,[]));
test('Drive looks only inside appDataFolder and validates the latest copy',async()=>{
 const calls=[];const d=new DriveProgress('test-token',async url=>{calls.push(url);return new Response(JSON.stringify(calls.length===1?{files:[{id:'file1',modifiedTime:'2026-10-13T00:00:00Z'}]}:backup()));});
 const cloud=await d.latest();const q=new URL(calls[0]).searchParams;assert.equal(q.get('spaces'),'appDataFolder');assert.equal(q.get('orderBy'),'modifiedTime desc');assert.equal(cloud.backup.progress.totalAnswered,2);
});
test('save creates an immutable app-only JSON snapshot without writing existing files',async()=>{
 let request;const d=new DriveProgress('test-token',async(url,options)=>{request={url,options};return new Response(JSON.stringify({id:'new-file'}));});
 assert.equal((await d.save(backup())).id,'new-file');assert.equal(request.options.method,'POST');assert.match(request.options.body,/"parents":\["appDataFolder"\]/);assert.match(request.options.body,/"usedQuestions":\["q1"\]/);assert.equal(request.options.headers.Authorization,'Bearer test-token');assert.match(request.options.headers['Content-Type'],/^multipart\/related; boundary=/);
});
test('Drive errors do not masquerade as a saved copy',async()=>{
 for(const status of [401,403,500]){const d=new DriveProgress('test-token',async()=>new Response('',{status}));await assert.rejects(d.save(backup()));}
});
test('default browser fetch retains the global receiver required by native APIs',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=function(){assert.equal(this,globalThis,'native fetch must run with the browser global receiver');return Promise.resolve(new Response('{}'));};
 try { const drive=new DriveProgress('test-token');await drive.request('https://www.googleapis.com/drive/v3/files'); }
 finally {globalThis.fetch=original;}
});
