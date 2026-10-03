import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';

const source = fs.readFileSync(new URL('./app.js',import.meta.url),'utf8').split("document.addEventListener('click'")[0];
const store = new Map();
const context = {crypto:webcrypto,localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)},document:{},window:{},console,setTimeout,Date};
vm.createContext(context);
vm.runInContext(source+'\nglobalThis.testAPI={parseText,parseCSV,parseJSON,fromLegacy,durationMinutes};',context);
const {parseText,parseCSV,parseJSON,fromLegacy,durationMinutes}=context.testAPI;

const text=parseText('Kịch bản: Chính\n18:30 - 18:45 | Đón khách | Lễ tân\nKịch bản: Dự phòng\n18:30 - 19:00 | Chờ trong hội trường | MC');
assert.equal(text.length,2);
assert.equal(text[1].data.items[0].title,'Chờ trong hội trường');
const csv=parseCSV('kịch bản,start,end,title,staff\nA,19:00,19:10,Chào mừng,MC\nB,19:00,19:20,Dự phòng,Kỹ thuật','x');
assert.equal(csv.length,2);
const json=parseJSON(JSON.stringify({properties:{title:'Cũ'},items:[{start:'19:00',end:'19:05',title:'Mục'}]}),'x');
assert.equal(json[0].data.items[0].title,'Mục');
store.set('live_event_scripter_local_v3_script_list',JSON.stringify([{key:'default',name:'Cũ'}]));
store.set('live_event_scripter_local_v3_script_default',JSON.stringify({properties:{title:'Cũ',details:{date:'2026-10-03'}},items:[{start:'19:00',end:'19:10',title:'Mục',cameraman:'toàn cảnh'}]}));
assert.equal(fromLegacy().data.default.items[0].cameraman.cam1,'toàn cảnh');
assert.equal(durationMinutes('23:55','00:05'),10);
console.log('OK: multi-scenario import, legacy data and midnight timing');
