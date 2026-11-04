var KARIMA="201020956352";                          // رقم مس كريمة بصيغة دولية بدون +
var API="https://sheetdb.io/api/v1/l5bu05bnss7oe";  // رابط SheetDB
var CHAT_API="https://rapid-wildflower-d6e4.msrybsmlh.workers.dev";                                    // رابط الـ Worker بتاع Gemini (شوفي الملف gemini-worker.js)
var SCHOOL_URL="https://elmasryfathy774-bit.github.io/System/";
var SPRIX_URL="https://sprixportal.jp/";
var LIB_URL="http://studentbooks.moe.gov.eg/";
var pages=[["home","الرئيسية","home"],["chat","المساعد","chat"],["books","بنك الكتب","book"],["platforms","المنصات","globe"],["ig","مركز IG","cap"],["focus","جلسة مذاكرة","play"],["cards","بطاقات تحفيزية","sun"],["translate","الترجمة","lang"],["lost-found","المفقودات","search"],["study-share","الملخصات","file"],["leaderboard","لوحة الشرف","trophy"],["parent","ولي الأمر","school"],["suggestions","المقترحات","mail"]];
var FAQ={
"عن المدرسة":[["مين مديرة المدرسة؟","مديرة المدرسة هي مس مروة أمين."],["مين وكيلة المدرسة؟","وكيلة المدرسة هي مس أسماء يحيي."],["المدرسة فين؟","مدرسة دكتور أحمد زويل في الحي 15 بمدينة العاشر من رمضان."],["فين معمل الكمبيوتر والمكتبة؟","معمل الكمبيوتر والمكتبة في الطابق الثاني."],["مين مس كريمة؟","مس كريمة هي اللي بتنسّق استلام وتسليم الكتب الخارجية والمفقودات على واتساب، وبسرية تامة."],["مواعيد الامتحانات إمتى؟","معنديش جدول الامتحانات. راجعي لوحة إعلانات المدرسة أو اسألي المعلمة."]],
"المذاكرة":[["إزاي أنظم وقتي؟","قسّمي يومك لفترات: ٤٥ دقيقة مذاكرة و١٠ دقايق راحة. ابدأي بالمادة الأصعب وإنتي نشيطة، واكتبي جدول أسبوعي بسيط فيه وقت للراحة والنوم."],["إزاي أذاكر للامتحان؟","راجعي الملخصات بدل ما تقري المنهج كله من الأول، وحلّي أسئلة وامتحانات السنين اللي فاتت. وقبل الامتحان نامي كويس."],["إزاي أركز وأنا بذاكر؟","ذاكري في مكان هادي وسيبي الموبايل بعيد. اشتغلي ٢٥ دقيقة وريّحي ٥ دقايق، واشربي مياه."],["محتاجة ملخصات","روحي لصفحة «الملخصات» في الموقع، هتلاقي ملخصات زميلاتك، وتقدري تنشري ملخصك كمان."]],
"عن الموقع":[["إزاي أطلب كتاب خارجي؟","روحي لصفحة «بنك الكتب» واضغطي «طلب الكتاب» جنب الكتاب. هيفتح واتساب مع مس كريمة بسرية تامة وبدون أي إحراج."],["إزاي أتبرع بكتاب؟","في صفحة «بنك الكتب» املي بيانات الكتاب واضغطي «أتبرع بالكتاب». ولو كتبتي اسمك الأول هتظهري في لوحة الشرف."],["ضاع مني حاجة أعمل إيه؟","روحي لصفحة «المفقودات» وسجّلي وصف الشيء. ومس كريمة هتساعدك في استلامه."],["إزاي أبعت اقتراح بدون اسم؟","من صفحة «المقترحات» اكتبي رسالتك واضغطي إرسال. اسمك مش بيتسجل خالص."]]
};
var chatHist=[];
// بيانات الطلاب/الحضور/الدرجات لم تعد تُقرأ من المتصفح مباشرة، بل عبر الـ Worker الآمن (config.js)

function ic(n){return '<svg class="ic"><use href="#i-'+n+'"/></svg>'}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML}
function wa(t){return "https://wa.me/"+KARIMA+"?text="+encodeURIComponent(t)}
function tf(u,o){var c=new AbortController(),t=setTimeout(function(){c.abort()},15000);o=o||{};o.signal=c.signal;return fetch(u,o).then(function(r){clearTimeout(t);return r},function(e){clearTimeout(t);throw e})}
function get(s){return tf(API+"?sheet="+s).then(function(r){if(!r.ok)throw 0;return r.json()})}
function post(s,row){return tf(API+"?sheet="+s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:[row]})}).then(function(r){if(!r.ok)throw 0})}
function today(){var n=new Date();return n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2)+"-"+("0"+n.getDate()).slice(-2)}
function app(h){document.getElementById("app").innerHTML=h}
function $(i){return document.getElementById(i)}
function empty(i,t){return '<div class="empty">'+ic(i)+'<p>'+t+'</p></div>'}
var err='<p class="note">مش قادرة أوصل لجدول البيانات دلوقتي. اتأكدي إن الموقع مرفوع على استضافة وإن الإنترنت شغال.</p>';

var FS={mode:"focus",d:{focus:25,rest:5},left:1500,run:false,end:0,tid:null,subj:"عربي"};
function f2(n){return(n<10?"0":"")+n}
function fsLog(k){try{return JSON.parse(localStorage.getItem("study_"+(k||today()))||"null")||{s:0,m:0}}catch(e){return{s:0,m:0}}}
function fsAdd(m){var l=fsLog();l.s++;l.m+=m;try{localStorage.setItem("study_"+today(),JSON.stringify(l))}catch(e){}}
function fsLeft(){return FS.run?Math.max(0,Math.round((FS.end-Date.now())/1000)):FS.left}
function fsBeep(){try{var A=window.AudioContext||window.webkitAudioContext,c=new A();[880,660,880].forEach(function(f,k){var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+k*.25;o.frequency.value=f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.2,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.start(t);o.stop(t+.25)})}catch(e){}try{if(navigator.vibrate)navigator.vibrate([200,100,200])}catch(e){}}
function fsPaint(){var t=$("ft"),l=fsLeft(),tot=FS.d[FS.mode]*60,tx=f2(Math.floor(l/60))+":"+f2(l%60);
 document.title=FS.run?tx+" · Zewail Smart":"Zewail Smart";if(!t)return;
 t.textContent=tx;$("fr").style.setProperty("--v",Math.round((tot-l)/tot*100));$("fr").className="fr "+FS.mode;
 $("fm").textContent=FS.mode==="focus"?"مذاكرة · "+FS.subj:"وقت الراحة";$("fgo").textContent=FS.run?"إيقاف مؤقت":(l<tot?"كمّلي":"ابدئي");
 [].forEach.call(document.querySelectorAll(".fmodes button"),function(b){b.classList.toggle("on",b.dataset.m===FS.mode)});
 [].forEach.call(document.querySelectorAll("#fp button"),function(b){b.classList.toggle("on",b.dataset.p===FS.d.focus+"-"+FS.d.rest)})}
function fsStop(){clearInterval(FS.tid);FS.tid=null}
function fsStart(){if(FS.run)return;FS.run=true;FS.end=Date.now()+FS.left*1000;FS.tid=setInterval(function(){if(fsLeft()<=0)fsDone();else fsPaint()},500);fsPaint()}
function fsPause(){if(!FS.run)return;FS.left=fsLeft();FS.run=false;fsStop();fsPaint()}
function fsSet(m){fsPause();FS.mode=m;FS.left=FS.d[m]*60;fsPaint()}
function fsDone(){fsStop();FS.run=false;var was=FS.mode;if(was==="focus")fsAdd(FS.d.focus);fsBeep();FS.mode=was==="focus"?"rest":"focus";FS.left=FS.d[FS.mode]*60;fsPaint();
 var m=$("fmsg");if(m)m.textContent=was==="focus"?"برافو! خلّصتي جلسة 🎉 خدي راحة قصيرة.":"الراحة خلصت، يلا نكمّل 💪";if($("fst"))fsStats()}
