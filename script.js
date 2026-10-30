const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let mem={};
const store={get:(k,d)=>k in mem?mem[k]:LS.get(k,d),set:(k,v)=>{mem[k]=v;LS.set(k,v)}};

const MODULES=[
 {t:"Phishing",b:"Phishing messages pretend to come from a trusted sender (bank, school, delivery company) to trick you into clicking a link or sharing a password.",p:["Check the sender address, not just the display name","Hover over links before clicking","Be wary of urgency: “Act now or your account will be closed”","Never share OTPs or passwords, even with someone claiming to be support"]},
 {t:"Online Scams",b:"Scams promise easy money, prizes, jobs or romance in exchange for your money or personal data.",p:["If it sounds too good to be true, it is","Verify sellers and job offers through official channels","Never send money to someone you only know online","Report scam pages and accounts to the platform"]},
 {t:"Strong Passwords",b:"A strong password is long, unique for each account, and hard to guess.",p:["Use 12+ characters, or a passphrase of 4 random words","Never reuse passwords across accounts","Use a password manager if you can","Turn on two-factor authentication (2FA)"]},
 {t:"Privacy & Personal Data",b:"What you post can last forever. Oversharing helps scammers and strangers profile you.",p:["Set social media accounts to private","Avoid posting your address, school ID or birthdate","Review app permissions regularly","Think before you post: could this be used against me?"]},
 {t:"Ethical & Responsible Use",b:"Being safe online also means respecting others: no cyberbullying, plagiarism, piracy or unauthorized access.",p:["Respect copyright and cite your sources","Do not share private messages or photos without consent","Hacking accounts or systems without permission is a crime","Report abuse instead of joining it"]}
];
const TIPS0=["Update your phone and apps regularly","Use public Wi-Fi carefully; avoid banking on it","Log out of shared computers","Back up important files","Verify before you share news or links","Cover or disable your webcam when not in use"];
const QS0=[
 {q:"Which password is the strongest?",o:["password123","Juan2005","purple-tractor-lamp-ocean","qwerty"],a:2},
 {q:"You get a text saying your account will be closed unless you click a link now. What do you do?",o:["Click it quickly","Reply with your password","Ignore it and contact the company through its official app or site","Forward it to all your friends"],a:2},
 {q:"What does 2FA add to your account?",o:["A second step to verify it is you","A faster login","More storage","Free antivirus"],a:0},
 {q:"Which is a sign of a phishing email?",o:["Correct spelling and your name","Urgent tone and a suspicious sender address","Sent from your own address book contact you know","A plain text message"],a:1},
 {q:"Is it safe to reuse one password on many accounts?",o:["Yes, it is easier to remember","Yes, if it is long","No, one breach exposes all accounts","Only for social media"],a:2},
 {q:"Which info is best NOT to post publicly?",o:["Your favorite song","Your home address and school ID","A photo of your pet","A movie review"],a:1},
 {q:"Using someone else’s account without permission is…",o:["Fine if they are a friend","Harmless prank","Unauthorized access, which may be a crime","Allowed on weekends"],a:2}
];
const getTips=()=>store.get("cs_tips",TIPS0);
const getQs=()=>store.get("cs_qs",QS0);
const getUsers=()=>store.get("cs_users",[{u:"admin",p:"admin123",admin:true}]);
const cur=()=>store.get("cs_cur",null);
const scores=()=>store.get("cs_scores",[]);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let page="home",quiz=null;
function nav(p){page=p;render()}
function render(){
  const u=cur();
  if(!u){document.getElementById("nav").innerHTML="";document.getElementById("app").innerHTML=acct();return}
  const items=[["home","Home"],["learn","Learn"],["tips","Tips"],["quiz","Quiz"],["results","Results"]];
  if(u&&u.admin)items.push(["admin","Admin"]);
  items.push(["acct",u?u.u:"Login"]);
  document.getElementById("nav").innerHTML=items.map(([k,l])=>`<button class="${page===k?"on":""}" onclick="nav('${k}')">${esc(l)}</button>`).join("");
  const v={home,learn,tips,quizPage,results,admin,acct}[page==="quiz"?"quizPage":page];
  document.getElementById("app").innerHTML=v();
}
function home(){return `<div class="card"><h3>Stay safe online</h3><p>CyberSafe helps students spot phishing, avoid scams, build strong passwords and protect their privacy.</p>
<button class="btn" onclick="nav('learn')">Start learning</button><button class="btn alt" onclick="startQuiz()">Take the quiz</button></div>
<div class="card"><h3>What you will find</h3><p class="mut">📚 ${MODULES.length} learning modules · 💡 ${getTips().length} safety tips · ❓ ${getQs().length} quiz questions · 📊 saved scores</p></div>`}
function learn(){return MODULES.map(m=>`<div class="card"><details><summary>${esc(m.t)}</summary><p>${esc(m.b)}</p><ul>${m.p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details></div>`).join("")}
function tips(){return `<div class="card"><h3>Online safety tips</h3><ul>${getTips().map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`}
function startQuiz(){const qs=[...getQs()].sort(()=>Math.random()-.5);quiz={qs,i:0,s:0,picked:null};nav("quiz")}
function quizPage(){
  if(!quiz)return `<div class="card"><h3>Cybersecurity quiz</h3><p>${getQs().length} questions. Pick an answer to see feedback right away.</p><button class="btn" onclick="startQuiz()">Start</button></div>`;
  if(quiz.i>=quiz.qs.length){
    const pct=Math.round(quiz.s/quiz.qs.length*100);
    const msg=pct>=80?"Great job, you are cyber-savvy!":pct>=50?"Good effort. Review the modules and try again.":"Keep learning! Read the modules and retry.";
    return `<div class="card"><h3>Your score: ${quiz.s}/${quiz.qs.length} (${pct}%)</h3><div class="bar"><i style="width:${pct}%"></i></div><p>${msg}</p><button class="btn" onclick="startQuiz()">Retry</button><button class="btn alt" onclick="nav('results')">View results</button></div>`}
  const q=quiz.qs[quiz.i],p=quiz.picked;
  return `<div class="card"><div class="mut">Question ${quiz.i+1} of ${quiz.qs.length}</div><div class="bar"><i style="width:${quiz.i/quiz.qs.length*100}%"></i></div><h3>${esc(q.q)}</h3>
  ${q.o.map((o,k)=>`<button class="opt ${p===null?"":k===q.a?"ok":k===p?"bad":""}" ${p===null?`onclick="pick(${k})"`:"disabled"}>${esc(o)}</button>`).join("")}
  ${p!==null?`<p>${p===q.a?"✅ Correct!":"❌ Not quite. The right answer is highlighted."}</p><button class="btn" onclick="nextQ()">${quiz.i+1<quiz.qs.length?"Next":"Finish"}</button>`:""}</div>`}
