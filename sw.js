const CACHE = 'powerdash-v126-wyoming-hato';
// v126: Hato/Curacao weather + University of Wyoming 78988 sounding indices.
const LOCAL_FILES = ['./', './index.html', './manifest.json', './icon.svg'];

const STRIP_IDS = ['indoor','setpointLabel','outdoor','indoorDelta','houseTotal','bdAcBar','bdAc','bdFridgeBar','bdFridge','bdOtherBar','bdOther','rateLabel','daily','dailyTrend','monthly','savings'];

const WEATHER_HTML = `
            <!-- WEATHER -->
            <div class="card rounded-3xl p-5 card-accent-sky">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2.5">
                        <div id="wxIcon" class="text-4xl leading-none">\u2601\uFE0F</div>
                        <div>
                            <div class="text-[15px] font-bold">Hato \u00b7 Cura\u00e7ao</div>
                            <div id="wxCondition" class="text-[11px] text-sky-400 mt-0.5 tracking-widest uppercase">\u2014</div>
                        </div>
                    </div>
                    <div id="wxObsTime" class="text-[11px] text-white/35 text-right leading-tight">Hato</div>
                </div>
                <div class="flex items-end justify-between gap-3">
                    <div>
                        <div id="wxFeels" class="text-5xl font-bold text-white tabular-nums leading-none">\u2014\u00b0</div>
                        <div class="text-[11px] text-white/40 mt-2">feels like \u00b7 <span id="wxAir" class="text-white/70">\u2014</span>\u00b0C air</div>
                    </div>
                    <div class="text-right space-y-0.5">
                        <div id="wxWindKt" class="text-[17px] font-bold text-sky-300 tabular-nums">\u2014 kt</div>
                        <div id="wxWindDir" class="text-[11px] text-white/40">\u2014</div>
                        <div id="wxPrecip" class="text-[17px] font-bold text-blue-300 tabular-nums pt-1">\u2014</div>
                        <div id="wxRainStatus" class="text-[11px] text-white/40">\u2014</div>
                    </div>
                </div>
                <div class="mt-3 grid grid-cols-4 gap-1 text-center">
                    <div><div id="wyCape" class="text-sm font-bold text-white/85 tabular-nums">\u2014</div><div class="text-[10px] text-white/35">MUCAPE</div></div>
                    <div><div id="wyLi" class="text-sm font-bold text-white/85 tabular-nums">\u2014</div><div class="text-[10px] text-white/35">LI</div></div>
                    <div><div id="wyK" class="text-sm font-bold text-white/85 tabular-nums">\u2014</div><div class="text-[10px] text-white/35">K</div></div>
                    <div><div id="wyPw" class="text-sm font-bold text-white/85 tabular-nums">\u2014</div><div class="text-[10px] text-white/35">PW</div></div>
                </div>
                <div id="wyMeta" class="text-[10px] text-white/30 mt-1.5">Wyoming 78988</div>
                <div hidden>
                    <span id="wxDew"></span><span id="wxRh"></span><span id="wxCloud"></span>
                    <span id="wxPressureTrend"></span><span id="wxPressure"></span><span id="wxPressureHint"></span>
                    <span id="wxGustKt"></span><span id="wxPrecipPeriod"></span>
                    <div id="rainWrap"></div><div id="compassGroup"></div>
                </div>
            </div>
`;

const PROJ_HTML = `
            <!-- PROJECTED USAGE & COST -->
            <div class="card rounded-3xl p-5 card-accent-purple lg:col-span-2">
                <div class="flex items-center gap-2.5 mb-4">
                    <div class="text-3xl">\uD83D\uDCCA</div>
                    <div class="min-w-0">
                        <div class="text-[15px] font-bold">Projected usage &amp; cost</div>
                        <div class="text-[11px] text-purple-300/80 mt-0.5 truncate">Today and 30-day outlook \u00b7 <span id="projAcTag" class="text-white/40"></span></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.07]">
                        <div class="text-[11px] text-white/40 tracking-widest mb-2">TODAY</div>
                        <div id="projUsage" class="text-3xl font-bold text-orange-400 tabular-nums leading-none">\u2014</div>
                        <div class="text-[11px] text-white/35 mt-1.5">usage</div>
                        <div class="mt-3 text-2xl font-bold text-yellow-400 tabular-nums leading-none"><span id="projCost">\u2014</span> <span class="text-[13px] font-semibold text-white/40">XCG</span></div>
                        <div class="text-[11px] text-white/35 mt-1.5">cost</div>
                    </div>
                    <div class="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.07]">
                        <div class="text-[11px] text-white/40 tracking-widest mb-2">30 DAYS</div>
                        <div id="projMonthUsage" class="text-3xl font-bold text-orange-300 tabular-nums leading-none">\u2014</div>
                        <div class="text-[11px] text-white/35 mt-1.5">usage</div>
                        <div id="projMonthCost" class="mt-3 text-2xl font-bold text-purple-400 tabular-nums leading-none">\u2014</div>
                        <div class="text-[11px] text-white/35 mt-1.5">cost</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div><div id="projSolar" class="text-lg font-bold text-emerald-400 tabular-nums">\u2014</div><div class="text-[11px] text-white/35">Solar</div></div>
                    <div><div id="projImport" class="text-lg font-bold text-red-400 tabular-nums">\u2014</div><div class="text-[11px] text-white/35">Import</div></div>
                    <div><div id="projExport" class="text-lg font-bold text-emerald-300 tabular-nums">\u2014</div><div class="text-[11px] text-white/35">Export</div></div>
                </div>
                <div class="mt-3 text-center text-[12px] text-white/40"><span id="projSelfSuf" class="text-emerald-400 font-semibold">\u2014</span> self-sufficient today</div>
            </div>
`;

