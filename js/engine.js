const Engine={
  nextSession(state){
    const pattern=Programme.hybridOp[(state.week-1)%7];
    const day=(new Date().getDay()+6)%7;
    const type=pattern[day]||"REST";
    if(state.detour) return this.detourSession(state);
    return this.build(type,state);
  },
  build(type,state){
    if(type==="Operator"){
      const loads=Programme.calcLoads(state.maxes,state.week);
      return {title:"Operator",subtitle:`Week ${Programme.operatorSets(state.week).week} · ${Programme.operatorSets(state.week).pct}%`,type:"op",
      items:[
        {name:"Front Squat",detail:`${loads.out.frontSquat} kg · ${loads.zone.reps} reps`},
        {name:"Overhead Press",detail:`${loads.out.ohp} kg · ${loads.zone.reps} reps`},
        {name:"Weighted Pull-up",detail:`${loads.out.pullup} kg · ${loads.zone.reps} reps`}
      ],note:"Main strength session. Keep the prescribed work sets; adjust only when reality calls for it."};
    }
    if(type==="LSS"||type==="Long Run") return {title:type,subtitle:"Easy aerobic work",type:"run",items:[{name:type==="LSS"?"Zone 2":"Long easy run",detail:type==="LSS"?"30–90 min, conversational":"Build gradually; keep it aerobic"}],note:"Easy enough to recover from. The baseline is deliberately simple."};
    if(type==="Hill"||type==="Speed") return {title:type,subtitle:"HIC / speed",type:"run",items:[{name:type==="Hill"?"Hill repeats":"Speed intervals",detail:"Short hard efforts with controlled recovery"}],note:"High intensity. Do not turn every conditioning day into a race."};
    if(type==="Fartlek") return {title:"Fartlek",subtitle:"Mixed intensity running",type:"run",items:[{name:"Fartlek",detail:"Easy running punctuated by hard efforts"}],note:"Flexible conditioning stimulus."};
    return {title:type,subtitle:"Recovery",type:"rest",items:[],note:"Rest or recovery work."};
  },
  detourSession(state){
    const d=state.detour;
    if(d.type==="SE") return {title:"SE Detour",subtitle:`Week ${d.week} of ${d.length}`,type:"detour",items:[{name:"Strength-endurance circuit",detail:"Use a suitable full-body SE session from the library"},{name:"Optional easy aerobic",detail:"Keep separate/easy if recovery allows"}],note:"SE is a focused conversion block, not the new permanent baseline."};
    if(d.type==="Ruck") return {title:"Ruck Detour",subtitle:`Week ${d.week} of ${d.length}`,type:"detour",items:[{name:"Ruck",detail:`Load: ${d.load||"set conservatively"} · progressive distance`},{name:"Easy aerobic",detail:"Optional LSS"}],note:"Rucking is a temporary specialised emphasis before returning to the baseline."};
    if(d.type==="Strength") return {title:"Strength Detour",subtitle:`Week ${d.week} of ${d.length}`,type:"detour",items:[{name:"Operator / strength",detail:"Prioritise main lifts and recovery"}],note:"Strength emphasis detour."};
    return {title:"Running Detour",subtitle:`Week ${d.week} of ${d.length}`,type:"detour",items:[{name:"Running focus",detail:"Increase running volume or speed progressively"}],note:"Running emphasis detour."};
  },
  adapt(state){
    const recent=state.history.slice(-7);
    if(!recent.length)return {status:"stable",message:"No recent training data yet. Log sessions and the engine will start adapting."};
    const hard=recent.filter(x=>x.rpe>=9).length;
    const missed=recent.filter(x=>x.status==="missed").length;
    const pain=recent.filter(x=>x.pain).length;
    if(pain)return {status:"caution",message:"Recovery issue logged. Hold progression and consider a lighter week or exercise modification."};
    if(hard>=3||missed>=2)return {status:"reduce",message:"Recent training has been costly. Keep the baseline structure but reduce intensity/volume temporarily."};
    return {status:"stable",message:"Training appears manageable. Continue the baseline and progress normally."};
  }
};