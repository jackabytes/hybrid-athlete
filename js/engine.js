const Engine={
  dateKey(d=new Date()){return new Date(d).toISOString().slice(0,10)},
  dayIndex(d=new Date()){const x=new Date(d); return (x.getDay()+6)%7},
  weekForDate(state,date){const a=new Date(state.anchorDate+'T00:00:00'); const b=new Date(date+'T00:00:00'); return Math.max(1,Math.floor((b-a)/86400000/7)+1)},
  templateFor(state,week){return Programme.hybridOp[Programme.blockWeek(week)-1]},
  nextScheduledDate(state,from=new Date()){
    for(let i=0;i<14;i++){const d=new Date(from);d.setDate(d.getDate()+i);const key=this.dateKey(d);const w=this.weekForDate(state,key);const type=this.templateFor(state,w)[this.dayIndex(d)]||'REST'; if(type!=='REST')return {date:key,week:w,type}} return null;
  },
  sessionFor(state,date=new Date()){
    const key=this.dateKey(date),week=this.weekForDate(state,key), pattern=this.templateFor(state,week), type=state.detour?state.detour.type.toUpperCase():pattern[this.dayIndex(date)]||'REST';
    if(state.detour)return this.detour(state.detour,week,key);
    return this.build(type,state,week,key);
  },
  build(type,state,week,key){
    if(type==='Operator'){
      const p=Programme.prescription(state.maxes,week);
      return {id:`${key}-op`,date:key,week,type:'strength',title:'Operator',subtitle:`Wave ${p.wave.week} · ${p.wave.pct}%`,items:p.lifts.map(x=>({name:x.name,detail:`${x.load} kg · ${x.sets} × ${x.reps}`})),meta:{pct:p.wave.pct,setsMin:p.wave.setsMin,setsMax:p.wave.setsMax}};
    }
    const map={LSS:['LSS','Zone 2 / easy aerobic','30–90 min, conversational'],Hill:['Hill','Hill / high-intensity conditioning','Short hard efforts with controlled recovery'],Speed:['Speed','Speed / high-intensity conditioning','Intervals such as 400 m, 800 m, mile repeats or tempo'],Fartlek:['Fartlek','Mixed-intensity run','Easy running punctuated by controlled hard efforts'], 'Long Run':['Long Run','Long easy run','Build duration gradually while staying aerobic'],DELOAD:['Deload','Reduced load','Recovery-focused week']};
    const m=map[type]||['Rest','Recovery','Rest or easy recovery'];
    return {id:`${key}-${type}`,date:key,week,type:type==='DELOAD'?'deload':type==='LSS'||type==='Long Run'||type==='Fartlek'?'endurance':'hic',title:m[0],subtitle:m[1],items:type==='DELOAD'?[]:[{name:m[0],detail:m[2]}],meta:{}};
  },
  detour(d,week,key){
    const n=Math.max(1,d.week||1), len=d.length||4;
    const defs={SE:['SE Detour','Strength-endurance conversion','Full-body SE circuit; select a suitable session from the library'],STRENGTH:['Strength Detour','Max-strength emphasis','Use a minimalist strength template and protect recovery'],RUCK:['Ruck Detour','Loaded endurance','Progress distance/load conservatively; substitute when needed'],RUNNING:['Running Detour','Running emphasis','Progress easy volume first, then specific speed/hill work']};
    const x=defs[d.type]||defs.RUNNING;
    return {id:`${key}-detour`,date:key,week,type:'detour',title:x[0],subtitle:`Week ${n} of ${len} · ${x[1]}`,items:[{name:x[0],detail:x[2]}],meta:{detour:d.type,detourWeek:n,detourLength:len}};
  },
  readiness(state){
    const r=state.readiness.slice(-7); if(!r.length)return {score:null,label:'Unknown',action:'Start logging readiness.'};
    const avg=k=>r.reduce((a,x)=>a+Number(x[k]||0),0)/r.length;
    const sleep=avg('sleep'), soreness=avg('soreness'), stress=avg('stress'), motivation=avg('motivation');
    const score=Math.round(((sleep/5)+(6-soreness)/5+(6-stress)/5+(motivation/5))/4*100);
    if(score<45)return {score,label:'Low',action:'Hold progression. Prefer easy work or reduce strength volume.'};
    if(score<65)return {score,label:'Moderate',action:'Train, but use minimum effective dose and avoid adding volume.'};
    return {score,label:'Good',action:'Proceed with the planned session.'};
  },
  adapt(state){
    const h=state.history.slice(-14), r=this.readiness(state), pain=h.filter(x=>x.pain).length, hard=h.filter(x=>Number(x.rpe)>=9).length, missed=h.filter(x=>x.status==='missed').length;
    if(pain)return {status:'caution',reason:'Pain/recovery issue logged',message:'Hold progression and modify or replace the affected session.'};
    if(missed>=2||hard>=3||r.score!==null&&r.score<45)return {status:'reduce',reason:'Accumulated fatigue or missed work',message:'Keep the structure but reduce volume/intensity temporarily.'};
    return {status:'stable',reason:'No red flags',message:'Continue the baseline and progress normally.'};
  },
  logResult(state,session,result){
    state.history.push({id:session.id,date:session.date,type:session.type,status:result.status,rpe:Number(result.rpe||0),pain:!!result.pain,notes:result.notes||'',loads:result.loads||null});
    if(state.detour){
      state.detour.week=(state.detour.week||1)+1;
      if(state.detour.week>state.detour.length)state.detour=null;
    }
    if(result.status==='completed'&&!state.detour)state.week=Math.max(state.week,session.week+1);
    return state;
  }
};
