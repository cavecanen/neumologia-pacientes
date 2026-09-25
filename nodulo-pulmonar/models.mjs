const logistic=x=>1/(1+Math.exp(-x));
export function brock({age,female,family,emphysema,diameter,type,upper,count,spiculation}){
 if(!(age>=18&&age<=100&&diameter>=1&&diameter<=30&&count>=1&&Number.isInteger(count))) throw Error('Brock: entradas fuera de rango');
 const x=-6.78917+0.0286687*(age-62)+0.6010727*Number(female)+0.296109*Number(family)+0.2953112*Number(emphysema)-5.385484*(Math.pow(diameter/10,-0.5)-1.58113883)+(type==='ggo'?-0.1276173:type==='part'?0.3769578:0)+0.6581383*Number(upper)+0.7729335*Number(spiculation)-0.0824156*(count-4);
 return 100*logistic(x);
}
export function mayo({age,smoker,cancer,diameter,upper,spiculation}){
 if(!(age>=18&&age<=100&&diameter>=1&&diameter<=30)) throw Error('Mayo: entradas fuera de rango');
 return logistic(-6.8272+0.0391*age+0.7917*Number(smoker)+1.3388*Number(cancer)+0.1274*diameter+1.0407*Number(spiculation)+0.7838*Number(upper));
}
export function herder(inputs){
 if(!['absent','faint','moderate','intense'].includes(inputs.pet)) throw Error('Herder requiere PET');
 const prior=mayo(inputs);
 return {mayo:100*prior,herder:100*logistic(-4.739+3.691*prior+({absent:0,faint:2.322,moderate:4.617,intense:4.771})[inputs.pet])};
}
export function growth(v1,v2,days){
 if(!(v1>0&&v2>0&&days>0)) throw Error('Volúmenes o intervalo inválidos');
 const change=(v2/v1-1)*100;
 return {change,vdt:v2>v1?days*Math.log(2)/Math.log(v2/v1):null,significant:change>=25};
}