const PATCH_SCRIPT = `
<script id="uiPatchv123">
(function(){
  function tick(){
    var u=document.getElementById('projUsage');
    var c=document.getElementById('projCost');
    var mu=document.getElementById('projMonthUsage');
    var mc=document.getElementById('projMonthCost');
    if(!u||!c||!mu||!mc)return;
    var uk=parseFloat(u.textContent), ck=parseFloat(c.textContent);
    if(isFinite(uk)) mu.textContent=(Math.max(0,uk)*30).toFixed(0)+' kWh';
    if(isFinite(ck)) mc.textContent=(ck*30).toFixed(1)+' XCG';
  }
  function wySlot(){
    var n=new Date(), h=n.getUTCHours();
    var use12=h>=14;
    var d=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate(),use12?12:0,0,0));
    if(h<2) d.setUTCDate(d.getUTCDate()-1);
    function p(x){return String(x).padStart(2,'0');}
    return d.getUTCFullYear()+'-'+p(d.getUTCMonth()+1)+'-'+p(d.getUTCDate())+' '+p(d.getUTCHours())+':00:00';
  }
  function grab(html,code){
    var re=new RegExp(code+'</TD>\\s*<TD>[^<]*</TD>\\s*<TD[^>]*>\\s*([\\d.-]+)','i');
    var m=String(html).match(re);
    return m?m[1]:null;
  }
  function setTxt(id,v,suf){
    var el=document.getElementById(id); if(!el)return;
    el.textContent=v==null?'\u2014':(suf?v+suf:v);
  }
  async function fetchWyoming(){
    var dt=wySlot();
    var url='https://weather.uwyo.edu/wsgi/sounding?datetime='+encodeURIComponent(dt)+'&id=78988&type=TEXT:LIST';
    var wraps=[
      function(u){return 'https://r.jina.ai/'+u;},
      function(u){return 'https://corsproxy.io/?url='+encodeURIComponent(u);},
      function(u){return 'https://api.allorigins.win/raw?url='+encodeURIComponent(u);}
    ];
    var html=null;
    for(var i=0;i<wraps.length && !html;i++){
      try{
        var r=await fetch(wraps[i](url));
        if(!r.ok) continue;
        var x=await r.text();
        if(x && x.indexOf('MUCAPE')>=0) html=x;
      }catch(e){}
    }
    var meta=document.getElementById('wyMeta');
    if(!html){ if(meta) meta.textContent='Wyoming 78988 \u00b7 unavailable'; return; }
    setTxt('wyCape', grab(html,'MUCAPE'));
    setTxt('wyLi', grab(html,'LFVT'));
    setTxt('wyK', grab(html,'KINX'));
    var pw=grab(html,'PWAT');
    setTxt('wyPw', pw, pw!=null?' mm':null);
    if(meta) meta.textContent='Wyoming 78988 \u00b7 '+dt+' UTC';
  }
  setInterval(tick,3000);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){tick();fetchWyoming();});
  else {tick();fetchWyoming();}
})();
</script>
`;

