const Store={
 key:'tpwa-v2',
 defaults(){return {version:2,page:'dashboard',week:1,anchorDate:new Date().toISOString().slice(0,10),trainingDays:[1,2,3,4,5,6],block:'Hybrid/Operator',detour:null,maxes:{frontSquat:75,ohp:45,pullup:6},settings:{units:'metric'},history:[],readiness:[],sessionOverrides:{}}},
 load(){try{const raw=localStorage.getItem(this.key); if(!raw)return this.defaults(); const s=JSON.parse(raw); return {...this.defaults(),...s,settings:{...this.defaults().settings,...(s.settings||{})}}}catch(e){return this.defaults()}},
 save(s){try{localStorage.setItem(this.key,JSON.stringify(s));return true}catch(e){return false}},
 reset(){try{localStorage.removeItem(this.key)}catch(e){} location.reload()}
};
