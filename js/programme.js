const Programme={
  hybridOp:[
    ['Operator','Hill','Operator','LSS','Operator','Fartlek'],
    ['Operator','Speed','Operator','LSS','Operator','Long Run'],
    ['Operator','Hill','Operator','LSS','Operator','Fartlek'],
    ['Operator','Speed','Operator','LSS','Operator','Long Run'],
    ['Operator','Hill','Operator','LSS','Operator','Fartlek'],
    ['Operator','Speed','Operator','LSS','Operator','Long Run'],
    ['DELOAD','LSS','REST','LSS','REST','LSS','REST']
  ],
  operatorWave:[
    {week:1,setsMin:3,setsMax:5,reps:'5',pct:70},
    {week:2,setsMin:3,setsMax:5,reps:'5',pct:80},
    {week:3,setsMin:3,setsMax:4,reps:'3',pct:90},
    {week:4,setsMin:3,setsMax:5,reps:'5',pct:75},
    {week:5,setsMin:3,setsMax:5,reps:'3',pct:85},
    {week:6,setsMin:3,setsMax:4,reps:'1–2',pct:95}
  ],
  lifts:[
    {id:'frontSquat',name:'Front Squat',unit:'kg',step:2.5},
    {id:'ohp',name:'Overhead Press',unit:'kg',step:2.5},
    {id:'pullup',name:'Weighted Pull-up',unit:'kg',step:1}
  ],
  round(v,step){return Math.round(v/step)*step},
  operatorWeek(week){return ((Math.max(1,week)-1)%6)+1},
  blockWeek(week){return ((Math.max(1,week)-1)%7)+1},
  load(max, pct, step){return this.round(Number(max||0)*pct/100,step)},
  prescription(maxes,week){const z=this.operatorWave[this.operatorWeek(week)-1];return {wave:z,lifts:this.lifts.map(l=>({name:l.name,id:l.id,load:this.load(maxes[l.id],z.pct,l.step),reps:z.reps,sets:`${z.setsMin}–${z.setsMax}`}))}},
  classify(x){const a=x.toLowerCase(); if(a==='operator')return'op'; if(a==='rest')return'rest'; if(a==='deload')return'deload'; return'conditioning'}
};