function fsStats(){var l=fsLog(),G=4,ds=[],i,d,k,v;
 for(i=6;i>=0;i--){d=new Date();d.setDate(d.getDate()-i);k=d.getFullYear()+"-"+f2(d.getMonth()+1)+"-"+f2(d.getDate());v=fsLog(k).m;ds.push([d.toLocaleDateString("ar-EG",{weekday:"short"}),v])}
 var mx=Math.max.apply(null,ds.map(function(x){return x[1]}).concat([1])),gp=Math.min(100,Math.round(l.s/G*100));
 $("fst").innerHTML='<div class="stats"><div><b>'+l.s+'</b><span>جلسات اليوم</span></div><div><b>'+l.m+'</b><span>دقيقة مذاكرة</span></div><div><b>'+gp+'%</b><span>هدف اليوم ('+G+' جلسات)</span></div></div><div class="gbar"><i style="width:'+gp+'%"></i></div><div class="card col"><div class="t">آخر ٧ أيام (بالدقايق)</div><div class="wk">'+ds.map(function(x){return '<div><em>'+x[1]+'</em><i style="height:'+Math.max(4,Math.round(x[1]/mx*80))+'px"></i><span>'+esc(x[0])+'</span></div>'}).join("")+'</div></div>'}
var MC=[["push","كل صفحة بتذاكريها النهاردة بتقرّبك خطوة من حلمك."],["push","مش لازم تكوني الأفضل، المهم تكوني أفضل من إمبارح."],["push","الاستمرار أهم من الحماس. ٢٠ دقيقة كل يوم أحسن من يوم كامل مرة في الشهر."],["push","إنتي أقوى من أي مادة صعبة، وأذكى من أي امتحان."],["push","الخطوة الصغيرة اللي بتعمليها دلوقتي هتبقى فخر بكرة."],["push","ابدأي حتى لو مش جاهزة. الجاهزية بتيجي بعد البداية."],
["exam","خدي نَفَس عميق. إنتي ذاكرتي، وده كفاية تثقي في نفسك."],["exam","نامي كويس الليلة قبل الامتحان، دماغك بتثبّت المعلومات وإنتي نايمة."],["exam","اقري السؤال مرتين قبل ما تجاوبي، نص الدرجة في الفهم."],["exam","ابدأي بالأسئلة اللي عارفاها، وده هيديكي ثقة تكمّلي بيها."],["exam","لو نسيتي معلومة، سيبيها وكمّلي. هتفتكريها وإنتي بتحلي غيرها."],["exam","الامتحان مش بيقيس قيمتك، هو بس خطوة في الطريق."],
["tired","التعب دليل إنك بتحاولي. ريّحي شوية وارجعي أقوى."],["tired","مش لازم كل يوم يبقى مثالي. كفاية إنك ما استسلمتيش."],["tired","لو مضغوطة، اتكلمي مع حد بتثقي فيه. مفيش حد لازم يشيل لوحده."],["tired","اشربي مياه، وقومي اتحركي ٥ دقايق. جسمك محتاج شوية اهتمام."],["tired","الغلط مش فشل، ده طريقة المخ في التعلم."],["tired","إنتي مش متأخرة. كل واحدة ليها سرعتها ومواعيدها."],
["tips","ذاكري المادة الصعبة أول ما تبدأي، وإنتي لسه نشيطة."],["tips","اشرحي الدرس بصوت عالي كأنك بتدرّسيه لصاحبتك، ده أقوى مراجعة."],["tips","حلّي أوراق امتحانات السنين اللي فاتت، وراجعي إجابتك بالـ Mark Scheme."],["tips","سيبي الموبايل في أوضة تانية وقت الجلسة، التركيز بيتضاعف."],["tips","راجعي اللي ذاكرتيه بعد يوم وبعد أسبوع، كده بيثبت في الدماغ."],["tips","اكتبي هدف واحد واضح للجلسة قبل ما تبدئي."]];
var MG=["linear-gradient(135deg,#6c3fd1,#ff6fa5)","linear-gradient(135deg,#0f8f77,#4fd6b6)","linear-gradient(135deg,#f59e0b,#ef4444)","linear-gradient(135deg,#2563eb,#8b5cf6)","linear-gradient(135deg,#db2777,#f59e0b)","linear-gradient(135deg,#0e7490,#22d3ee)"];
var MT={push:"تحفيز",exam:"قبل الامتحان",tired:"لو تعبانة",tips:"نصيحة مذاكرة"};

var V={
home:function(){var d={chat:"اسألي أي سؤال عن المدرسة والمذاكرة","books":"شوفي الكتب المتاحة وتبرعي بكتبك",platforms:"منصات دولية للمذاكرة والتعلم",ig:"متابعة منهج IG وبطاقات مراجعة ودرجات وامتحانات",focus:"تايمر بومودورو ومتابعة مذاكرتك",cards:"كلام حلو يشجعك كل يوم",translate:"ترجمي أي كلمة أو جملة فورًا","lost-found":"ضاع منكِ حاجة أو لقيتي حاجة","study-share":"ملخصات وكشاكيل زميلاتك","leaderboard":"سفيرات الخير",parent:"الحضور والغياب والدرجات والإنذارات","suggestions":"رأيك بدون اسم"};
 app('<h2>تحبي تروحي فين؟</h2><div class="grid">'+pages.slice(1).map(function(p,i){return '<a class="tile'+(p[0]==="chat"?' wide':'')+'" style="animation-delay:'+i*.06+'s" href="#'+p[0]+'"><div class="bx">'+ic(p[2])+'</div><b>'+(p[0]==="chat"?"المساعد الذكي":p[1])+'</b><span>'+d[p[0]]+'</span></a>'}).join("")+'</div>')},

chat:function(){
 app('<h2>المساعد الذكي</h2><p class="sub">اختاري موضوع وسؤال وأنا أجاوبك.</p><div class="chat" id="ch"></div><div class="chips" id="cc"></div><div class="cbar"><input id="ci" placeholder="أو اكتبي سؤالك هنا" autocomplete="off"><button class="btn" id="cs" aria-label="إرسال">'+ic("send")+'</button></div>');
 function add(t,w){var b=document.createElement("div");b.className="bub "+w;b.textContent=t;$("ch").appendChild(b);return b}
 function chip(t,f){var c=document.createElement("button");c.className="chip";c.textContent=t;c.onclick=f;$("cc").appendChild(c)}
 function end(){$("cc").scrollIntoView({block:"end"})}
 function menu(){$("cc").innerHTML="";Object.keys(FAQ).forEach(function(k){chip(k,function(){add(k,"me");add("تمام، اختاري السؤال اللي عايزاه:","bot");qs(k)})});end()}
 function qs(k){$("cc").innerHTML="";FAQ[k].forEach(function(x){chip(x[0],function(){add(x[0],"me");add(x[1],"bot");qs(k)})});chip("رجوع للمواضيع",function(){menu()});end()}
 add("مرحباً بكِ يا صديقتي، أنا شات بوت مساعد ذكي، تم تصميمي من مدرسة دكتور أحمد زويل. اختاري موضوع من تحت وأنا أجاوبك.","bot");menu();
 function send(){var i=$("ci"),t=i.value.trim();if(!t)return;i.value="";add(t,"me");
  if(!CHAT_API){add("اختاري سؤال من الأزرار اللي تحت.","bot");end();return}
  var w=add("...","bot");end();
  tf(CHAT_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:chatHist.slice(-10)})}).then(function(r){return r.json()}).then(function(d){var r=d.reply||"معلش، حصلت مشكلة. جرّبي تاني.";w.textContent=r;chatHist.push({role:"user",text:t},{role:"model",text:r});end()}).catch(function(){w.textContent="معلش، مقدرتش أرد دلوقتي. اختاري سؤال من الأزرار.";end()})}
 $("cs").onclick=send;$("ci").onkeydown=function(e){if(e.key==="Enter")send()}},

