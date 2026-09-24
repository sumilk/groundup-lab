import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const registered={};let chartCount=0;
const GU={lab:(id,fn)=>{assert(!registered[id]);registered[id]=fn;},labkit:{chart(canvas,spec){const view={render(){const s=spec();assert(s.x[1]>s.x[0]);assert(s.y[1]>s.y[0]);for(const series of s.series)assert(series.points.every(p=>p.every(Number.isFinite)));}};view.render();chartCount++;return view;}}};
vm.runInNewContext(read('public/theory/labs/ps-workbenches.js'),{GU});
const m=GU.psModels,near=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
near(m.events(10,10).values.posterior,.5);assert.equal(m.events(0,0).values.posterior,null);
for(const p of [0,1,30,99,100])for(const n of [1,5,40])near(m.distributions(p,n).values.mass,1);
near(m.joint(60,70).values.covariance_at_max,.18);
near(m.transform(-40,20).values.density,.25);assert.equal(m.transform(0,20).values.density,null);
near(m.gaussian(60,20).values.conditional_variance,.64);near(m.gaussian(100,10).values.conditional_variance,0);
near(m.limits(100,0).values.true_se,.05);near(m.limits(100,100).values.true_se,.5);
near(m.likelihood(20,60).values.mle,.6);near(m.likelihood(20,100).values.plugin_se,0);
near(m.testing(5,50).values.null_size,1/32);near(m.testing(5,100).values.power,1);
for(let n=1;n<=40;n++){const v=m.testing(n,50).values;assert(v.null_size<=.05+1e-12);near(v.power,v.null_size);}
near(m.design(10,20).values.design_effect,2.8);near(m.posterior(3,1).values.posterior_mean,2/3);
near(m.sampling(25,75).values.target_mean,.45);near(m.sampling(25,75).values.bias,.3);
near(m.glm(15,20).values.mle_probability,.75);assert.equal(m.glm(20,20).values.finite_intercept,null);
near(m.highdim(400,100).values.limiting_zero_mass,.75);near(m.highdim(100,400).values.lower_continuous_edge,.25);
near(m.calibration(20,50).values.population_calibration_error,.2);near(m.calibration(20,50).values.one_bin_error,0);
near(m.latent(30,30).values.kl_gap,0);assert(m.latent(99,1).values.kl_gap>0);
near(m.score(40,20).values.score,-.5);near(m.causal(10,90).values.standardized_difference,.1);assert(m.causal(10,90).values.crude_difference<0);
near(m.mixture(50,0).values.responsibility_left,.5);near(m.mixture(0,-40).values.responsibility_left,0);
near(m.empirical(5,5).values.dkw_radius,Math.sqrt(Math.log(40)/10));near(m.empirical(5,5).points.findLast(p=>p[0]===0)[1],.6);
// Mount the actual callbacks, exercise both presets and every control boundary.
for(const [id,fn] of Object.entries(registered)){
 const els={};const root={set innerHTML(s){this.html=s;},querySelector(sel){return els[sel]||=( {value:'0',textContent:'',style:{},events:{},addEventListener(e,cb){this.events[e]=cb;}} );}};
 fn(root);assert.equal(els.canvas.style.visibility,'hidden',id);
 for(const button of ['[data-baseline]','[data-failure]']){
  els[button].onclick();assert.equal(els.canvas.style.visibility,'hidden');els['[data-reveal]'].onclick();assert.equal(els.canvas.style.visibility,'visible');assert(els['[data-out]'].textContent.length>0);assert(!/NaN|Infinity/.test(els['[data-out]'].textContent),id);
 }
 const ranges=[...root.html.matchAll(/data-param="(\d+)" type="range" min="([^"]+)" max="([^"]+)"/g)];
 for(const [,index,min,max] of ranges)for(const value of [min,max]){const input=els[`[data-param="${index}"]`];input.value=value;input.events.input();assert.equal(els.canvas.style.visibility,'hidden');els['[data-reveal]'].onclick();assert(!/NaN|Infinity/.test(els['[data-out]'].textContent),id);}
}
assert.equal(chartCount,19);
const catalog=JSON.parse(read('public/theory/catalog.json'));const ids=new Set(catalog.lessons.map(l=>l.markdown.match(/^id: (.+)$/m)?.[1]));
const unitValues=[.5,4.2,.18,.25,.64,.05,.6,1/32,2.8,2/3,.45,.75,.75,.2,0,-.5,.1,.5,.6];
let hints=0,entries=0;
for(const [i,file] of readdirSync(new URL('../content/05-probability-statistics',import.meta.url)).filter(f=>/^\d\d-.*\.md$/.test(f)).sort().entries()){
 const md=read('content/05-probability-statistics/'+file),bankName=md.match(/^answers: (.+)$/m)[1];let bank;
 vm.runInNewContext(read('public/theory/answers/'+bankName+'.js'),{GU:{answers:(k,b)=>{assert.equal(k,bankName);bank=b;}}});
 const exercises=[...md.matchAll(/^\*\*([A-Z]\d+) ·/gm)].map(m=>m[1]);assert.equal(new Set(exercises).size,exercises.length);
 assert.deepEqual(Object.keys(bank).sort(),exercises.sort(),file);entries+=exercises.length;
 for(const key of exercises){assert(bank[key].plain.trim().length>0,key);assert(bank[key].solution.startsWith('<'),key);assert(md.includes(bank[key].statement),`${file} ${key} statement mismatch`);}
 for(let k=1;k<=6;k++)assert(bank['K'+k],file);near(bank.K3.fields[0].ans,unitValues[i]);
 const prompts=[...md.matchAll(/^> \*\*Practice —[^\n]*\n>\n> \*\*Hint:\*\* .+$/gm)];assert.equal(prompts.length,[...md.matchAll(/^> \*\*Practice —/gm)].length,file);hints+=prompts.length;
 const lab=md.match(/^lab: (.+)$/m)[1];assert(registered[lab],file);
 const prereqs=md.match(/^prerequisites: \[(.*)\]$/m)[1].split(',').map(s=>s.trim());for(const id of prereqs)assert(ids.has(id),'Unresolved authored prerequisite '+id);
}
// The GLM migration must preserve its multi-part questions, displays and solution table.
const glm=read('public/theory/answers/ps-11-exponential-families-regression-glms.js');assert(glm.includes('<table>'));assert(glm.includes('1339.4'));assert(glm.includes('HC1'));
console.log(`Validated 19 probability models, controls, answer banks (${entries} entries), six-part checkpoints and ${hints} offline hints.`);
