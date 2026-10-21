"use strict";
const KMOVES=[[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
function knightMoves(r,c,n,blocked){blocked=blocked||[];const out=[];for(const[dr,dc]of KMOVES){const a=r+dr,b=c+dc;if(a>=0&&b>=0&&a<n&&b<n&&!blocked.some(x=>x[0]===a&&x[1]===b))out.push([a,b]);}return out;}
function isKnightMove(r1,c1,r2,c2){const a=Math.abs(r1-r2),b=Math.abs(c1-c2);return (a===1&&b===2)||(a===2&&b===1);}
function minJumps(from,to,n,blocked){const key=p=>p[0]*n+p[1];const dist={};dist[key(from)]=0;const q=[from];while(q.length){const p=q.shift();if(p[0]===to[0]&&p[1]===to[1])return dist[key(p)];for(const m of knightMoves(p[0],p[1],n,blocked))if(!(key(m)in dist)){dist[key(m)]=dist[key(p)]+1;q.push(m);}}return -1;}
// L path: two straight steps along the long side, then one turn step
function lPath(from,to){const dr=to[0]-from[0],dc=to[1]-from[1],sr=Math.sign(dr),sc=Math.sign(dc);
 if(Math.abs(dr)===2)return[[from[0]+sr,from[1]],[from[0]+2*sr,from[1]],[to[0],to[1]]];
 return[[from[0],from[1]+sc],[from[0],from[1]+2*sc],[to[0],to[1]]];}
const LEARN={n:5,k:[2,2],demo:[[0,3],[2,4],[4,3]],tap:[[2,2],[0,1],[1,3]]};
const LEVELS=[
 {n:4,k:[0,0],say:"l1"},
 {n:5,k:[2,2],star:[0,1],say:"l2"},
 {n:5,k:[2,2],say:"l3"},
 {n:6,k:[5,0],apples:[[3,1],[1,2],[2,4]],say:"l4"},
 {n:8,k:[7,0],star:[0,7],rock:[[6,1],[5,2],[6,0],[4,4],[2,5]],say:"l5"}
];
const STICKERS=["🎓","🦄","⭐","🔍","🍎","🏆"];
if(typeof module!=="undefined"){module.exports={knightMoves,isKnightMove,minJumps,lPath,LEARN,LEVELS};}
else{
const $=id=>document.getElementById(id);
function knightSVG(){return '<svg viewBox="0 0 100 100" aria-label="Knighty"><g class="kb">'+
'<ellipse cx="50" cy="94" rx="30" ry="5" fill="#0002"/>'+
'<path d="M26 92 Q22 62 40 44 L64 50 Q60 72 74 92Z" fill="#b48cff"/>'+
'<path d="M30 92 h44 v-6 q-22 -6 -44 0z" fill="#ffd93b"/>'+
'<path d="M44 16 L50 2 L57 18Z" fill="#a77cf5"/><path d="M47 16 L50 8 L54 17Z" fill="#ffb3d1"/>'+
'<ellipse cx="57" cy="36" rx="25" ry="19" fill="#c9a6ff" transform="rotate(18 57 36)"/>'+
'<ellipse cx="74" cy="49" rx="14" ry="11" fill="#eadcff"/>'+
'<path d="M40 18 Q24 28 28 60 Q32 44 40 40 Q30 34 46 24Z" fill="#ff6fa8"/><circle cx="40" cy="20" r="6" fill="#ff8fbc"/><circle cx="31" cy="34" r="6" fill="#ff8fbc"/>'+
'<path d="M44 14 l4 -8 l4 6 l4 -7 l3 9z" fill="#ffd93b"/>'+
'<g class="eye"><circle cx="58" cy="32" r="8" fill="#fff"/><circle cx="60" cy="33" r="5" fill="#3a2a5a"/><circle cx="62" cy="31" r="1.8" fill="#fff"/></g>'+
'<circle cx="66" cy="44" r="4" fill="#ff9ec4" opacity=".7"/><circle cx="80" cy="46" r="1.6" fill="#7a5aa0"/>'+
'<ellipse class="mouth" cx="76" cy="55" rx="5" ry="1.6" fill="#a0306a"/>'+
'</g></svg>';}
function castleSVG(lit){let w="";const xs=[8,18,28,38,23];const ys=[22,22,22,22,8];for(let i=0;i<5;i++)w+='<rect x="'+(xs[i]-2)+'" y="'+ys[i]+'" width="6" height="7" rx="3" class="'+(i<lit?"win-on":"win-off")+'"/>';
 return '<svg class="castle" viewBox="0 0 48 40"><path d="M2 38V14h6v4h4v-4h6v4h4V2h4v16h4v-4h6v4h4v-4h6v24z" fill="#9a86c8"/>'+w+'</svg>';}
// ---------- audio ----------
let AC=null;
function tone(f1,f2,dur,type,vol,delay){if(!AC)return;const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||"sine";o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.25,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+dur+0.05);}
const SFX={
 boing(){tone(180,520,0.12,"sine",0.3);tone(520,260,0.25,"sine",0.25,0.12);},
 pop(){if(!AC)return;const n=AC.sampleRate*0.12,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();f.type="bandpass";f.frequency.value=2200;g.gain.value=0.5;s.buffer=b;s.connect(f).connect(g).connect(AC.destination);s.start();tone(600,1400,0.08,"sine",0.25,0.03);},
 sparkle(){[1320,1660,1980,2640,3300].forEach((f,i)=>tone(f,f*1.01,0.18,"triangle",0.12,i*0.06));},
 fanfare(){[[523,0],[659,0.14],[784,0.28],[1047,0.45]].forEach(([f,d],i)=>tone(f,f,i===3?0.7:0.16,"triangle",0.22,d));[784,988,1175].forEach(f=>tone(f,f,0.7,"sine",0.08,0.45));},
 uhoh(){tone(460,430,0.18,"sine",0.12);tone(340,300,0.3,"sine",0.12,0.22);},
 tick(){tone(880,880,0.08,"sine",0.1);}
};
let curAudio=null,lastKey="intro",lastText="",playId=0;
function name(){return (localStorage.getItem("knightName")||"").trim();}
function shown(t){const n=name();return n?t.replace(/friend/g,n):t;}
function setTalking(on){document.querySelectorAll(".knighty").forEach(k=>k.classList.toggle("talking",on));}
function speak(key,txt){lastKey=key;lastText=txt||LINES[key];$("bubble").textContent=shown(lastText);const id=++playId;
 if(curAudio){curAudio.pause();curAudio=null;}try{speechSynthesis.cancel();}catch(e){}
 return new Promise(res=>{let fin=false;const done=()=>{if(fin)return;fin=true;if(id===playId)setTalking(false);res();};setTimeout(done,1500+LINES[key].length*85);
  const fallback=()=>{try{const u=new SpeechSynthesisUtterance(LINES[key]);u.rate=0.9;u.pitch=1.3;u.onend=done;u.onerror=done;setTalking(true);speechSynthesis.speak(u);}catch(e){done();}};
  const a=new Audio("audio/"+key+".mp3");curAudio=a;a.onended=done;a.onerror=()=>{if(id===playId)fallback();else res();};
  setTalking(true);a.play().catch(()=>{if(id===playId)fallback();else res();});});}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// ---------- state ----------
let done=+(localStorage.getItem("knightDone2")||0); // 0=learn not done; 1..6
let stage=Math.min(done,LEVELS.length); // 0=learn, 1..5 levels
let st=null,busy=false;
function drawProgress(){const lit=Math.max(0,done-1);let s="";for(let i=0;i<5;i++)s+=i<lit?"⭐":"☆";$("stars").textContent=s;$("castleTop").innerHTML=castleSVG(lit);$("startCastle").innerHTML=castleSVG(lit).replace('class="castle"','class="castle" style="width:120px;height:100px"');}
function cur(){return stage===0?LEARN:LEVELS[stage-1];}
function eq(a,b){return !!(a&&b&&a[0]===b[0]&&a[1]===b[1]);}
function status(t){$("status").textContent=t?shown(t):"";}
function controls(html){$("controls").innerHTML=html||"";}
function startStage(){const L=cur();st={k:L.k.slice(),hops:0,found:[],apple:0,shown:false,jumps:0,phase:"demo",ti:0,labels:{},steps:[],landed:false,
 best:L.star?minJumps(L.k,L.star,L.n,L.rock):0};drawProgress();status(stage===0?"Learn the knight jump":"Level "+stage);controls("");render();
 if(stage===0)runLearn();else speak(L.say);}
function render(){const L=cur(),n=L.n,s=Math.min(84,Math.floor((Math.min(innerWidth,innerHeight*0.9)-40)/n));const B=$("board");B.style.gridTemplateColumns="repeat("+n+","+s+"px)";B.style.setProperty("--s",s+"px");B.innerHTML="";
 const reach=knightMoves(st.k[0],st.k[1],n,L.rock);
 for(let r=0;r<n;r++)for(let c=0;c<n;c++){const d=document.createElement("div");d.className="sq "+((r+c)%2?"d":"l");d.style.height=s+"px";const p=[r,c];
  if(eq(p,st.k)){d.innerHTML=knightSVG();if(st.landed)d.classList.add("land");}
  else if(L.rock&&L.rock.some(x=>eq(x,p)))d.textContent="🪨";
  else if(L.star&&eq(p,L.star))d.textContent="⭐";
  else if(L.apples){const i=L.apples.findIndex(x=>eq(x,p));if(i>=st.apple){d.textContent="🍎";d.insertAdjacentHTML("beforeend",'<span class="num">'+(i+1)+'</span>');}}
  if(stage===1&&st.shown&&reach.some(x=>eq(x,p)))d.classList.add("spark");
  if(stage===0&&st.phase==="tap"&&eq(p,LEARN.tap[st.ti]))d.classList.add("spark");
  if(stage===3&&st.found.some(x=>eq(x,p)))d.classList.add("good");
  if(st.steps.some(x=>eq(x,p)))d.classList.add("step");
  const lab=st.labels[r+","+c];if(lab)d.insertAdjacentHTML("beforeend",'<span class="lab">'+lab+'</span>');
  d.onclick=()=>tap(r,c,d);B.appendChild(d);}
 st.landed=false;}
function hop(p){st.k=p.slice();st.jumps++;st.landed=true;SFX.boing();}
function arrow(a,b){return b[0]<a[0]?"⬆":b[0]>a[0]?"⬇":b[1]<a[1]?"⬅":"➡";}
async function demoMove(to){const from=st.k.slice(),path=lPath(from,to);st.labels={};st.steps=[];
 const words=["1","2","1"];let prev=from;
 speak("count");await sleep(250);
 for(let i=0;i<3;i++){st.steps.push(path[i]);st.labels[path[i][0]+","+path[i][1]]=arrow(prev,path[i])+words[i];prev=path[i];SFX.tick();render();await sleep(i===1?900:600);}
 await sleep(300);hop(to);render();await sleep(700);st.labels={};st.steps=[];render();}
async function runLearn(){busy=true;controls("");await speak("learn1");
 for(const t of LEARN.demo){if(stage!==0)return;await demoMove(t);}
 st.phase="tap";st.ti=0;busy=false;render();speak("learn3");status("Tap the sparkly square!");
 controls('<button class="big blue" id="replay">👀 Watch again</button>');$("replay").onclick=replayDemo;}
async function replayDemo(){if(busy)return;busy=true;const save=st.k.slice();st.k=LEARN.k.slice();st.phase="demo";render();speak("learn2");await sleep(2600);
 for(const t of LEARN.demo)await demoMove(t);st.k=save;st.phase="tap";busy=false;render();speak("learn3");}
function oops(d){d.classList.add("bad");SFX.uhoh();speak("oops");}
async function tap(r,c,d){if(busy)return;const L=cur(),p=[r,c];
 if(stage===0){if(st.phase!=="tap")return;const t=LEARN.tap[st.ti];
  if(!eq(p,t)){speak("tapsparkle");return;}
  const path=lPath(st.k,t);st.steps=path.slice(0,2);render();busy=true;await sleep(350);st.steps=[];hop(t);st.ti++;render();busy=false;
  if(st.ti>=LEARN.tap.length){speak("learndone");return win();}
  speak("whee");return;}
 if(eq(p,st.k)){if(stage===1){st.shown=true;SFX.sparkle();render();speak("l1show");}else speak("me");return;}
 if(L.rock&&L.rock.some(x=>eq(x,p))){d.classList.add("bad");SFX.uhoh();speak("rock");return;}
 const ok=isKnightMove(st.k[0],st.k[1],r,c);
 if(stage===1){if(!st.shown){speak("tapme");return;}if(!ok)return oops(d);hop(p);st.hops++;st.shown=false;render();status("Hops: "+st.hops+" of 3");if(st.hops>=3)return win();speak(st.hops===1?"hop":"whee");return;}
 if(!ok)return oops(d);
 if(stage===2){if(eq(p,L.star)){hop(p);render();SFX.sparkle();return win();}d.classList.add("good");SFX.tick();speak("l2near");return;}
 if(stage===3){if(!st.found.some(x=>eq(x,p))){st.found.push(p);SFX.sparkle();}const all=knightMoves(st.k[0],st.k[1],L.n).length;render();status("Found "+st.found.length+" of "+all);if(st.found.length>=all)return win();speak("yes");return;}
 if(stage===4){hop(p);const i=L.apples.findIndex(x=>eq(x,p));
  if(i===st.apple){st.apple++;setTimeout(SFX.pop,150);status("Apples: "+st.apple+" of 3");render();if(st.apple>=L.apples.length)return win();speak("apple");}
  else{render();speak(i>st.apple?"applewrong":"l4hop");}return;}
 if(stage===5){hop(p);render();status("Jumps: "+st.jumps+"  (fewest: "+st.best+")");if(eq(p,L.star)){SFX.sparkle();return win(st.jumps<=st.best?"l5best":"l5ok");}speak("l5hop");}
}
function confetti(){const cols=["#ff8fb1","#ffd93b","#6fd58a","#7cb8ff","#c9a6ff","#ffa95e"];for(let i=0;i<90;i++){const e=document.createElement("div");e.className="conf";e.style.left=Math.random()*100+"vw";e.style.background=cols[i%6];e.style.animationDuration=(1.6+Math.random()*2)+"s";e.style.animationDelay=Math.random()*.6+"s";document.body.appendChild(e);setTimeout(()=>e.remove(),4500);}}
async function win(extra){busy=true;done=Math.max(done,stage+1);localStorage.setItem("knightDone2",String(done));drawProgress();
 SFX.fanfare();confetti();const g=$("guideK");g.classList.add("dance");setTimeout(()=>g.classList.remove("dance"),3000);
 const last=stage===LEVELS.length;
 if(extra)await speak(extra);else if(stage===0)await sleep(2500);
 $("sticker").textContent=STICKERS[stage];$("cardCastle").innerHTML=castleSVG(Math.max(0,done-1)).replace('class="castle"','class="castle" style="width:110px;height:92px"');
 $("cardtxt").textContent=shown(last?"The whole castle shines! You're a knight champion, friend!":stage===0?"You learned the L jump, friend!":"A castle light is shining, friend!");
 $("next").textContent=last?"Play again ↺":"Next ➜";$("overlay").style.display="flex";busy=false;speak(last?"champ":"win");}
$("next").onclick=()=>{$("overlay").style.display="none";stage=stage>=LEVELS.length?1:stage+1;startStage();};
$("go").onclick=async()=>{try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}
 localStorage.setItem("knightName",$("name").value.trim());$("start").style.display="none";SFX.sparkle();
 if(done===0){await speak("intro");}startStage();};
$("again").onclick=()=>speak(lastKey,lastText);
$("bookBtn").onclick=()=>{$("stickers").innerHTML=STICKERS.map((s,i)=>'<div class="'+(i<done?"":"lock")+'">'+(i<done?s:"🔒")+'</div>').join("");$("book").style.display="flex";speak("book");};
$("closeBook").onclick=()=>{$("book").style.display="none";};
$("reset").onclick=()=>{if(confirm("Start over from the beginning?")){done=0;localStorage.removeItem("knightDone2");stage=0;startStage();}};
addEventListener("resize",()=>st&&render());
$("startK").innerHTML=knightSVG();$("guideK").innerHTML=knightSVG();$("name").value=name();drawProgress();
}
