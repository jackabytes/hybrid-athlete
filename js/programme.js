const Programme={
  hybridOp:[
    ["Operator","Hill","Operator","LSS","Operator","Fartlek"],
    ["Operator","Speed","Operator","LSS","Operator","Long Run"],
    ["Operator","Hill","Operator","LSS","Operator","Fartlek"],
    ["Operator","Speed","Operator","LSS","Operator","Long Run"],
    ["Operator","Hill","Operator","LSS","Operator","Fartlek"],
    ["Operator","Speed","Operator","LSS","Operator","Long Run"],
    ["DELOAD","LSS","REST","LSS","REST","LSS","REST"]
  ],
  operatorWave:[{week:1,reps:"5",pct:70},{week:2,reps:"5",pct:80},{week:3,reps:"3",pct:90},{week:4,reps:"5",pct:75},{week:5,reps:"3",pct:85},{week:6,reps:"1–2",pct:95}],
  lifts:[
    {id:"frontSquat",name:"Front Squat",type:"main"},
    {id:"ohp",name:"Overhead Press",type:"main"},
    {id:"pullup",name:"Weighted Pull-up",type:"main"}
  ],
  classify(x){let a=x.toLowerCase();if(a.includes("operator"))return"op";if(a.includes("lss")||a.includes("run")||a.includes("hill")||a.includes("speed")||a.includes("fartlek"))return"run";if(a==="rest")return"rest";if(a==="deload")return"detour";return"detour"},
  operatorSets(week){const w=((week-1)%6)+1;const z=this.operatorWave[w-1];return z},
  calcLoads(maxes,week){const z=this.operatorSets(week);let out={};for(const l of this.lifts){let m=Number(maxes[l.id]||0);let raw=m*z.pct/100;let step=l.id==="pullup"?1:2.5;out[l.id]=Math.round(raw/step)*step}return {zone:z,out}},
  currentWeek(state){return ((state.week-1)%7)+1}
};