platforms:function(){
 var FK="fav_platforms",fav=[];try{fav=JSON.parse(localStorage.getItem(FK)||"[]")}catch(e){}
 var cat="all",q="";
 var CATS=[["all","الكل"],["fav","المفضلة"],["math","رياضيات وعلوم"],["lang","لغات"],["skill","مهارات وبرمجة"],["tool","أدوات مذاكرة"]];
 // [id, تصنيف, اسم, وصف, رابط, أيقونة, لون, بلد]
 var INTL=[
  ["khan","math","Khan Academy","شرح مجاني للرياضيات والعلوم بالفيديو والتمارين","https://www.khanacademy.org/","play","linear-gradient(135deg,#14bf96,#0b8f6f)","USA"],
  ["geo","math","GeoGebra","رياضيات وهندسة تفاعلية ترسمي بيها وتجربي","https://www.geogebra.org/","layers","linear-gradient(135deg,#6557d2,#9a8cf5)","AT"],
  ["desmos","math","Desmos","آلة حاسبة ورسم بياني أونلاين","https://www.desmos.com/calculator","layers","linear-gradient(135deg,#2e8b57,#6fcf97)","USA"],
  ["phet","math","PhET","تجارب علوم وفيزياء افتراضية بالعربي","https://phet.colorado.edu/ar/","globe","linear-gradient(135deg,#f59e0b,#f97316)","USA"],
  ["duo","lang","Duolingo","تعلّمي لغة جديدة في ١٠ دقايق باليوم","https://www.duolingo.com/","lang","linear-gradient(135deg,#58cc02,#3ea000)","USA"],
  ["bbc","lang","BBC Learning English","دروس إنجليزي ونطق من بي بي سي","https://www.bbc.co.uk/learningenglish","lang","linear-gradient(135deg,#bb1919,#e8505b)","UK"],
  ["bc","lang","British Council Kids","ألعاب وقصص لتحسين الإنجليزي","https://learnenglishkids.britishcouncil.org/","book","linear-gradient(135deg,#1d4ed8,#60a5fa)","UK"],
  ["cour","skill","Coursera","كورسات جامعية دولية بشهادات","https://www.coursera.org/","cap","linear-gradient(135deg,#0056d2,#2a8bf2)","USA"],
  ["edx","skill","edX","كورسات من هارفارد وMIT وغيرهم","https://www.edx.org/","cap","linear-gradient(135deg,#02262b,#0e7c86)","USA"],
  ["scr","skill","Scratch","اتعلمي البرمجة بالبلوكات وسوّي ألعابك","https://scratch.mit.edu/","play","linear-gradient(135deg,#ff8c1a,#ffbf00)","MIT"],
  ["code","skill","Code.org","ساعة برمجة وكورسات للمبتدئين","https://code.org/","layers","linear-gradient(135deg,#00adbc,#006b75)","USA"],
  ["ted","tool","TED-Ed","فيديوهات قصيرة بتفتّح العقل","https://ed.ted.com/","play","linear-gradient(135deg,#e62b1e,#ff6a5c)","USA"],
  ["quiz","tool","Quizlet","بطاقات مراجعة واختبارات ذاتية","https://quizlet.com/","file","linear-gradient(135deg,#4255ff,#8b97ff)","USA"],
  ["gcl","tool","Google Classroom","فصلك الدراسي أونلاين","https://classroom.google.com/","school","linear-gradient(135deg,#0f9d58,#4cc38a)","USA"]
 ];
 function pt(u,ico,name,desc,bg,cls){return '<a class="ptile'+(cls||"")+'" href="'+u+'" target="_blank" rel="noopener noreferrer" aria-label="فتح '+name+'"><div class="pi" style="background:'+bg+'">'+ic(ico)+'</div><div><b>'+name+'</b><span class="d">'+desc+'</span></div><span class="go">'+ic("ext")+'</span></a>'}
 function saveF(){try{localStorage.setItem(FK,JSON.stringify(fav))}catch(e){}}
 function xt(x){var on=fav.indexOf(x[0])>-1;return '<div class="xt"><a class="xa" href="'+x[4]+'" target="_blank" rel="noopener noreferrer" aria-label="فتح '+esc(x[2])+'"><div class="pi" style="background:'+x[6]+'">'+ic(x[5])+'</div><div class="xb"><b>'+esc(x[2])+'</b><span class="d">'+esc(x[3])+'</span><em class="cn">'+esc(x[7])+'</em></div></a><button class="star'+(on?' on':'')+'" data-id="'+x[0]+'" aria-pressed="'+on+'" aria-label="'+(on?'إزالة من المفضلة':'إضافة للمفضلة')+'">'+(on?'★':'☆')+'</button></div>'}
 function draw(){
  var r=INTL.filter(function(x){return (cat==="all"||(cat==="fav"?fav.indexOf(x[0])>-1:x[1]===cat))&&(!q||(x[2]+" "+x[3]).toLowerCase().indexOf(q)>-1)});
  $("xl").innerHTML=r.length?r.map(xt).join(""):empty("search",cat==="fav"&&!q?"لسه مفيش مفضلة. اضغطي النجمة جنب أي منصة.":"مفيش نتيجة، جرّبي كلمة تانية.");
  $("xc").innerHTML=CATS.map(function(c){return '<button class="chip'+(c[0]===cat?' on':'')+'" data-c="'+c[0]+'">'+c[1]+(c[0]==="fav"?' ('+fav.length+')':'')+'</button>'}).join("");
 }
 app('<h2>المنصات التعليمية</h2><p class="sub">اضغطي على المنصة وهتفتحلك مباشرة.</p>'
  +'<div class="stats"><div><b>'+(INTL.length+3)+'</b><span>منصة</span></div><div><b>'+INTL.length+'</b><span>دولية</span></div><div><b>'+(CATS.length-2)+'</b><span>تصنيفات</span></div></div>'
  +'<div class="sec">منصتنا</div>'+pt(SCHOOL_URL,"school","منصة المدرسة","نظام المدرسة الذكي في مكان واحد","linear-gradient(135deg,#6c3fd1,#ff6fa5)"," school")
  +'<div class="sec">المنصة التعليمية</div>'+pt(SPRIX_URL,"layers","اسبريكس","بوابة اسبريكس التعليمية","rgba(255,255,255,.22)"," feat")
  +'<div class="sec">مصادر مصرية</div>'+pt(LIB_URL,"lib","المكتبة الإلكترونية","كتب الطالب الرسمية من وزارة التربية والتعليم","linear-gradient(135deg,#18b394,#0f8f77)")
  +'<div class="sec">🌍 المنصات الدولية</div><input id="xs" class="xs" type="search" placeholder="ابحثي عن منصة..." aria-label="بحث في المنصات" autocomplete="off"><div class="chips xcs" id="xc"></div><div id="xl"></div>');
 draw();
 $("xs").oninput=function(){q=this.value.trim().toLowerCase();draw()};
 $("xc").onclick=function(e){var b=e.target.closest("button[data-c]");if(!b)return;cat=b.dataset.c;draw()};
 $("xl").onclick=function(e){var b=e.target.closest("button.star");if(!b)return;var i=fav.indexOf(b.dataset.id);if(i>-1)fav.splice(i,1);else fav.push(b.dataset.id);saveF();draw()}},

translate:function(){
 var L=[["ar","العربية"],["en","English"],["fr","Français"],["de","Deutsch"],["es","Español"],["it","Italiano"],["tr","Türkçe"],["ru","Русский"],["zh-CN","中文"],["ja","日本語"]];
 var o=function(s){return L.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===s?' selected':'')+'>'+x[1]+'</option>'}).join("")};
 app('<h2>المترجم</h2><p class="sub">اكتبي النص واختاري اللغات وهترجمهولك.</p><div class="card col"><div class="tr"><div><label for="tf">من</label><select id="tf"><option value="auto" selected>تلقائي (اكتشاف اللغة)</option>'+o("")+'</select></div><button class="tbtn" id="tw" type="button" aria-label="عكس اللغتين">'+ic("swap")+'</button><div><label for="tt">إلى</label><select id="tt">'+o("ar")+'</select></div></div><label for="tx" style="display:block;margin-top:10px">النص</label><textarea id="tx" rows="4" maxlength="500" dir="auto" placeholder="اكتبي هنا..."></textarea><div class="cc2"><span id="tn">0</span>/500</div><button class="btn" id="tg">ترجمة</button></div><div class="card col"><div class="m">الترجمة</div><div class="out" id="to" dir="auto" aria-live="polite">—</div><div class="acts"><button class="btn alt" id="tcp">'+ic("copy")+'نسخ</button><button class="btn alt" id="tsp">'+ic("speak")+'استماع</button></div><p class="msg" id="tm"></p></div>');
 $("tx").oninput=function(){$("tn").textContent=this.value.length};
 $("tw").onclick=function(){var a=$("tf").value;if(a==="auto")a=window.dl||"en";if(!$("tt").querySelector('option[value="'+a+'"]'))a="en";$("tf").value=$("tt").value;$("tt").value=a;var t=$("to").textContent;if(t&&t!=="—"&&t!=="جاري الترجمة..."){$("tx").value=t;$("tn").textContent=t.length;$("to").textContent="—"}};
 $("tg").onclick=function(){var q=$("tx").value.trim(),m=$("tm");m.textContent="";if(!q)return;var f=$("tf").value,t=$("tt").value;
  if(f===t){$("to").textContent=q;return}
  $("to").textContent="جاري الترجمة...";
  fetch("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl="+encodeURIComponent(f)+"&tl="+encodeURIComponent(t)+"&q="+encodeURIComponent(q)).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
   var s=d[0].map(function(x){return x[0]||""}).join("");if(!s)throw 0;window.dl=d[2];$("to").textContent=s}).catch(function(){
   fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(q)+"&langpair="+encodeURIComponent((f==="auto"?"en":f)+"|"+t)).then(function(r){return r.json()}).then(function(d){
    if(String(d.responseStatus)!=="200"||!d.responseData)throw 0;$("to").textContent=d.responseData.translatedText}).catch(function(){$("to").textContent="—";m.textContent="مقدرتش أترجم دلوقتي. اتأكدي من الإنترنت وجرّبي تاني."})})};
 $("tcp").onclick=function(){var t=$("to").textContent;if(!t||t==="—")return;var m=$("tm");(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){m.textContent="تم النسخ."}).catch(function(){m.textContent="مقدرتش أنسخ، حدّديه وانسخيه بإيدك."})};
 $("tsp").onclick=function(){var t=$("to").textContent;if(!t||t==="—"||!window.speechSynthesis)return;var u=new SpeechSynthesisUtterance(t);u.lang=$("tt").value;speechSynthesis.cancel();speechSynthesis.speak(u)}},

