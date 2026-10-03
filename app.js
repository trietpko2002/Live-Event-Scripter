/* Live Event Scripter Studio — static, client-side application.
   Old v3 LocalStorage is read but never overwritten during migration. */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBq-S_KiC1rJ53CVlFhErnHjdhVa304_Ec',
  authDomain: 'trinh-quan-ly-kich-ban-json.firebaseapp.com',
  projectId: 'trinh-quan-ly-kich-ban-json',
  storageBucket: 'trinh-quan-ly-kich-ban-json.appspot.com',
  messagingSenderId: '407956160149',
  appId: '1:407956160149:web:eecf3ae91c51fbda79659c',
  measurementId: 'G-BWJL89VWMN'
};
const OLD = 'live_event_scripter_local_v3';
const KEY = 'live_event_scripter_studio_v4';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const today = () => new Date().toLocaleDateString('en-CA');
const blank = name => ({properties:{title:name,details:{date:today(),location:'',mc:'',coordinator:''}},items:[]});
let state = {scripts:[],current:null,data:{}};
let selected = null, view = 'timeline', zoom = 1, simulation = '', preview = [], importMode = 'paste', auth = null, history = [], future = [];

function normalizeItem(item = {}) {
  const start = /^\d{1,2}:\d{2}$/.test(item.start || '') ? item.start.padStart(5,'0') : '19:00';
  const end = /^\d{1,2}:\d{2}$/.test(item.end || '') ? item.end.padStart(5,'0') : addMinutes(start,5);
  return {id:item.id || uid(),start,end,duration:item.duration || durationText(start,end),title:String(item.title || 'Mốc chương trình'),desc:String(item.desc || ''),staff:String(item.staff || ''),note:String(item.note || ''),cameraman:typeof item.cameraman === 'object' && item.cameraman ? {cam1:item.cameraman.cam1||'',cam2:item.cameraman.cam2||'',flycam:item.cameraman.flycam||''} : {cam1:item.cameraman||'',cam2:'',flycam:''},priority:item.priority || 'Trung bình',itemStatus:item.itemStatus || 'ready'};
}
function normalizeData(data, name) {
  const details = data?.properties?.details;
  return {properties:{title:String(data?.properties?.title || name || 'Kịch bản'),details:{date:/^\d{4}-\d{2}-\d{2}$/.test(details?.date||'') ? details.date : today(),location:details?.location||'',mc:details?.mc||'',coordinator:details?.coordinator||''}},items:Array.isArray(data?.items)?data.items.map(normalizeItem):[]};
}
function fromLegacy() {
  try {
    const list = JSON.parse(localStorage.getItem(`${OLD}_script_list`) || '[]');
    if (!Array.isArray(list) || !list.length) return null;
    const scripts = list.filter(x=>x?.key).map(x=>({key:String(x.key),name:String(x.name||'Kịch bản')}));
    const data = {};
    for (const s of scripts) {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(`${OLD}_script_${s.key}`) || 'null'); } catch {}
      data[s.key] = normalizeData(raw,s.name);
    }
    const current = localStorage.getItem(`${OLD}_current_script`);
    return {scripts,current:scripts.some(s=>s.key===current)?current:scripts[0].key,data};
  } catch { return null; }
}
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Array.isArray(saved.scripts) && saved.scripts.length) {
      const scripts=saved.scripts.filter(x=>x?.key).map(x=>({key:String(x.key),name:String(x.name||'Kịch bản')}));
      const data=Object.fromEntries(scripts.map(s=>[s.key,normalizeData(saved.data?.[s.key],s.name)]));
      return {scripts,current:scripts.some(s=>s.key===saved.current)?saved.current:scripts[0].key,data};
    }
  } catch { toast('Dữ liệu đã lưu không đọc được. Hãy dùng bản sao lưu JSON.'); }
  return fromLegacy() || (()=>{const key=uid();return {scripts:[{key,name:'Kịch bản đầu tiên'}],current:key,data:{[key]:blank('Kịch bản đầu tiên')}}})();
}
function save() {
  try {localStorage.setItem(KEY,JSON.stringify(state));$('save-state').textContent='● Đã lưu';return true;}
  catch(e){$('save-state').textContent='● Lưu lỗi';toast('Không thể lưu. Hãy xuất JSON và kiểm tra dung lượng trình duyệt.');return false;}
}
const data = () => state.data[state.current];
const currentScript = () => state.scripts.find(s=>s.key===state.current);
function commit(mutator) {
  const before = JSON.stringify(state);
  mutator();
  if (JSON.stringify(state) === before) return;
  history.push(before); if(history.length>50) history.shift();
  future=[];save();render();
}
function undo() {if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());save();selected=null;render();}
function redo() {if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());save();selected=null;render();}
function minutes(t){const [h,m]=String(t||'0:0').split(':').map(Number);return (h||0)*60+(m||0);}
function addMinutes(t,n){const m=(minutes(t)+n+1440)%1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
function durationMinutes(a,b){let d=minutes(b)-minutes(a);return d<0?d+1440:d;}
function durationText(a,b){const m=durationMinutes(a,b);return `${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`;}
function elapsed(items){let offset=0,last=-1;return items.map(item=>{let start=minutes(item.start)+offset;if(start<last){offset+=1440;start+=1440;}const length=Math.max(1,durationMinutes(item.start,item.end));last=start;return {...item,_start:start,_end:start+length};});}
function timeLabel(m){return `${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
function activeInfo(){const items=elapsed(data().items);if(!items.length)return {items,index:-1,progress:0};let now=simulation?minutes(simulation):new Date().getHours()*60+new Date().getMinutes();if(items[0]._start>=1440 && now<minutes(items[0].start))now+=1440;if(items.at(-1)._end>1440 && now<minutes(items[0].start))now+=1440;const index=items.findIndex(x=>now>=x._start&&now<x._end);const progress=Math.max(0,Math.min(100,Math.round((now-items[0]._start)/(items.at(-1)._end-items[0]._start)*100)));return {items,index,progress,now};}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500);}

function render(){
  const script=currentScript(),d=data();if(!script||!d)return;
  $('breadcrumb-name').textContent=script.name;
  if(document.activeElement!==$('event-title'))$('event-title').value=d.properties.title;
  for(const [id,key] of [['event-date','date'],['event-location','location'],['event-mc','mc']])if(document.activeElement!==$(id))$(id).value=d.properties.details[key]||'';
  $('sidebar-scripts').innerHTML=state.scripts.map(s=>`<button class="script-link ${s.key===state.current?'active':''}" data-script="${escapeHTML(s.key)}" title="${escapeHTML(s.name)}">${escapeHTML(s.name)}</button>`).join('');
  $('script-grid').innerHTML=state.scripts.map(s=>`<div class="script-card ${s.key===state.current?'active':''}"><button class="script-open" data-script="${escapeHTML(s.key)}"><span class="eyebrow">${s.key===state.current?'● ĐANG MỞ':'KỊCH BẢN'}</span><h3>${escapeHTML(s.name)}</h3><p>${state.data[s.key]?.items?.length||0} mốc · ${escapeHTML(state.data[s.key]?.properties?.details?.date||'')}</p></button><div class="script-actions"><button data-script-action="duplicate" data-key="${escapeHTML(s.key)}">Nhân bản</button><button data-script-action="rename" data-key="${escapeHTML(s.key)}">Đổi tên</button><button data-script-action="delete" data-key="${escapeHTML(s.key)}">Xóa</button></div></div>`).join('');
  $('undo-btn').disabled=!history.length;$('redo-btn').disabled=!future.length;
  $('view-title').textContent=({timeline:'Timeline chương trình',rundown:'Danh sách mốc',scripts:'Thư viện kịch bản'})[view];
  $('view-subtitle').textContent=({timeline:'Theo dõi nội dung, MC, kỹ thuật và máy quay trên cùng trục thời gian.',rundown:'Tìm kiếm, chọn và cập nhật từng mốc trong chương trình.',scripts:'Chuyển, nhân bản, đổi tên và quản lý các phương án tổ chức.'})[view];
  for(const v of ['timeline','rundown','scripts'])$(v+'-view').classList.toggle('hidden',v!==view);
  document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
  $('add-cue').classList.toggle('hidden',view==='scripts');
  renderTimeline();renderList();renderInspector();updateClock();
}
function renderTimeline(){
  const items=elapsed(data().items),root=$('timeline-canvas');
  if(!items.length){root.innerHTML='<div class="empty-inspector">Chưa có mốc. Nhấn “Thêm mốc” hoặc nhập kịch bản để bắt đầu.</div>';return;}
  const start=Math.floor(items[0]._start/15)*15,end=Math.ceil(items.at(-1)._end/15)*15+15,span=Math.max(30,end-start);
  const width=Math.max(740,span*zoom*3.2),grid=15/span*width;
  const ruler=Array.from({length:Math.floor(span/15)+1},(_,i)=>`<div class="tick" style="left:${i*grid}px">${timeLabel(start+i*15)}</div>`).join('');
  const tracks=[['content','▦','Nội dung',x=>x.title],['mc','◉','MC',x=>x.staff],['tech','⚡','Kỹ thuật',x=>x.note],['camera','◈','Máy quay',x=>[x.cameraman?.cam1,x.cameraman?.cam2,x.cameraman?.flycam].filter(Boolean).join(' / ')]];
  root.style.width=`${width+116}px`;
  root.innerHTML=`<div class="ruler" style="width:${width}px">${ruler}</div>${tracks.map(([type,icon,label,get])=>`<div class="track"><div class="track-label"><span>${icon}</span>${label}</div><div class="track-body" style="width:${width}px;--grid:${grid}px">${items.map((x,i)=>{const title=String(get(x)||'').trim();if(!title)return '';const left=(x._start-start)/span*width,w=Math.max(8,(x._end-x._start)/span*width);return `<button class="cue-block ${type} ${selected===String(x.id)?'selected':''}" data-cue="${escapeHTML(x.id)}" style="left:${left}px;width:${w}px" title="${escapeHTML(timeLabel(x._start)+' '+title)}">${escapeHTML(title)}<small>${type==='content'?escapeHTML(x.start+'–'+x.end):''}</small></button>`}).join('')}</div></div>`).join('')}<div id="playhead" class="playhead" style="display:none"></div>`;
  const {now}=activeInfo(),p=$('playhead');if(now>=start&&now<=end){p.style.display='block';p.style.left=`${116+(now-start)/span*width}px`;}
}
function renderList(){const q=$('search-cues').value.trim().toLocaleLowerCase('vi');const list=data().items.filter(x=>[x.title,x.desc,x.staff,x.note].join(' ').toLocaleLowerCase('vi').includes(q));$('list-count').textContent=`${list.length} mốc`;$('cue-list').innerHTML=list.length?list.map(x=>`<div class="cue-row ${selected===String(x.id)?'selected':''}" data-cue="${escapeHTML(x.id)}" role="button" tabindex="0"><time>${escapeHTML(x.start)}</time><span class="stripe"></span><div><h4>${escapeHTML(x.title)}</h4><p>${escapeHTML(x.end)} · ${escapeHTML(x.staff||'Chưa phân công')}</p></div><span class="status">${x.itemStatus==='approved'?'Đã duyệt':x.itemStatus==='review'?'Cần xem lại':'Sẵn sàng'}</span></div>`).join(''):'<div class="empty-inspector">Không có mốc phù hợp.</div>';}
function renderInspector(){const x=data().items.find(x=>String(x.id)===selected),el=$('inspector-body');if(!x){el.innerHTML='<div class="empty-inspector">Chọn một mốc trên timeline hoặc danh sách để chỉnh sửa.</div>';return;}const e=escapeHTML;el.innerHTML=`<label class="field">Tên mốc<input data-field="title" value="${e(x.title)}"></label><div class="field-row"><label class="field">Bắt đầu<input type="time" data-field="start" value="${e(x.start)}"></label><label class="field">Kết thúc<input type="time" data-field="end" value="${e(x.end)}"></label></div><label class="field">Nội dung / lời dẫn<textarea data-field="desc">${e(x.desc)}</textarea></label><label class="field">MC / Phụ trách<input data-field="staff" value="${e(x.staff)}"></label><label class="field">Ghi chú kỹ thuật<input data-field="note" value="${e(x.note)}"></label><div class="field-row"><label class="field">Cam 1<input data-camera="cam1" value="${e(x.cameraman.cam1)}"></label><label class="field">Cam 2<input data-camera="cam2" value="${e(x.cameraman.cam2)}"></label></div><label class="field">Flycam<input data-camera="flycam" value="${e(x.cameraman.flycam)}"></label><div class="field-row"><label class="field">Ưu tiên<select data-field="priority">${['Thấp','Trung bình','Cao'].map(v=>`<option ${x.priority===v?'selected':''}>${v}</option>`).join('')}</select></label><label class="field">Trạng thái<select data-field="itemStatus"><option value="ready" ${x.itemStatus==='ready'?'selected':''}>Sẵn sàng</option><option value="review" ${x.itemStatus==='review'?'selected':''}>Cần xem lại</option><option value="approved" ${x.itemStatus==='approved'?'selected':''}>Đã duyệt</option></select></label></div><hr class="divider"><div class="inspector-actions"><button class="btn subtle" data-action="duplicate">⧉ Nhân bản</button><button class="btn subtle" data-action="up">↑</button><button class="btn subtle" data-action="down">↓</button><button class="btn subtle danger" data-action="delete">Xóa</button></div>`;}
function updateClock(){if($('app').classList.contains('hidden'))return;const now=new Date();$('clock').textContent=now.toLocaleTimeString('vi-VN',{hour12:false});const {items,index,progress}=activeInfo();$('metric-cues').textContent=items.length;$('metric-duration').textContent=items.length?`${Math.round((items.at(-1)._end-items[0]._start)/60*10)/10} giờ`:'0 phút';$('metric-current').textContent=index>=0?items[index].title:progress>=100?'Đã kết thúc':'Chưa bắt đầu';$('metric-next').textContent=items[index+1]?`Tiếp theo: ${items[index+1].title}`:'Không có mốc tiếp theo';$('metric-progress').textContent=progress+'%';$('progress-bar').style.width=progress+'%';$('event-range').textContent=items.length?`${items[0].start} – ${items.at(-1).end} · ${items.length} mốc`:'Chưa có mốc thời gian';const p=$('playhead');if(p&&items.length){const start=Math.floor(items[0]._start/15)*15,end=Math.ceil(items.at(-1)._end/15)*15+15,nowMin=activeInfo().now;p.style.display=nowMin>=start&&nowMin<=end?'block':'none';p.style.left=`${116+(nowMin-start)/(end-start)*Math.max(740,(end-start)*zoom*3.2)}px`;}}

function createScript(name='Kịch bản mới',source=null){const key=uid();commit(()=>{state.scripts.push({key,name});state.data[key]=source?normalizeData(structuredClone(source),name):blank(name);state.current=key;selected=null;});view='timeline';render();toast('Đã tạo kịch bản.');}
function switchScript(key){if(!state.data[key])return;state.current=key;selected=null;save();render();}
function scriptAction(action,key){const s=state.scripts.find(x=>x.key===key);if(!s)return;if(action==='duplicate'){createScript(`${s.name} (bản sao)`,state.data[key]);return;}if(action==='rename'){const name=prompt('Tên kịch bản:',s.name)?.trim();if(name)commit(()=>{s.name=name;state.data[key].properties.title=name;});return;}if(action==='delete'){if(state.scripts.length===1){toast('Cần giữ ít nhất một kịch bản.');return;}if(!confirm(`Xóa kịch bản “${s.name}” và các mốc bên trong? Hãy xuất bản sao lưu trước nếu cần.`))return;commit(()=>{state.scripts=state.scripts.filter(x=>x.key!==key);delete state.data[key];if(state.current===key)state.current=state.scripts[0].key;selected=null;});}}
function addCue(){const items=data().items,last=items.at(-1),start=last?.end||'19:00';const x=normalizeItem({start,end:addMinutes(start,5),title:'Mốc mới',staff:'',note:''});commit(()=>{items.push(x);selected=String(x.id)});$('inspector').classList.add('open');}
function modifyCue(field,value,camera=false){const id=selected;commit(()=>{const x=data().items.find(x=>String(x.id)===id);if(!x)return;if(camera)x.cameraman[field]=value;else x[field]=value;if(field==='start'||field==='end')x.duration=durationText(x.start,x.end);});}
function cueAction(action){const items=data().items,i=items.findIndex(x=>String(x.id)===selected);if(i<0)return;if(action==='delete'&&!confirm('Xóa mốc này khỏi kịch bản?'))return;commit(()=>{if(action==='duplicate'){const copy=structuredClone(items[i]);copy.id=uid();copy.start=items[i].end;copy.end=addMinutes(copy.start,Math.max(1,durationMinutes(items[i].start,items[i].end)));items.splice(i+1,0,copy);selected=String(copy.id);}if(action==='delete'){items.splice(i,1);selected=null;}if(action==='up'&&i>0)[items[i-1],items[i]]=[items[i],items[i-1]];if(action==='down'&&i<items.length-1)[items[i+1],items[i]]=[items[i],items[i+1]];});}
function downloadJSON(){const blob=new Blob([JSON.stringify({format:'live-event-scripter-studio',version:4,exportedAt:new Date().toISOString(),scripts:state.scripts,data:state.data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`live-event-scripter-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Đã tải bản sao lưu JSON.');}

function parseTimeLine(line){const m=line.match(/(?:^|\s)([01]?\d|2[0-3])[:hH.]([0-5]\d)\s*(?:[-–—→~]|đến|to)\s*([01]?\d|2[0-3])[:hH.]([0-5]\d)/i);if(!m)return null;const start=`${m[1].padStart(2,'0')}:${m[2]}`,end=`${m[3].padStart(2,'0')}:${m[4]}`;let rest=line.slice(m.index+m[0].length).replace(/^[\s|,;:\-–—]+/,'').trim();const parts=rest.split(/\s*(?:\||\t| {2,})\s*/).filter(Boolean);return normalizeItem({start,end,title:parts[0]||'Mốc chương trình',staff:parts[1]||'',note:parts[2]||'',desc:parts.slice(3).join(' · ')});}
function parseText(text,fallback='Kịch bản nhập'){const lines=text.replace(/\r/g,'').split('\n'),out=[];let cur={name:fallback,items:[]};const flush=()=>{if(cur.items.length){out.push({name:cur.name,data:{properties:{title:cur.name,details:{date:today()}},items:cur.items}});}};for(const raw of lines){const line=raw.trim();if(!line)continue;const heading=line.match(/^(?:#{1,3}\s*)?(?:kịch bản|phương án|scenario|script)\s*[:：–-]\s*(.+)$/i);if(heading){flush();cur={name:heading[1].trim(),items:[]};continue;}const item=parseTimeLine(line);if(item)cur.items.push(item);else if(cur.items.length&&line.length>8)cur.items.at(-1).desc+=(cur.items.at(-1).desc?'\n':'')+line;}flush();return out;}
function parseCSV(text,fallback){const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field='';}else field+=c;}row.push(field);if(row.some(x=>x.trim()))rows.push(row);if(!rows.length)return [];const header=rows[0].map(x=>x.toLowerCase().trim());const hasHeader=header.some(x=>/^(start|bắt đầu|bat dau|title|tiêu đề|tieu de|kịch bản|kich ban)$/.test(x));const map=hasHeader?header:[];const val=(r,aliases,defaultIndex)=>{const i=map.findIndex(x=>aliases.includes(x));return (r[i>=0?i:defaultIndex]||'').trim();};const groups=new Map();for(const r of rows.slice(hasHeader?1:0)){const name=val(r,['kịch bản','kich ban','script','scenario'],map.length?-1:0)||fallback;const start=val(r,['start','bắt đầu','bat dau','giờ bắt đầu'],map.length?-1:1);const end=val(r,['end','kết thúc','ket thuc'],map.length?-1:2);if(!/^\d{1,2}:\d{2}$/.test(start)||!/^\d{1,2}:\d{2}$/.test(end))continue;const item=normalizeItem({start,end,title:val(r,['title','tiêu đề','tieu de','nội dung'],map.length?-1:3)||'Mốc chương trình',staff:val(r,['staff','phụ trách','phu trach','mc'],map.length?-1:4),note:val(r,['note','ghi chú','ghi chu'],map.length?-1:5)});if(!groups.has(name))groups.set(name,[]);groups.get(name).push(item);}return [...groups].map(([name,items])=>({name,data:{properties:{title:name,details:{date:today()}},items}}));}
function parseJSON(text,fallback){const obj=JSON.parse(text);if(obj?.scripts&&obj?.data)return obj.scripts.map(s=>({name:s.name||fallback,data:normalizeData(obj.data[s.key],s.name)})).filter(x=>x.data.items.length);if(Array.isArray(obj))return obj.flatMap((x,i)=>x?.items?[{name:x.name||x.properties?.title||`${fallback} ${i+1}`,data:normalizeData(x,x.name||fallback)}]:[]).filter(x=>x.data.items.length);if(obj?.items)return [{name:obj.properties?.title||fallback,data:normalizeData(obj,fallback)}];throw Error('JSON cần có items hoặc scripts + data.');}
async function parseFile(file){const name=file.name.replace(/\.[^.]+$/,'');if(/\.docx$/i.test(file.name)){if(!window.mammoth)throw Error('Không tải được bộ đọc Word. Hãy thử lại khi có mạng hoặc dán văn bản.');const result=await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return parseText(result.value,name);}const content=await file.text();return /\.json$/i.test(file.name)?parseJSON(content,name):/\.csv$/i.test(file.name)?parseCSV(content,name):parseText(content,name);}
async function previewImport(){try{preview=[];const files=$('import-files').files;if(importMode==='files'){if(!files.length)throw Error('Hãy chọn ít nhất một tệp.');for(const f of files)preview.push(...await parseFile(f));}else{const text=$('import-text').value.trim();if(!text)throw Error('Hãy dán nội dung kịch bản.');preview=parseText(text);if(!preview.length&&text.startsWith('{'))preview=parseJSON(text,'Kịch bản nhập');}if(!preview.length)throw Error('Không tìm được mốc có giờ bắt đầu và kết thúc. Ví dụ: 18:30 - 18:45 | Đón khách | MC');$('import-preview').innerHTML=preview.map(x=>`<div class="preview-card"><b>${escapeHTML(x.name)}</b> · ${x.data.items.length} mốc (${escapeHTML(x.data.items[0].start)}–${escapeHTML(x.data.items.at(-1).end)})</div>`).join('');$('confirm-import').disabled=false;}catch(e){preview=[];$('import-preview').innerHTML=`<div class="error">${escapeHTML(e.message)}</div>`;$('confirm-import').disabled=true;}}
function commitImport(){if(!preview.length)return;commit(()=>{for(const x of preview){const key=uid();state.scripts.push({key,name:x.name});state.data[key]=normalizeData(x.data,x.name);state.current=key;}selected=null;});const count=preview.length;preview=[];$('import-dialog').close();view='timeline';render();toast(`Đã tạo ${count} kịch bản.`);}
function openImport(){$('import-dialog').showModal();$('import-preview').innerHTML='';$('confirm-import').disabled=true;preview=[];}
function accountUI(user){$('account').innerHTML=`<span class="avatar">${escapeHTML((user.displayName||user.email||'G')[0].toUpperCase())}</span><span class="account-name" title="${escapeHTML(user.email||'')}">${escapeHTML(user.displayName||user.email||'Tài khoản Google')}</span><button id="logout-btn" title="Đăng xuất" aria-label="Đăng xuất">⇥</button>`;}
function enter(user){$('auth-screen').classList.add('hidden');$('app').classList.remove('hidden');accountUI(user);state=load();save();render();}
function initAuth(){if(!window.firebase){$('auth-error').textContent='Không tải được dịch vụ đăng nhập. Kiểm tra mạng và tải lại trang.';return;}try{firebase.initializeApp(FIREBASE_CONFIG);auth=firebase.auth();auth.onAuthStateChanged(user=>{if(user)enter(user);else{$('auth-screen').classList.remove('hidden');$('app').classList.add('hidden');}});$('login-btn').addEventListener('click',async()=>{try{$('auth-error').textContent='';await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());}catch(e){$('auth-error').textContent=e.message||'Đăng nhập chưa thành công.';}});}catch(e){$('auth-error').textContent='Không khởi tạo được đăng nhập Google: '+e.message;}}

document.addEventListener('click',e=>{
  const scriptButton=e.target.closest('[data-script-action]');if(scriptButton){scriptAction(scriptButton.dataset.scriptAction,scriptButton.dataset.key);return;}
  const cue=e.target.closest('[data-cue]');if(cue){selected=cue.dataset.cue;render();$('inspector').classList.add('open');return;}
  const script=e.target.closest('[data-script]');if(script){switchScript(script.dataset.script);return;}
  const nav=e.target.closest('[data-view]');if(nav){view=nav.dataset.view;render();return;}
  const action=e.target.closest('[data-action]');if(action){cueAction(action.dataset.action);return;}
  const tab=e.target.closest('[data-import-tab]');if(tab){importMode=tab.dataset.importTab;document.querySelectorAll('[data-import-tab]').forEach(x=>x.classList.toggle('active',x===tab));$('paste-pane').classList.toggle('hidden',importMode!=='paste');$('files-pane').classList.toggle('hidden',importMode!=='files');preview=[];$('import-preview').innerHTML='';$('confirm-import').disabled=true;return;}
  if(e.target.id==='logout-btn')auth?.signOut();
});
document.addEventListener('change',e=>{const f=e.target.dataset.field,c=e.target.dataset.camera;if(f&&e.target.closest('#inspector'))modifyCue(f,e.target.value);if(c)modifyCue(c,e.target.value,true);});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['z','y'].includes(e.key.toLowerCase())&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();e.key.toLowerCase()==='z'&&!e.shiftKey?undo():redo();}if(e.key==='Escape')$('inspector').classList.remove('open');if(e.key==='Enter'&&e.target.matches('.cue-row'))e.target.click();});
for(const id of ['event-title','event-date','event-location','event-mc'])$(id).addEventListener('change',e=>{const value=e.target.value;commit(()=>{if(id==='event-title'){data().properties.title=value||'Kịch bản';currentScript().name=data().properties.title;}else data().properties.details[({'event-date':'date','event-location':'location','event-mc':'mc'})[id]]=value;});});
for(const id of ['import-btn','import-side','mobile-import'])$(id).addEventListener('click',openImport);
for(const id of ['export-btn','export-side'])$(id).addEventListener('click',downloadJSON);
for(const id of ['add-cue'])$(id).addEventListener('click',addCue);
for(const id of ['quick-add-script','create-script'])$(id).addEventListener('click',()=>{const name=prompt('Tên kịch bản mới:','Kịch bản mới');if(name?.trim())createScript(name.trim());});
$('undo-btn').addEventListener('click',undo);$('redo-btn').addEventListener('click',redo);
$('search-cues').addEventListener('input',renderList);
$('close-inspector').addEventListener('click',()=>$('inspector').classList.remove('open'));
$('zoom-in').addEventListener('click',()=>{zoom=Math.min(4,zoom*1.25);$('zoom-label').textContent=Math.round(zoom*100)+'%';renderTimeline();});
$('zoom-out').addEventListener('click',()=>{zoom=Math.max(.5,zoom/1.25);$('zoom-label').textContent=Math.round(zoom*100)+'%';renderTimeline();});
$('fit-timeline').addEventListener('click',()=>{zoom=.7;$('zoom-label').textContent='70%';renderTimeline();});
$('simulate-time').addEventListener('change',e=>{simulation=e.target.value;$('clear-sim').classList.toggle('hidden',!simulation);$('live-toggle').classList.toggle('active',!simulation);renderTimeline();updateClock();});
$('clear-sim').addEventListener('click',()=>{simulation='';$('simulate-time').value='';$('clear-sim').classList.add('hidden');$('live-toggle').classList.add('active');renderTimeline();updateClock();});
$('live-toggle').addEventListener('click',()=>$('clear-sim').click());
$('preview-import').addEventListener('click',previewImport);$('confirm-import').addEventListener('click',commitImport);
$('import-files').addEventListener('change',e=>{$('file-names').textContent=[...e.target.files].map(x=>x.name).join(' · ');preview=[];$('confirm-import').disabled=true;});
setInterval(updateClock,1000);initAuth();
