let state=Store.load(); let page=state.page||"dashboard";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function setPage(p){page=p;state.page=p;Store.save(state);render()}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function card(html){return `<section class="card">${html}</section>`}
function dashboard(){
 const adapt=Engine.adapt(state), load=Programme.calcLoads(state.maxes,state.week), next=Engine.nextSession(state);
 return `<div class="page">
 <div class="hero"><div class="eyebrow">BASELINE</div><h2>Hybrid / Operator</h2><p class="muted">Your indefinite 50/50 operational baseline. Detours are temporary; the baseline is where you return.</p><div class="row"><span class="pill accent">Week ${state.week}</span><span class="pill">${state.detour?state.detour.type+" detour":"No detour"}</span></div></div>
 <div class="grid">${card(`<div class="stat">${next.title}</div><div class="label">Next session</div>`)}${card(`<div class="stat">${load.zone.pct}%</div><div class="label">Operator loading</div>`)}</div>
 ${card(`<div class="between"><b>Engine status</b><span class="pill ${adapt.status==="stable"?"good":"accent"}">${adapt.status}</span></div><p class="muted small">${esc(adapt.message)}</p>`)}
 ${card(`<div class="between"><div><b>Today's prescription</b><div class="muted small">${esc(next.subtitle)}</div></div><button class="btn" data-action="today">Open</button></div>`)}
 ${card(`<div class="notice"><b>Programming rule</b><p class="muted small">Baseline → assess reality → detour only when a domain needs emphasis → return to baseline.</p></div>`)}
 </div>`;
}
function programme(){
 const p=Programme.hybridOp; let weeks="";
 p.forEach((w,i)=>{weeks+=`<div class="week"><div class="weekhead">${i===6?"Deload":"Week "+(i+1)}</div><div class="days">${w.map((d,j)=>`<div class="day ${Programme.classify(d)}"><strong>${["M","T","W","T","F","S","S"][j]}</strong>${esc(d)}</div>`).join("")}</div></div>`});
 return `<div class="page"><div class="hero"><div class="eyebrow">LONG-TERM ENGINE</div><h2>Baseline timeline</h2><p class="muted">The 7-week Hybrid/Op pattern repeats. The final week is the deload. Detours can temporarily replace the baseline.</p></div><div class="timeline">${weeks}</div>${card(`<b>Operator wave</b><p class="muted small">6-week strength loading: 70% → 80% → 90% → 75% → 85% → 95%.</p>`)}</div>`;
}
function today(){
 const s=Engine.nextSession(state);
 return `<div class="page"><div class="hero"><div class="eyebrow">TODAY</div><h2>${esc(s.title)}</h2><p class="muted">${esc(s.subtitle)}</p></div>
 ${card(s.items.length?s.items.map(x=>`<div class="exercise"><span>${esc(x.name)}</span><b>${esc(x.detail)}</b></div>`).join(""):`<div class="empty">Recovery day.</div>`)}
 ${card(`<p class="muted">${esc(s.note)}</p><div class="row"><button class="btn" data-action="log-complete">Log completed</button><button class="btn secondary" data-action="log-missed">Log missed</button></div>`)}
 ${card(`<button class="btn secondary" data-action="reality">Something changed? Replan</button>`)}</div>`;
}
function reality(){
 return `<div class="page"><div class="hero"><div class="eyebrow">REALITY ENGINE</div><h2>Tell it what actually happened.</h2><p class="muted">The app should react to missed sessions, hard sessions and recovery issues rather than blindly following a calendar.</p></div>
 ${card(`<form id="logForm" class="form"><label>Status<select name="status"><option value="completed">Completed</option><option value="modified">Modified</option><option value="missed">Missed</option></select></label><label>RPE <input name="rpe" type="number" min="1" max="10" value="7"></label><label class="check"><input name="pain" type="checkbox"> Recovery issue / pain</label><label>Notes<textarea name="notes" rows="3"></textarea></label><button class="btn">Save reality</button></form>`)}
 ${state.detour?card(`<div class="between"><b>Active ${esc(state.detour.type)} detour</b><button class="btn danger" data-action="end-detour">Return to baseline</button></div>`):card(`<b>Create a detour</b><p class="muted small">Use when you deliberately want a temporary emphasis.</p><div class="row">${["SE","Strength","Ruck","Running"].map(x=>`<button class="btn secondary" data-detour="${x}">${x}</button>`).join("")}</div>`)}
 </div>`;
}
function library(){
 return `<div class="page"><div class="hero"><div class="eyebrow">TRAINING VAULT</div><h2>HIC + SE</h2><p class="muted">Structured choices with stimulus and fatigue metadata. The engine can rotate these without hard-copying book sessions.</p></div>
 ${card(`<h3>HIC</h3>${Library.hic.map(x=>`<div class="exercise"><span>${x.name}<small class="muted"> · ${x.modality}</small></span><span class="pill">${x.impact}</span></div>`).join("")}`)}
 ${card(`<h3>SE</h3>${Library.se.map(x=>`<div class="exercise"><span>${x.name}<small class="muted"> · ${x.stimulus}</small></span><span class="pill">${x.impact}</span></div>`).join("")}`)}
 </div>`;
}
function athlete(){
 return `<div class="page"><div class="hero"><div class="eyebrow">ATHLETE</div><h2>Maxes & settings</h2></div>${card(`<form id="athleteForm" class="form">${Programme.lifts.map(l=>`<label>${l.name}<input name="${l.id}" type="number" step="0.5" value="${esc(state.maxes[l.id])}"></label>`).join("")}<button class="btn">Save</button></form>`)}${card(`<button class="btn danger" data-action="reset">Reset app</button>`)}</div>`;
}
function render(){
 const titles={dashboard:"Dashboard",programme:"Programme",today:"Today",reality:"Reality",library:"Library",athlete:"Athlete"};
 $("#pageTitle").textContent=titles[page]||"Dashboard";
 $("#app").innerHTML=page==="dashboard"?dashboard():page==="programme"?programme():page==="today"?today():page==="reality"?reality():page==="library"?library():athlete();
 document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 $("#app").querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",handle));
 $("#app").querySelectorAll("[data-detour]").forEach(b=>b.addEventListener("click",()=>startDetour(b.dataset.detour)));
 const lf=$("#logForm"); if(lf)lf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(lf);state.history.push({date:new Date().toISOString(),status:f.get("status"),rpe:Number(f.get("rpe")),pain:f.get("pain")==="on",notes:f.get("notes")});state.week++;Store.save(state);toast("Reality logged");render()});
 const af=$("#athleteForm"); if(af)af.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(af);for(const l of Programme.lifts)state.maxes[l.id]=Number(f.get(l.id));Store.save(state);toast("Maxes saved");render()});
}
function handle(e){const a=e.currentTarget.dataset.action;if(a==="today")setPage("today");if(a==="reality")setPage("reality");if(a==="log-complete"){state.history.push({date:new Date().toISOString(),status:"completed",rpe:7,pain:false});state.week++;Store.save(state);toast("Session logged");render()}if(a==="log-missed"){state.history.push({date:new Date().toISOString(),status:"missed",rpe:0,pain:false});Store.save(state);toast("Missed session logged");render()}if(a==="end-detour"){state.detour=null;Store.save(state);toast("Back to baseline");render()}if(a==="reset")Store.reset();if(a==="settings")setPage("athlete")}
function startDetour(type){state.detour={type,length:type==="SE"?4:3,week:1};Store.save(state);toast(type+" detour started");setPage("today")}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.page)));
document.body.insertAdjacentHTML("beforeend",'<div id="toast" class="toast"></div>');
render();