books:function(){
 app('<h2>بنك الكتب الخارجية</h2><p class="sub">اختاري الكتاب، ومس كريمة هتنسّق الاستلام بسرية تامة.</p><div id="bl"><p class="m">جاري التحميل...</p></div><div class="card col"><div class="t">عندك كتاب من السنة اللي فاتت؟</div><label for="bt">اسم الكتاب</label><input id="bt" placeholder="مثال: كتاب الامتحان - عربي"><label for="bg">الصف</label><select id="bg"><option>سنة أولى</option><option>سنة ثانية</option><option>سنة ثالثة</option></select><label for="bd">اسمك الأول (اختياري، علشان تظهري في لوحة الشرف)</label><input id="bd"><button class="btn" id="badd">أتبرع بالكتاب</button><p class="msg" id="bm"></p></div>');
 get("books").then(function(rows){var g={};rows.forEach(function(r){if(!r.title||r.status==="taken")return;var k=r.title+"|"+(r.grade||"");g[k]=g[k]||{t:r.title,gr:r.grade,n:0};g[k].n++});
  var ks=Object.keys(g);$("bl").innerHTML=ks.length?ks.map(function(k){var b=g[k];return '<div class="card"><div><div class="t">'+esc(b.t)+'</div><div class="m">'+esc(b.gr)+' · <span class="cnt">متاح '+b.n+'</span></div></div><a class="btn" target="_blank" rel="noopener" href="'+wa("السلام عليكم يا مس كريمة 🌸\nأنا عايزة أطلب كتاب:\n📘 "+b.t+"\nممكن ننسّق الاستلام؟ شكراً ليكي 💜")+'">طلب الكتاب</a></div>'}).join(""):empty("book","لسه مفيش كتب. كوني أول من يتبرع.")}).catch(function(){$("bl").innerHTML=err});
 $("badd").onclick=function(){var t=$("bt").value.trim(),m=$("bm");if(!t){m.textContent="اكتبي اسم الكتاب الأول.";return}var gr=$("bg").value;
  window.open(wa("السلام عليكم يا مس كريمة 🌸\nأنا عايزة أتبرع بكتاب:\n📘 الكتاب: "+t+"\n🎓 الصف: "+gr+"\nممكن ننسّق الاستلام؟ شكراً ليكي 💜"),"_blank");
  post("books",{title:t,grade:gr,status:"available",added:today(),donor:$("bd").value.trim()}).then(function(){m.textContent="شكراً يا سفيرة الخير! كمّلي مع مس كريمة على واتساب.";setTimeout(V.books,1500)}).catch(function(){m.textContent="فتحنالك واتساب مع مس كريمة. كمّلي معاها هناك."})}},

"lost-found":function(){
 app('<h2>سوق المفقودات</h2><p class="sub">سجّلي مواصفات الشيء، ومس كريمة هتساعدك في استلامه.</p><div class="card col"><label for="lk">النوع</label><select id="lk"><option>ضاع مني</option><option>لقيته</option></select><label for="lt">الوصف</label><input id="lt" placeholder="مثال: مقلمة زرقاء"><button class="btn" id="ladd">إضافة</button></div><div id="ll"><p class="m">جاري التحميل...</p></div>');
 get("lost").then(function(r){r=r.filter(function(x){return x.desc}).reverse();$("ll").innerHTML=r.length?r.map(function(x){return '<div class="card"><div><span class="badge">'+esc(x.type)+'</span><div class="t">'+esc(x.desc)+'</div></div><a class="btn alt" target="_blank" rel="noopener" href="'+wa("السلام عليكم يا مس كريمة 🌸\nأنا شوفت إعلان في المفقودات وعايزة أسأل عنه:\n🔎 "+x.desc+"\nشكراً ليكي 💜")+'">مس كريمة</a></div>'}).join(""):empty("search","مفيش مفقودات دلوقتي.")}).catch(function(){$("ll").innerHTML=err});
 $("ladd").onclick=function(){var v=$("lt").value.trim();if(!v)return;var k=$("lk").value;window.open(wa("السلام عليكم يا مس كريمة 🌸\n"+(k==="لقيته"?"أنا لقيت حاجة وعايزة أسلّمها لصاحبتها:":"أنا ضاع مني حاجة:")+"\n🔎 "+v+"\n"+(k==="لقيته"?"ممكن ننسّق التسليم؟":"ممكن تساعديني ألاقيها؟")+" شكراً ليكي 💜"),"_blank");post("lost",{type:k,desc:v,date:today()}).then(V["lost-found"]).catch(function(){})}},