function pick(k){const q=quiz.qs[quiz.i];quiz.picked=k;if(k===q.a)quiz.s++;render()}
function nextQ(){quiz.i++;quiz.picked=null;if(quiz.i>=quiz.qs.length){const u=cur();const a=scores();a.push({u:u?u.u:"Guest",s:quiz.s,n:quiz.qs.length,d:new Date().toLocaleDateString()});store.set("cs_scores",a)}render()}
function results(){
  const u=cur(),all=scores();const mine=u&&u.admin?all:all.filter(r=>r.u===(u?u.u:"Guest"));
  return `<div class="card"><h3>Quiz results</h3>${mine.length?`<div class="wrap"><table><tr><th>User</th><th>Score</th><th>Date</th></tr>${mine.slice().reverse().map(r=>`<tr><td>${esc(r.u)}</td><td>${r.s}/${r.n}</td><td>${esc(r.d)}</td></tr>`).join("")}</table></div>`:`<p class="mut">No results yet. Take the quiz!</p>`}</div>
  <p class="mut">Scores are saved in this browser only.</p>`}
function acct(){
  const u=cur();
  if(u)return `<div class="card"><h3>Hello, ${esc(u.u)}</h3><p class="mut">${u.admin?"Administrator":"Student"} account</p><button class="btn red" onclick="logout()">Log out</button></div>`;
  return `<div class="card"><h3>Welcome to CyberSafe</h3><p>Please log in or register to access the website.</p><input id="un" placeholder="Username"><input id="pw" type="password" placeholder="Password"><p id="msg" class="mut"></p>
  <button class="btn" onclick="login()">Login</button><button class="btn alt" onclick="reg()">Register</button><p class="mut">Demo admin: admin / admin123. Passwords are stored in plain text in your browser for this demo only. Never reuse a real password here.</p></div>`}
function login(){const un=un_(),pw=document.getElementById("pw").value;const f=getUsers().find(x=>x.u===un&&x.p===pw);if(!f)return msg("Wrong username or password.");store.set("cs_cur",f);nav("home")}
function reg(){const un=un_(),pw=document.getElementById("pw").value;if(un.length<3)return msg("Username needs 3+ characters.");if(pw.length<8)return msg("Use a password of 8+ characters.");const us=getUsers();if(us.some(x=>x.u===un))return msg("Username taken.");const n={u:un,p:pw,admin:false};us.push(n);store.set("cs_users",us);store.set("cs_cur",n);nav("home")}
function un_(){return document.getElementById("un").value.trim()}
function msg(t){document.getElementById("msg").textContent=t}
function logout(){store.set("cs_cur",null);nav("home")}
function admin(){
  const u=cur();if(!u||!u.admin)return `<div class="card">Admins only.</div>`;
  const t=getTips(),q=getQs();
  return `<div class="card"><h3>Manage tips</h3><ul>${t.map((x,i)=>`<li>${esc(x)} <button class="btn alt" onclick="delTip(${i})">Delete</button></li>`).join("")}</ul><input id="nt" placeholder="New tip"><button class="btn" onclick="addTip()">Add tip</button></div>
  <div class="card"><h3>Manage quiz questions</h3><ul>${q.map((x,i)=>`<li>${esc(x.q)} <button class="btn alt" onclick="delQ(${i})">Delete</button></li>`).join("")}</ul>
  <input id="nq" placeholder="Question"><input id="o0" placeholder="Option A"><input id="o1" placeholder="Option B"><input id="o2" placeholder="Option C"><input id="o3" placeholder="Option D">
  <select id="ca"><option value="0">Correct: A</option><option value="1">Correct: B</option><option value="2">Correct: C</option><option value="3">Correct: D</option></select><button class="btn" onclick="addQ()">Add question</button></div>
  <button class="btn red" onclick="resetAll()">Reset content and scores</button>`}
function addTip(){const v=document.getElementById("nt").value.trim();if(!v)return;const t=getTips();t.push(v);store.set("cs_tips",t);render()}
function delTip(i){const t=getTips();t.splice(i,1);store.set("cs_tips",t);render()}
function addQ(){const q=document.getElementById("nq").value.trim(),o=[0,1,2,3].map(i=>document.getElementById("o"+i).value.trim());if(!q||o.some(x=>!x))return alert("Fill in the question and all 4 options.");const a=getQs();a.push({q,o,a:+document.getElementById("ca").value});store.set("cs_qs",a);render()}
function delQ(i){const a=getQs();a.splice(i,1);store.set("cs_qs",a);render()}
function resetAll(){if(confirm("Reset tips, questions and scores?")){store.set("cs_tips",TIPS0);store.set("cs_qs",QS0);store.set("cs_scores",[]);render()}}
render();
