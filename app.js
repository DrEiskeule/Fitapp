const $=id=>document.getElementById(id);
const key='fitpulse-web-v1';
let state={foods:[],workouts:[],exercises:[],water:0,steps:null,burn:null};
try{state={...state,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
const save=()=>{localStorage.setItem(key,JSON.stringify(state));render()};
const fmt=n=>Number(n||0).toLocaleString('de-DE');
const today=new Date();$('today').textContent=today.toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'short'}).toUpperCase();
function render(){
 const kcal=state.foods.reduce((s,f)=>s+f.kcal,0);
 $('dashCalories').textContent=fmt(kcal);$('calBar').style.width=Math.min(kcal/2300*100,100)+'%';
 $('dashSteps').textContent=state.steps==null?'—':fmt(state.steps);$('dashBurn').textContent=state.burn==null?'—':fmt(state.burn);
 $('stepBar').style.width=Math.min((state.steps||0)/10000*100,100)+'%';$('dashWorkouts').textContent=state.workouts.length;
 $('goalText').textContent=`${fmt(kcal)} / 2.300 kcal`;$('goalBar').style.width=Math.min(kcal/2300*100,100)+'%';
 $('waterText').textContent=`${fmt(state.water)} / 2.500 ml`;$('waterBar').style.width=Math.min(state.water/2500*100,100)+'%';
 $('foodTotal').textContent=fmt(kcal)+' kcal';
 $('foodList').innerHTML=state.foods.length?state.foods.map(f=>entry('🥗',f.name,f.amount,`${fmt(f.kcal)} kcal`,'food',f.id)).join(''):'<div class="empty">Noch keine Mahlzeiten erfasst.</div>';
 $('workList').innerHTML=state.workouts.length?state.workouts.map(w=>entry('🏋️',w.name,`${w.minutes} min`,`${fmt(w.kcal)} kcal`,'work',w.id)).join(''):'<div class="empty">Noch keine Workouts erfasst.</div>';
 $('exerciseList').innerHTML=state.exercises.map(e=>entry('✓',e.name,`${e.sets} Sätze × ${e.reps} Wdh.`,'','exercise',e.id)).join('');
 const recent=[...state.foods.map(f=>({...f,kind:'food',icon:'🥗',sub:f.amount,amountLabel:`${fmt(f.kcal)} kcal`})),...state.workouts.map(w=>({...w,kind:'work',icon:'🏋️',sub:`${w.minutes} Minuten`,amountLabel:`${fmt(w.kcal)} kcal`}))].sort((a,b)=>b.created-a.created).slice(0,5);
 $('recent').innerHTML=recent.length?recent.map(x=>entry(x.icon,x.name,x.sub,x.amountLabel,x.kind,x.id)).join(''):'<div class="empty">Deine Mahlzeiten und Workouts erscheinen hier.</div>';
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const [kind,id]=b.dataset.remove.split(':');const prop={food:'foods',work:'workouts',exercise:'exercises'}[kind];state[prop]=state[prop].filter(x=>String(x.id)!==id);save()});
}
function entry(icon,name,sub,value,kind,id){return `<div class="entry"><div class="entry-icon">${icon}</div><div class="entry-main"><b>${esc(name)}</b><small>${esc(sub||'')}</small></div><strong>${value||''}</strong><button data-remove="${kind}:${id}" aria-label="Eintrag löschen" style="background:none;border:0;color:#93a196;font-size:18px">×</button></div>`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab));document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('active',n===b));window.scrollTo(0,0)}));
$('addWater').onclick=()=>{state.water+=250;save()};
$('saveFood').onclick=()=>{const name=$('foodName').value.trim(),kcal=Number($('foodKcal').value);if(!name||!Number.isFinite(kcal)||kcal<0){$('foodMsg').textContent='Bitte Lebensmittel und gültige Kalorien eintragen.';return}state.foods.unshift({id:Date.now(),name,kcal:Math.round(kcal),amount:$('foodAmount').value.trim()||'1 Portion',created:Date.now()});$('foodName').value='';$('foodKcal').value='';$('foodAmount').value='';$('foodMsg').textContent='Mahlzeit gespeichert.';save()};
$('saveWorkout').onclick=()=>{const name=$('workName').value.trim();if(!name)return;state.workouts.unshift({id:Date.now(),name,minutes:Math.max(0,Number($('workMinutes').value)||0),kcal:Math.max(0,Number($('workKcal').value)||0),created:Date.now()});save()};
document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>{$('workName').value=b.dataset.plan;$('workMinutes').value=b.dataset.min;$('workKcal').value=b.dataset.kcal;window.scrollTo({top:0,behavior:'smooth'})});
$('saveExercise').onclick=()=>{const name=$('exerciseName').value.trim();if(!name)return;state.exercises.unshift({id:Date.now(),name,sets:Math.max(1,Number($('exerciseSets').value)||1),reps:Math.max(1,Number($('exerciseReps').value)||1)});save()};
$('saveHealth').onclick=()=>{state.steps=$('manualSteps').value===''?null:Math.max(0,Number($('manualSteps').value));state.burn=$('manualBurn').value===''?null:Math.max(0,Number($('manualBurn').value));save()};
$('focusManual').onclick=()=>{$('foodName').focus();window.scrollTo({top:300,behavior:'smooth'})};
const modal=$('modal');$('openBarcode').onclick=()=>{modal.classList.remove('hidden');$('barcodeInput').focus()};$('closeModal').onclick=()=>modal.classList.add('hidden');
$('lookupBarcode').onclick=async()=>{const code=$('barcodeInput').value.trim();if(!code){$('scanMsg').textContent='Bitte Barcode-Nummer eingeben.';return}$('scanMsg').textContent='Suche Produkt …';try{const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`);const d=await r.json();if(d.status!==1)throw Error('not found');const p=d.product||{},n=p.nutriments||{};$('foodName').value=p.product_name||'Produkt '+code;$('foodKcal').value=Math.round(n['energy-kcal_100g']||0);$('foodAmount').value='100 g';$('foodMsg').textContent='Produktdaten für 100 g geladen. Bitte Portionsgröße und Nährwerte prüfen.';modal.classList.add('hidden');document.querySelector('[data-tab="food"]').click();}catch(e){$('scanMsg').textContent='Produkt nicht gefunden oder keine Verbindung. Bitte Lebensmittel und Kalorien manuell eintragen.'}};
$('openPhoto').onclick=()=>{$('photoModal').classList.remove('hidden')};$('closePhoto').onclick=()=>{$('photoModal').classList.add('hidden')};
$('photoInput').onchange=e=>{const file=e.target.files[0];if(!file)return;const img=$('photoPreview');img.src=URL.createObjectURL(file);img.classList.remove('hidden')};
$('usePhoto').onclick=()=>{const file=$('photoInput').files[0];if(file){$('foodName').value=$('foodName').value||file.name.replace(/\.[^.]+$/,'');$('foodMsg').textContent='Foto ausgewählt. Kalorien bitte anhand des Etiketts oder der Portion selbst eintragen.';$('photoModal').classList.add('hidden')}};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