"study-share":function(){
 app('<h2>بنك الملخصات والملزمات</h2><p class="sub">ارفعي الملخص على جوجل درايف وانشري رابطه هنا.</p><div class="card col"><label for="ut">عنوان الملخص</label><input id="ut"><label for="us">المادة</label><select id="us"><option>عربي</option><option>إنجليزي</option><option>رياضيات</option><option>علوم</option><option>دراسات</option><option>أخرى</option></select><label for="ul">رابط الملف (يبدأ بـ https)</label><input id="ul" type="url" dir="ltr"><button class="btn" id="uadd">نشر الملخص</button><p class="msg" id="um"></p></div><div id="ml"><p class="m">جاري التحميل...</p></div>');
 get("summaries").then(function(r){r=r.filter(function(x){return x.title&&/^https:\/\//.test(x.link||"")}).reverse();$("ml").innerHTML=r.length?r.map(function(x){return '<div class="card"><div><div class="t">'+esc(x.title)+'</div><div class="m">'+esc(x.subject)+'</div></div><a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(x.link)+'">فتح</a></div>'}).join(""):empty("file","لسه مفيش ملخصات. انشري أول ملخص.")}).catch(function(){$("ml").innerHTML=err});
 $("uadd").onclick=function(){var t=$("ut").value.trim(),l=$("ul").value.trim(),m=$("um");if(!t||!/^https:\/\//.test(l)){m.textContent="اكتبي العنوان ورابط صحيح يبدأ بـ https.";return}
  post("summaries",{title:t,subject:$("us").value,link:l,date:today()}).then(function(){V["study-share"]()}).catch(function(){m.textContent="حصلت مشكلة، جرّبي تاني."})}},

leaderboard:function(){
 app('<h2>لوحة الشرف الرقمية</h2><p class="sub">سفيرات الخير حسب عدد الكتب المتبرع بها (١٠ نقاط لكل كتاب).</p><div id="lb"><p class="m">جاري التحميل...</p></div>');
 get("books").then(function(rows){var c={};rows.forEach(function(r){var n=(r.donor||"").trim();if(n)c[n]=(c[n]||0)+1});
  var a=Object.keys(c).sort(function(x,y){return c[y]-c[x]}).slice(0,10);
  $("lb").innerHTML=a.length?a.map(function(n,i){return '<div class="card"><div class="rk"><div class="rank">'+(i+1)+'</div><div><div class="t">'+esc(n)+'</div><div class="m">'+c[n]*10+' نقطة تميز</div></div></div>'+(i===0?'<span class="badge">سفيرة الخير</span>':'')+'</div>'}).join(""):empty("trophy","لسه مفيش ترتيب. تبرعي بكتاب واكتبي اسمك، وهتظهري هنا.")}).catch(function(){$("lb").innerHTML=err})},

focus:function(){
 var P=[[25,5],[45,10],[50,10]];
 app('<h2>جلسة المذاكرة</h2><p class="sub">ذاكري بتركيز وبعدها خدي راحة. التايمر بيكمّل حتى لو خرجتي من الصفحة.</p><div class="card col fcard"><div class="fmodes"><button data-m="focus">مذاكرة</button><button data-m="rest">راحة</button></div><div class="fpre" id="fp">'+P.map(function(p){return '<button data-p="'+p[0]+'-'+p[1]+'">'+p[0]+' / '+p[1]+'</button>'}).join("")+'</div><div class="fr focus" id="fr"><div class="fi"><div class="fmm" id="fm"></div><div class="ft" id="ft" dir="ltr">25:00</div></div></div><label for="fs">بذاكر إيه؟</label><select id="fs">'+["عربي","إنجليزي","رياضيات","علوم","دراسات","أخرى"].map(function(x){return '<option'+(x===FS.subj?" selected":"")+'>'+x+'</option>'}).join("")+'</select><div class="fbtns"><button class="btn" id="fgo">ابدئي</button><button class="btn alt" id="frs">إعادة</button><button class="btn alt" id="fsk">تخطّي</button></div><p class="msg" id="fmsg" aria-live="polite"></p></div><div class="sec">إنجازك</div><div id="fst"></div>');
 fsPaint();fsStats();
 $("fgo").onclick=function(){$("fmsg").textContent="";FS.run?fsPause():fsStart()};
 $("frs").onclick=function(){fsPause();FS.left=FS.d[FS.mode]*60;fsPaint()};
 $("fsk").onclick=function(){fsSet(FS.mode==="focus"?"rest":"focus")};
 $("fs").onchange=function(){FS.subj=this.value;fsPaint()};
 document.querySelector(".fmodes").onclick=function(e){var b=e.target.closest("button[data-m]");if(b)fsSet(b.dataset.m)};
 $("fp").onclick=function(e){var b=e.target.closest("button[data-p]");if(!b)return;if(FS.run){$("fmsg").textContent="أوقفي التايمر الأول علشان تغيّري المدة.";return}var a=b.dataset.p.split("-");FS.d={focus:+a[0],rest:+a[1]};FS.left=FS.d[FS.mode]*60;fsPaint()}},

cards:function(){
 var cat="all",idx=Math.floor(Date.now()/864e5)%MC.length;
 var CT=[["all","الكل"],["push","تحفيز"],["exam","قبل الامتحان"],["tired","لو تعبانة"],["tips","نصايح"]];
 function mc(i,big){var c=MC[i];return '<div class="mc'+(big?' big':'')+'" style="background:'+MG[i%MG.length]+'"><span class="mq">“</span><p>'+esc(c[1])+'</p><div class="mf"><em>'+MT[c[0]]+'</em><div><button data-cp="'+i+'">نسخ</button><a target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(c[1]+"\n— Zewail Smart 💜")+'">واتساب</a></div></div></div>'}
 function draw(){$("cd").innerHTML='<div class="sec">بطاقة اليوم</div>'+mc(idx,1)+'<div class="acts"><button class="btn alt" id="cr">'+ic("swap")+'بطاقة عشوائية</button></div>';
  $("cc2").innerHTML=CT.map(function(c){return '<button class="chip'+(c[0]===cat?' on':'')+'" data-c="'+c[0]+'">'+c[1]+'</button>'}).join("");
  $("cl").innerHTML=MC.map(function(c,i){return cat==="all"||c[0]===cat?mc(i):""}).join("");
  $("cr").onclick=function(){idx=Math.floor(Math.random()*MC.length);draw()}}
 app('<h2>بطاقات تحفيزية</h2><p class="sub">كلام حلو يفكّرك إنك قدّها. انسخي البطاقة أو ابعتيها لصاحبتك.</p><div id="cd"></div><div class="chips xcs" id="cc2"></div><div id="cl"></div>');
 draw();
 $("cc2").onclick=function(e){var b=e.target.closest("button[data-c]");if(!b)return;cat=b.dataset.c;draw()};
 $("app").onclick=function(e){var b=e.target.closest("button[data-cp]");if(!b)return;var t=MC[+b.dataset.cp][1];(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent="تم ✓"}).catch(function(){b.textContent="حدّديها وانسخي"})}},

ig:function(){
 var SUBJ=["Mathematics","Biology","Chemistry","Physics","English","Computer Science","Business","Arabic"],
 TOP={Mathematics:["Number","Algebra","Functions & graphs","Geometry","Mensuration","Trigonometry","Vectors & transformations","Probability","Statistics"],
  Biology:["Cells","Movement in & out of cells","Enzymes","Plant nutrition","Human nutrition","Transport","Respiration","Coordination & response","Reproduction","Inheritance","Ecology"],
  Chemistry:["States of matter","Atoms & bonding","Stoichiometry","Electrochemistry","Energetics","Rates of reaction","Acids, bases & salts","Periodic Table","Metals","Organic chemistry"],
  Physics:["Motion","Forces","Energy","Thermal physics","Waves","Light","Electricity","Magnetism","Atomic physics"],
  English:["Reading comprehension","Directed writing","Narrative writing","Descriptive writing","Summary","Grammar & vocabulary"],
  "Computer Science":["Data representation","Algorithms","Programming","Databases","Networks","Security"],Business:[],Arabic:[]},
 INT=[0,0,1,3,7,14],
 TABS=[["track","متابعة المنهج"],["fc","بطاقات المراجعة"],["mk","درجاتي"],["ex","الامتحانات"],["cw","كلمات الأسئلة"]],
 WORDS=[["State / Name","اكتبي المعلومة مباشرة في جملة قصيرة. من غير شرح."],["Define","اكتبي المعنى بالظبط زي ما اتعلمتيه. الكلمات المفتاحية هي اللي بتاخد الدرجة."],["Give","اديني مثال أو سبب. إجابة قصيرة."],["Describe","قولي إيه اللي بيحصل أو شكله إيه. وصف بس من غير تفسير."],["Explain","اذكري إيه اللي حصل وليه حصل. استخدمي because / so / therefore."],["Compare","اذكري أوجه الشبه والاختلاف، وخلي الاتنين في نفس الجملة."],["Calculate","اكتبي القانون وخطوات الحل والوحدة. الخطوات بتجيب درجات حتى لو الناتج غلط."],["Suggest","استخدمي معلوماتك في موقف جديد. مفيش إجابة محفوظة."],["Deduce / Predict","استنتجي من المعطيات اللي قدامك."],["Outline","اذكري النقاط الرئيسية باختصار."],["Discuss","اعرضي أكتر من وجهة نظر، وبعدين خلّصي برأيك."],["Evaluate","قيّمي الإيجابيات والسلبيات وخدي قرار مبرر."],["Justify","اديني دليل يثبت إجابتك."],["Sketch / Draw","ارسمي بشكل تقريبي مع كتابة العناصر المهمة (labels)."]],
 tab="track",sj="Mathematics",mode="rev",rq=[],rv=false,qc=null,qo=[],qa=-1,qs={r:0,t:0};
 function ls(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
 function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
 function ad(n){var d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+f2(d.getMonth()+1)+"-"+f2(d.getDate())}
 function opt(){return SUBJ.map(function(x){return '<option>'+x+'</option>'}).join("")}
 function chips(l,cur,at){return l.map(function(c){return '<button class="chip'+(c[0]===cur?' on':'')+'" data-a="'+at+'" data-v="'+esc(c[0])+'">'+c[1]+'</button>'}).join("")}
 function grade(p){var B=[[90,"A*"],[80,"A"],[70,"B"],[60,"C"],[50,"D"],[40,"E"],[30,"F"],[20,"G"]];for(var i=0;i<B.length;i++)if(p>=B[i][0])return B[i][1];return "U"}
 function reset(){var cd=ls("ig_c",[]);rq=sh(cd.filter(function(c){return c.due<=today()}).map(function(c){return c.id}));rv=false;qc=null;qs={r:0,t:0}}
 function newQ(){var cd=ls("ig_c",[]);if(cd.length<4){qc=null;return}qc=cd[Math.floor(Math.random()*cd.length)];qo=sh([qc].concat(sh(cd.filter(function(c){return c.id!==qc.id})).slice(0,3)));qa=-1}
 function vT(){var st=ls("ig_t",{}),cu=ls("ig_tc",{}),L=(TOP[sj]||[]).concat(cu[sj]||[]),m=st[sj]||{},sum=0;
  L.forEach(function(n){sum+=m[n]||0});var p=L.length?Math.round(sum/(L.length*3)*100):0,cl=["لسه","ضعيفة","متوسطة","قوية"];
  return '<div class="card col"><label for="igs">المادة</label><select id="igs" data-a="sj">'+SUBJ.map(function(x){return '<option'+(x===sj?" selected":"")+'>'+x+'</option>'}).join("")+'</select><div class="t">إتقان المادة: '+p+'%</div><div class="gbar"><i style="width:'+p+'%"></i></div><p class="m">اضغطي على الموضوع علشان تغيّري مستواك فيه: لسه ← ضعيفة ← متوسطة ← قوية.</p></div>'
  +(L.length?'<div class="tps">'+L.map(function(n,i){var v=m[n]||0;return '<button class="tp s'+v+'" data-a="t" data-v="'+i+'"><span>'+esc(n)+'</span><em>'+cl[v]+'</em></button>'}).join("")+'</div>':empty("file","مفيش مواضيع للمادة دي. ضيفي مواضيعك."))
  +'<div class="card col"><label for="igtn">ضيفي موضوع</label><input id="igtn" placeholder="اسم الموضوع"><button class="btn" data-a="ta">إضافة</button></div>'}
 function vF(){var cd=ls("ig_c",[]),dn=cd.filter(function(c){return c.due<=today()}).length,ms=cd.filter(function(c){return c.box>=5}).length,ar="";
  if(mode==="rev"){var c=rq.length?cd.filter(function(x){return x.id===rq[0]})[0]:null;
   ar=c?'<div class="fcz"><small class="en">'+esc(c.s)+'</small><div class="fq">'+esc(c.f)+'</div>'+(rv?'<hr><div class="fa">'+esc(c.b)+'</div>':'')+'</div>'+(rv?'<div class="fbtns"><button class="btn alt" data-a="no">لسه مش حافظاها</button><button class="btn" data-a="ok">عرفتها ✓</button></div>':'<button class="btn wb" data-a="show">اظهري الإجابة</button>')+'<p class="m">باقي '+rq.length+' بطاقة في الجلسة دي.</p>':empty("trophy",cd.length?"خلّصتي كل بطاقات النهاردة 🎉 ارجعي بكرة.":"ضيفي أول بطاقة من تحت.")}
  else if(!qc)ar=empty("file","محتاجة ٤ بطاقات على الأقل علشان الاختبار.");
  else{ar='<div class="fcz"><small>اختاري الإجابة الصح · '+qs.r+'/'+qs.t+'</small><div class="fq">'+esc(qc.f)+'</div></div><div class="qos">'+qo.map(function(o,i){var k=qa<0?"":(o.id===qc.id?" ok":(i===qa?" bad":""));return '<button class="qo'+k+'" data-a="qa" data-v="'+i+'"'+(qa>-1?" disabled":"")+'>'+esc(o.b)+'</button>'}).join("")+'</div>'+(qa>-1?'<button class="btn wb" data-a="qn">السؤال اللي بعده</button>':"")}
  return '<div class="stats"><div><b>'+cd.length+'</b><span>بطاقة</span></div><div><b>'+dn+'</b><span>مستحقة النهاردة</span></div><div><b>'+ms+'</b><span>محفوظة</span></div></div><div class="chips xcs">'+chips([["rev","مراجعة"],["quiz","اختبار"]],mode,"fm")+'</div><div class="card col">'+ar+'</div>'
  +'<div class="card col"><div class="t">بطاقة جديدة</div><label for="igcs">المادة</label><select id="igcs">'+opt()+'</select><label for="igcf">السؤال / الكلمة</label><input id="igcf" dir="auto"><label for="igcb">الإجابة</label><textarea id="igcb" rows="2" dir="auto"></textarea><button class="btn" data-a="ca">إضافة البطاقة</button></div>'
  +(cd.length?'<details class="card col"><summary class="t">كل البطاقات ('+cd.length+')</summary>'+cd.map(function(c){return '<div class="rw"><span dir="auto">'+esc(c.f)+'</span><button class="btn alt sm" data-a="cd" data-v="'+c.id+'" aria-label="حذف">✕</button></div>'}).join("")+'</details>':"")}
 function vM(){var pp=ls("ig_p",[]),g={},bars=pp.slice(-8);
  pp.forEach(function(x){g[x.s]=g[x.s]||{a:0,m:0};g[x.s].a+=x.g;g[x.s].m+=x.m});
  return '<div class="card col"><div class="t">سجّلي نتيجة ورقة</div><label for="igps">المادة</label><select id="igps">'+opt()+'</select><label for="igpn">اسم الورقة</label><input id="igpn" placeholder="مثال: Paper 2 - May 2023"><div class="tr"><div><label for="igpg">درجتك</label><input id="igpg" type="number" min="0" inputmode="decimal"></div><div><label for="igpm">من</label><input id="igpm" type="number" min="1" inputmode="decimal"></div></div><button class="btn" data-a="pa">حفظ</button><p class="msg" id="igpe"></p></div>'
  +(Object.keys(g).length?'<div class="stats">'+Object.keys(g).map(function(k){var p=Math.round(g[k].a/g[k].m*100);return '<div><b>'+grade(p)+'</b><span class="en">'+esc(k)+' · '+p+'%</span></div>'}).join("")+'</div><p class="m">التقدير تقريبي حسب حدود افتراضية. الحدود الحقيقية بتتغير كل دورة.</p>'
  +'<div class="card col"><div class="t">آخر الأوراق</div><div class="wk">'+bars.map(function(x){var p=Math.round(x.g/x.m*100);return '<div><em>'+p+'</em><i style="height:'+Math.max(4,p*.8)+'px"></i><span class="en">'+esc(x.s.slice(0,4))+'</span></div>'}).join("")+'</div></div>'
  +pp.slice().reverse().map(function(x){return '<div class="card"><div><div class="t" dir="auto">'+esc(x.n)+'</div><div class="m"><span class="en">'+esc(x.s)+'</span> · '+x.g+'/'+x.m+' · '+grade(Math.round(x.g/x.m*100))+'</div></div><button class="btn alt sm" data-a="pd" data-v="'+x.id+'" aria-label="حذف">✕</button></div>'}).join(""):empty("trophy","لسه مفيش أوراق. سجّلي أول نتيجة وهتتابعي تقدمك."))}
 function vE(){var ex=ls("ig_e",[]),t0=new Date().setHours(0,0,0,0);
  ex=ex.map(function(x){x.d=Math.round((new Date(x.dt+"T00:00:00")-t0)/864e5);return x}).sort(function(a,b){return a.d-b.d});
  return '<div class="card col"><div class="t">ضيفي امتحان</div><label for="ige">المادة</label><select id="ige">'+opt()+'</select><label for="igd">التاريخ</label><input id="igd" type="date"><button class="btn" data-a="ea">إضافة</button></div>'
  +(ex.length?ex.map(function(x){var c=x.d<0?"var(--muted)":x.d<=7?"var(--bad)":x.d<=30?"var(--gold)":"var(--mint)";return '<div class="card"><div class="cdn" style="--c:'+c+'"><b>'+(x.d<0?"—":x.d)+'</b><small>'+(x.d<0?"خلص":"يوم")+'</small></div><div style="flex:1"><div class="t en">'+esc(x.s)+'</div><div class="m">'+esc(x.dt)+(x.d>=0?' · ≈ '+x.d*3+' جلسة لو ٣ في اليوم':"")+'</div></div><button class="btn alt sm" data-a="ed" data-v="'+x.id+'" aria-label="حذف">✕</button></div>'}).join(""):empty("search","ضيفي مواعيد امتحاناتك وهتشوفي العد التنازلي."))}
 function vW(){return '<p class="m">فهم كلمة السؤال بيوفّر عليكي درجات كتير في IG.</p>'+WORDS.map(function(w){return '<details class="card col"><summary class="t en">'+w[0]+'</summary><p class="m" style="margin:6px 0 0">'+w[1]+'</p></details>'}).join("")}
 function draw(){$("igt").innerHTML=chips(TABS,tab,"tab");$("igv").innerHTML=({track:vT,fc:vF,mk:vM,ex:vE,cw:vW})[tab]()}
 app('<h2>مركز IG</h2><p class="sub">أدوات المذاكرة بتاعة منصات IG في مكان واحد. بياناتك بتتحفظ على جهازك.</p><div id="igw"><div class="chips xcs" id="igt"></div><div id="igv"></div></div>');
 reset();draw();
 $("igw").onchange=function(e){if(e.target.dataset.a==="sj"){sj=e.target.value;draw()}};
 $("igw").onclick=function(e){var b=e.target.closest("button[data-a]");if(!b)return;var a=b.dataset.a,v=b.dataset.v,V2=function(i){return($(i).value||"").trim()},cd,x;
  if(a==="tab"){tab=v;if(v==="fc")reset()}
  else if(a==="t"){var st=ls("ig_t",{}),cu=ls("ig_tc",{}),L=(TOP[sj]||[]).concat(cu[sj]||[]),n=L[+v];st[sj]=st[sj]||{};st[sj][n]=((st[sj][n]||0)+1)%4;sv("ig_t",st)}
  else if(a==="ta"){var nm=V2("igtn");if(!nm)return;var c2=ls("ig_tc",{});c2[sj]=(c2[sj]||[]).concat([nm]);sv("ig_tc",c2)}
  else if(a==="fm"){mode=v;if(v==="quiz")newQ()}
  else if(a==="show"){rv=true}
  else if(a==="ok"||a==="no"){cd=ls("ig_c",[]);x=cd.filter(function(c){return c.id===rq[0]})[0];if(x){if(a==="ok"){x.box=Math.min(5,(x.box||1)+1);x.due=ad(INT[x.box]);rq.shift()}else{x.box=1;x.due=today();rq.push(rq.shift())}sv("ig_c",cd)}rv=false}
  else if(a==="qa"){qa=+v;qs.t++;if(qo[qa].id===qc.id)qs.r++}
  else if(a==="qn"){newQ()}
  else if(a==="ca"){var f=V2("igcf"),bk=V2("igcb");if(!f||!bk)return;cd=ls("ig_c",[]);x={id:Date.now()+Math.floor(Math.random()*999),s:$("igcs").value,f:f,b:bk,box:1,due:today()};cd.push(x);sv("ig_c",cd);rq.push(x.id)}
  else if(a==="cd"){cd=ls("ig_c",[]).filter(function(c){return String(c.id)!==v});sv("ig_c",cd);rq=rq.filter(function(i){return String(i)!==v})}
  else if(a==="pa"){var gg=+$("igpg").value,mm=+$("igpm").value;if(!(mm>0)||gg<0||gg>mm||$("igpg").value===""){$("igpe").textContent="اكتبي الدرجة والدرجة النهائية صح.";return}var pp=ls("ig_p",[]);pp.push({id:Date.now(),s:$("igps").value,n:V2("igpn")||"Paper",g:gg,m:mm});sv("ig_p",pp)}
  else if(a==="pd"){sv("ig_p",ls("ig_p",[]).filter(function(p){return String(p.id)!==v}))}
  else if(a==="ea"){var dt=$("igd").value;if(!dt)return;var ee=ls("ig_e",[]);ee.push({id:Date.now(),s:$("ige").value,dt:dt});sv("ig_e",ee)}
  else if(a==="ed"){sv("ig_e",ls("ig_e",[]).filter(function(p){return String(p.id)!==v}))}
  draw()}},

parent:function(){
 var PAPI="https://sheetdb.io/api/v1/qqdrgdnzgoacx",busy=false;
 var SCHOOL_DAYS=20,EXAM_MAX=20; // عدد أيام الدراسة في الشهر + الدرجة النهائية للاختبار الشهري (غيّريهم لو مختلفين)
 var RE={ // أسماء الأعمدة في الإكسل (أول عمود يطابق وقيمته مش #REF! هو اللي بيتاخد)
  name:[/اسم\s*(ال)?(طالب|تلميذ)/,/^(ال)?اسم$/],
  cls:[/^(ال)?فصل/,/^(ال)?صف/],
  grade:[/(اختبار|امتحان).*شهر/,/شهر.*(اختبار|امتحان|درجة)/,/درجة.*شهر/],
  fee:[/(إجمالي|اجمالي|قيمة|كل).*(مصروف|رسوم)/,/^(ال)?(مصروفات|رسوم)/],
  paid:[/(مدفوع|المسدد|مسدد|سداد|دفع)/],
  rest:[/(متبقي|المتبقي|باقي|الباقي)/],
  absent:[/(غياب.*شهر|شهر.*غياب)/,/^(اجمالي|إجمالي)\s*(ال)?غياب/,/^(عدد\s*)?(ايام|أيام)\s*(ال)?غياب/]};
 var CSS=".pc{background:var(--surface);border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:var(--sh);margin:14px 0;animation:pcin .5s ease both}"
 +".pc-h{display:flex;align-items:center;gap:14px;padding:18px;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;position:relative;overflow:hidden}"
 +".pc-h:after{content:'';position:absolute;inset-inline-end:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.14)}"
 +".pc-av{width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.25);display:grid;place-items:center;font-size:26px;font-weight:800;flex:none;border:2px solid rgba(255,255,255,.55)}"
 +".pc-h b{font-size:19px;line-height:1.45;display:block}.pc-h span{display:block;font-size:13px;opacity:.92}"
 +".pc-g{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:14px}"
 +".pc-t{background:var(--soft);border-radius:22px;padding:16px 8px 14px;text-align:center;animation:pcin .6s ease both}.pc-t.w{grid-column:1/-1}"
 +".pc-r{--v:0;--c:var(--mint);width:106px;height:106px;border-radius:50%;margin:0 auto 10px;display:grid;place-items:center;background:conic-gradient(var(--c) calc(var(--v)*1%),var(--line) 0)}"
 +".pc-r i{font-style:normal;width:80px;height:80px;border-radius:50%;background:var(--surface);display:grid;place-items:center;font-size:21px;font-weight:800;color:var(--ink)}"
 +".pc-d{width:106px;height:106px;border-radius:50%;margin:0 auto 10px;display:grid;place-items:center;background:linear-gradient(135deg,var(--p),var(--p2));color:#fff;font-size:38px;font-weight:800;box-shadow:0 6px 16px rgba(108,63,209,.3)}"
 +".pc-t small{display:block;color:var(--muted);font-size:13px;font-weight:700}"
 +".pc-bar{height:10px;border-radius:999px;background:var(--line);overflow:hidden;margin:10px 14px 0}.pc-bar i{display:block;height:100%;border-radius:999px;background:var(--c,var(--mint))}"
 +".pc-f{margin:0 14px 14px;background:var(--soft);border-radius:22px;padding:14px}.pc-f h4{margin:0 0 10px;font-size:16px}.pc-fr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center}.pc-fr div{background:var(--surface);border-radius:14px;padding:8px 4px}.pc-fr b{display:block;font-size:17px}.pc-fr small{color:var(--muted);font-size:12px;font-weight:700}.pc-fp{display:inline-block;margin-top:10px;border-radius:999px;padding:0 12px;font-size:13px;font-weight:800;background:var(--c);color:#161616}"
 +"@keyframes pcin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}";
 if(!$("pst")){var st=document.createElement("style");st.id="pst";st.textContent=CSS;document.head.appendChild(st)}
 function dg(x){return String(x==null?"":x).replace(/[\u0660-\u0669]/g,function(c){return c.charCodeAt(0)-1632}).replace(/[\u06F0-\u06F9]/g,function(c){return c.charCodeAt(0)-1776})}
 function nd(x){return dg(x).replace(/\D/g,"").replace(/^0+/,"")}
 function ok(v){v=String(v==null?"":v).trim();return v!==""&&v.charAt(0)!=="#"}
 function pick(r,res){var ks=Object.keys(r);for(var i=0;i<res.length;i++)for(var j=0;j<ks.length;j++)if(res[i].test(ks[j])&&ok(r[ks[j]]))return r[ks[j]];return null}
 function num(v){var m=dg(v).replace(/٫/g,".").match(/-?\d+(\.\d+)?/);return m?parseFloat(m[0]):null}
 function js(u){return tf(u).then(function(r){if(!r.ok)throw 0;return r.json()})}
 function tabs(){return js(PAPI+"/sheets").then(function(t){if(t&&!Array.isArray(t))t=t.sheets||Object.keys(t);return (t||[]).map(function(x){return typeof x==="string"?x:(x.name||x.title||"")}).filter(Boolean)}).catch(function(){return []})}
 function allRows(){return tabs().then(function(t){var u=t.length?t.map(function(n){return PAPI+"?sheet="+encodeURIComponent(n)}):[PAPI];
  return Promise.all(u.map(function(x){return js(x).then(function(r){return Array.isArray(r)?r:[]}).catch(function(){return []})})).then(function(a){return [].concat.apply([],a)})})}
 function find(rows,c,l4){var C=nd(c);return rows.filter(function(r){var v=Object.keys(r).map(function(k){return nd(r[k])});return v.indexOf(C)>-1&&v.some(function(x){return x.length>=9&&x.slice(-4)===l4})})}
 function merge(base,rows,C){var o={};Object.keys(base).forEach(function(k){o[k]=base[k]});rows.forEach(function(x){if(x===base)return;var v=Object.keys(x).map(function(k){return nd(x[k])});if(v.indexOf(C)>-1)Object.keys(x).forEach(function(k){if(!ok(o[k])&&ok(x[k]))o[k]=x[k]})});return o}
 function col(p){return p>=85?"var(--mint)":p>=50?"var(--gold)":"var(--bad)"}
 function colAbs(p){return p<=10?"var(--mint)":p<=20?"var(--gold)":"var(--bad)"}
 function card(r){
  var name=pick(r,RE.name)||"الطالبة",cls=pick(r,RE.cls),mon="";try{mon=new Date().toLocaleDateString("ar-EG",{month:"long"})}catch(e){}
  var gv=pick(r,RE.grade),g=null,mx=EXAM_MAX;
  if(gv!=null){var s=dg(gv),sl=s.split("/");g=num(sl[0]);if(sl.length>1&&num(sl[1]))mx=num(sl[1])}
  var av=pick(r,RE.absent),ab=av==null?null:num(av);
  var gp=g==null?0:Math.max(0,Math.min(100,Math.round(g/mx*100)));
  var rp=ab==null?0:Math.max(0,Math.min(100,Math.round(ab/SCHOOL_DAYS*1000)/10));
  var fv=pick(r,RE.fee),pv=pick(r,RE.paid),rv=pick(r,RE.rest),fe=fv==null?null:num(fv),pa=pv==null?null:num(pv),re=rv==null?null:num(rv);
  if(fe==null&&pa!=null&&re!=null)fe=pa+re;if(re==null&&fe!=null&&pa!=null)re=Math.max(0,fe-pa);if(pa==null&&fe!=null&&re!=null)pa=Math.max(0,fe-re);
  var fm=function(n){return n==null?"—":n.toLocaleString("ar-EG")+" ج"},fp=fe>0&&pa!=null?Math.max(0,Math.min(100,Math.round(pa/fe*100))):0,fc=re===0?"var(--mint)":fp>=50?"var(--gold)":"var(--bad)";
  var fh=(fe==null&&pa==null&&re==null)?"":'<div class="pc-f" style="--c:'+fc+'"><h4>💰 المصروفات</h4><div class="pc-fr"><div><b>'+fm(fe)+'</b><small>الإجمالي</small></div><div><b>'+fm(pa)+'</b><small>المدفوع</small></div><div><b>'+fm(re)+'</b><small>المتبقي</small></div></div><div class="pc-bar" style="margin:12px 0 0"><i style="width:'+fp+'%;background:'+fc+'"></i></div><span class="pc-fp">'+(re===0?"تم السداد بالكامل ✓":"تم سداد "+fp+"%")+'</span></div>';
  return '<div class="pc"><div class="pc-h"><div class="pc-av">'+esc(String(name).trim().charAt(0))+'</div><div><b>'+esc(name)+'</b><span>'+esc((cls?cls+" · ":"")+(mon?"شهر "+mon:""))+'</span></div></div>'
  +'<div class="pc-g">'
  +'<div class="pc-t"><div class="pc-r" style="--v:'+gp+';--c:'+col(gp)+'"><i>'+(g==null?"—":esc(g+"/"+mx))+'</i></div><small>درجة الاختبار الشهري</small></div>'
  +'<div class="pc-t"><div class="pc-d">'+(ab==null?"—":esc(ab))+'</div><small>أيام الغياب</small></div>'
  +'<div class="pc-t w"><div class="pc-r" style="--v:'+rp+';--c:'+colAbs(rp)+'"><i>'+(ab==null?"—":esc(rp+"%"))+'</i></div><small>نسبة الغياب في الشهر</small><div class="pc-bar" style="--c:'+colAbs(rp)+'"><i style="width:'+rp+'%"></i></div></div>'
  +'</div>'+fh+'</div>'}
 app('<h2>متابعة ولي الأمر</h2><p class="sub">اكتب كود الطالبة وآخر 4 أرقام من تليفون ولي الأمر المسجل في المدرسة.</p><div class="card col"><label for="pc">كود الطالبة</label><input id="pc" dir="ltr" inputmode="numeric" autocomplete="off"><label for="pp">آخر 4 أرقام من تليفون ولي الأمر</label><input id="pp" dir="ltr" inputmode="numeric" maxlength="4" autocomplete="off"><button class="btn" id="pg">عرض</button></div><div id="pr" aria-live="polite"></div>');
 var BAD='<p class="note">البيانات غير متطابقة</p>';
 $("pg").onclick=function(){if(busy)return;var c=dg($("pc").value).trim(),l4=dg($("pp").value).replace(/\D/g,""),o=$("pr"),b=$("pg");
  if(!c||l4.length!==4){o.innerHTML=BAD;return}
  busy=true;b.disabled=true;b.textContent="جاري التحميل...";o.innerHTML='<p class="m">جاري التحميل...</p>';
  allRows().then(function(rows){var r=find(rows,c,l4);o.innerHTML=r.length?r.map(function(x){return card(merge(x,rows,nd(c)))}).join(""):BAD}).catch(function(){o.innerHTML='<p class="note">مش قادرة أوصل لجدول البيانات دلوقتي. جرّبي تاني.</p>'}).then(function(){busy=false;b.disabled=false;b.textContent="عرض"})}},

suggestions:function(){app('<h2>صندوق المقترحات السري</h2><p class="sub">اسمك مش بيتسجل خالص.</p><div class="card col"><label for="st">رسالتك</label><textarea id="st" rows="5"></textarea><button class="btn" id="ss">إرسال</button><p class="msg" id="sm"></p></div>');
 $("ss").onclick=function(){var t=$("st").value.trim();if(!t)return;post("suggestions",{text:t,date:today()}).then(function(){$("st").value="";$("sm").textContent="وصلت رسالتك، شكراً يا صديقتي."}).catch(function(){$("sm").textContent="حصلت مشكلة، جرّبي تاني."})}}
};

function route(){var r=(location.hash||"#home").slice(1);
 var ad=r==="admin",P=document.querySelectorAll(".appbar,.hero,.foot,#nav,#app");
 for(var q=0;q<P.length;q++)P[q].style.display=ad?"none":"";
 var ar=$("adminRoot");if(ar)ar.hidden=!ad;
 if(ad&&!ar){location.hash="#home";return}
 if(ad){$("fab").style.display="none";window.scrollTo(0,0);if(window.HudurAdmin)window.HudurAdmin.boot();return}
 if(!V[r])r="home";
 $("nav").innerHTML=pages.map(function(p){return '<a href="#'+p[0]+'"'+(p[0]===r?' class="on" aria-current="page"':'')+'>'+ic(p[2])+p[1]+'</a>'}).join("");
 var fb=$("fab");if(fb)fb.style.display=r==="chat"?"none":"grid";window.scrollTo(0,0);V[r]()}
function greet(){var n=new Date(),h=n.getHours(),g,i;
 if(h>=5&&h<12){g="صباح الخير";i="sun"}else if(h>=12&&h<18){g="نهارك سعيد";i="sun"}else{g="مساء الخير";i="moon"}
 $("gr").textContent=g+" يا صديقتي";$("gi").innerHTML='<use href="#i-'+i+'"/>';
 var ds="";try{ds=n.toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"})}catch(e){}
 $("gd").textContent=(ds?ds+" · ":"")+"مكانك لكل اللي محتاجاه في المدرسة"}
function isDark(){var t=document.documentElement.getAttribute("data-theme");return t?t==="dark":window.matchMedia("(prefers-color-scheme:dark)").matches}
$("tb").onclick=function(){var n=isDark()?"light":"dark";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("theme",n)}catch(e){}};
greet();setInterval(greet,60000);
window.addEventListener("hashchange",route);route();