function patchJs(html){
    if(typeof html!=='string')return html;
    html=html.replace('latitude=12.17&longitude=-68.99','latitude=12.18&longitude=-68.96');
    html=html.replace('const res=await Promise.any([omP,knmiP]);','let res;try{res=await omP;}catch(e){res=await knmiP;}');
    html=html.replace(
        'function $(id){ return _elCache[id]||(_elCache[id]=document.getElementById(id)); }',
        'function $(id){ var e=_elCache[id]; if(e)return e; e=document.getElementById(id); if(e)return (_elCache[id]=e); if(!_dummyEl){ _dummyEl=document.createElement("div"); _dummyEl.hidden=true; _dummyEl.style.width="0px"; } return _dummyEl; }\nvar _dummyEl=null;'
    );
    html=html.replace(
        'const projSS=projUsage>0?Math.min(100,Math.round((projUsage-projImp)/projUsage*100)):100;',
        'const projSS=projUsage>0?Math.max(0,Math.min(100,Math.round((projUsage-projImp)/projUsage*100))):100;'
    );
    html=html.replace('function buildRain(intensity){\n    const w=$("rainWrap");w.innerHTML="";','function buildRain(intensity){return;');
    html=html.replace(
        'if(d.wind_dir!==null&&!isNaN(d.wind_dir))\n        $("compassGroup").style.transform=`rotate(${d.wind_dir+180}deg)`;',
        'if(false&&d.wind_dir!==null&&!isNaN(d.wind_dir)) $("compassGroup").style.transform=`rotate(${d.wind_dir+180}deg)`;'
    );
    html=html.replace(
        'updateClock(); setInterval(updateClock,1000);\n    update(); setInterval(update,1200);',
        'updateClock(); window._clockTimer=setInterval(updateClock,1000);\n    update(); window._updTimer=setInterval(update,3000);'
    );
    html=html.replace(
        'setInterval(()=>{saveState();saveStats();checkEveningAutoSave();},10000);',
        'window._saveTimer=setInterval(()=>{saveState();saveStats();checkEveningAutoSave();},15000);'
    );
    html=html.replace(
        "document.addEventListener('visibilitychange',async()=>{\n    if(document.visibilityState==='visible'){\n        if(!_wakeLock)await _requestWakeLock();\n        kickWeather(); // refresh radiation & weather whenever app comes to foreground\n    }\n});",
        "document.addEventListener('visibilitychange',async()=>{\n    const on=document.visibilityState==='visible';\n    document.body.classList.toggle('bg-paused',!on);\n    if(on){\n        if(!_wakeLock)await _requestWakeLock();\n        kickWeather();\n        if(!window._updTimer)window._updTimer=setInterval(update,3000);\n        if(!window._clockTimer)window._clockTimer=setInterval(updateClock,1000);\n        if(!window._saveTimer)window._saveTimer=setInterval(()=>{saveState();saveStats();checkEveningAutoSave();},15000);\n        update();\n    }else{\n        if(window._updTimer){clearInterval(window._updTimer);window._updTimer=null;}\n        if(window._clockTimer){clearInterval(window._clockTimer);window._clockTimer=null;}\n        if(window._saveTimer){clearInterval(window._saveTimer);window._saveTimer=null;}\n        if(_wakeLock){try{_wakeLock.release();}catch(e){}_wakeLock=null;}\n    }\n});"
    );
    html=html.replace(
        'function renderChart7(){\n    const days=statsData.slice(-7);\n    const total7sol=days.reduce((a,d)=>a+d.solar_kwh,0);',
        'function renderChart7(){\n    const days=statsData.slice(-7);\n    if(!days.length){const z=$("chart7Bars");if(z)z.innerHTML="";return;}\n    const total7sol=days.reduce((a,d)=>a+(d.solar_kwh||0),0);'
    );
    html=html.replace(
        'function renderChart30(){\n    const days=statsData.slice(-30);\n    const total=days.reduce((a,d)=>({sol:a.sol+d.solar_kwh,cost:a.cost+d.cost_xcg}),{sol:0,cost:0});',
        'function renderChart30(){\n    const days=statsData.slice(-30);\n    if(!days.length){const z=$("chart30Bars");if(z)z.innerHTML="";return;}\n    const total=days.reduce((a,d)=>({sol:a.sol+(d.solar_kwh||0),cost:a.cost+(d.cost_xcg||0)}),{sol:0,cost:0});'
    );
    html=html.replace('const c=$("chart7Bars");c.innerHTML="";','const c=$("chart7Bars");if(!c)return;c.innerHTML="";');
    html=html.replace('const c=$("chart30Bars");c.innerHTML="";','const c=$("chart30Bars");if(!c)return;c.innerHTML="";');
    html=html.replace(
        'function updateAcLabels(){\n    $("setpointLabel").innerText=acMode?`Setpoint: ${setpoint}.0\u00b0C`:"AC off";\n}',
        'function updateAcLabels(){\n    const el=$("setpointLabel"); if(el)el.innerText=acMode?`Setpoint: ${setpoint}.0\u00b0C`:"AC off";\n}'
    );
    return html;
}

let _rewriteKey='';
let _rewriteOut='';
function restyleDashboard(html){
    if(typeof html!=='string')return html;
    const key=html.length+':'+html.slice(0,96)+':'+html.slice(-96);
    if(_rewriteOut && key===_rewriteKey) return _rewriteOut;
    html=patchJs(html);
    if(html.indexOf('<!-- INDOOR -->')>=0){
        html=html.replace(/<!-- INDOOR -->[\s\S]*?<!-- \u2550\u2550\u2550 STATISTICS SECTION \u2550\u2550\u2550 -->/,'        </div>\n\n        <!-- \u2550\u2550\u2550 STATISTICS SECTION \u2550\u2550\u2550 -->');
    }
    if(html.indexOf('<!-- WEATHER')>=0 && html.indexOf('Hato')<0){
        html=html.replace(/<!-- WEATHER[\s\S]*?<!-- RADIATION \(2 cols\) -->/, WEATHER_HTML + '\n            <!-- RADIATION (2 cols) -->');
    }
    if(html.indexOf('PROJECTED FULL DAY')>=0 || (html.indexOf('id="projUsage"')>=0 && html.indexOf('projMonthUsage')<0)){
        html=html.replace(/<!-- \u2550\u2550\u2550 PROJECTED FULL DAY \u2550\u2550\u2550 -->[\s\S]*?<!-- SOLAR \(2 cols\) -->/, PROJ_HTML + '\n            <!-- SOLAR (2 cols) -->');
    }
    const missing=STRIP_IDS.filter(id=>html.indexOf('id="'+id+'"')<0);
    if(missing.length){
        const stubs=missing.map(id=>'<div id="'+id+'" hidden></div>').join('');
        if(html.indexOf('<body>')>=0) html=html.replace('<body>', '<body>\n'+stubs);
        else html=html.replace('</body>', stubs+'\n</body>');
    }
    if(html.indexOf('id="uiPatchv123"')<0) html=html.replace('</body>', PATCH_SCRIPT+'\n</body>');
    if(html.indexOf('bg-paused')<0) html=html.replace('</style>', 'body.bg-paused .fdot,body.bg-paused .pulse-dot,body.bg-paused .rdrop{animation-play-state:paused!important}</style>');
    _rewriteKey=key; _rewriteOut=html;
    return html;
}

function rewriteIfDashboard(request, response){
    if(!response || response.status!==200)return Promise.resolve(response);
    const url=new URL(request.url);
    const nav=request.mode==='navigate' || request.destination==='document';
    const isIndex=/index\.html$/.test(url.pathname) || /\/$/.test(url.pathname);
    if(!nav && !isIndex)return Promise.resolve(response);
    const ct=(response.headers.get('content-type')||'').toLowerCase();
    if(ct.includes('javascript') || ct.includes('json') || ct.includes('image'))return Promise.resolve(response);
    const clone=response.clone();
    return response.text().then(text=>{
        if(!text || (text.indexOf('<html')<0 && text.indexOf('<HTML')<0 && text.indexOf('<!DOCTYPE')<0 && text.indexOf('<!doctype')<0)) return clone;
        const out=restyleDashboard(text);
        const headers=new Headers(response.headers);
        headers.set('content-type','text/html; charset=utf-8');
        headers.delete('content-length');
        return new Response(out,{status:200, statusText:response.statusText, headers});
    }).catch(()=>clone);
}

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    const DATA_HOSTS = ['knmi.nl','open-meteo.com','uwyo.edu','corsproxy.io','allorigins.win','codetabs.com','r.jina.ai'];
    if (DATA_HOSTS.some(h => url.hostname.includes(h))) return;
    if (url.hostname === self.location.hostname || url.protocol === 'file:') {
        const nav=e.request.mode==='navigate' || e.request.destination==='document';
        e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(cached => {
            const fromNet = fetch(e.request).then(r => { if (r && r.status === 200) c.put(e.request, r.clone()); return r; }).catch(()=>null);
            const raw = nav ? fromNet.then(r=>r||cached) : Promise.resolve(cached).then(r=>r||fromNet);
            return raw.then(r => r ? rewriteIfDashboard(e.request, r) : r);
        })));
        return;
    }
    e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(cached => {
        const live = fetch(e.request).then(r => { if (r && r.status === 200) c.put(e.request, r.clone()); return r; }).catch(() => null);
        return cached || live;
    })));
});
