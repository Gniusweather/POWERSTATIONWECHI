const CACHE = 'powerdash-v124-bugsweep';
// v124: null-safe DOM, projection clamp, empty-chart guards, stubs before init.
const LOCAL_FILES = ['./', './index.html', './manifest.json', './icon.svg'];

const STRIP_IDS = ['indoor','setpointLabel','outdoor','indoorDelta','houseTotal','bdAcBar','bdAc','bdFridgeBar','bdFridge','bdOtherBar','bdOther','rateLabel','daily','dailyTrend','monthly','savings'];

const WEATHER_HTML = `
            <!-- WEATHER -->
            <div class="card rounded-3xl p-5 card-accent-sky">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2.5">
                        <div id="wxIcon" class="text-4xl leading-none" style="filter:drop-shadow(0 0 14px rgba(56,189,248,0.55))">⛅</div>
                        <div>
                            <div class="text-[15px] font-bold">Bonaire weather</div>
                            <div id="wxCondition" class="text-[11px] text-sky-400 mt-0.5 tracking-widest uppercase">—</div>
                        </div>
                    </div>
                    <div id="wxObsTime" class="text-[11px] text-white/35 text-right leading-tight">KNMI</div>
                </div>
                <div class="flex items-end justify-between gap-3">
                    <div>
                        <div id="wxFeels" class="text-5xl font-bold text-white tabular-nums leading-none">—°</div>
                        <div class="text-[11px] text-white/40 mt-2">feels like · <span id="wxAir" class="text-white/70">—</span>°C air</div>
                    </div>
                    <div class="text-right space-y-0.5">
                        <div id="wxWindKt" class="text-[17px] font-bold text-sky-300 tabular-nums">— kt</div>
                        <div id="wxWindDir" class="text-[11px] text-white/40">—</div>
                        <div id="wxPrecip" class="text-[17px] font-bold text-blue-300 tabular-nums pt-1">—</div>
                        <div id="wxRainStatus" class="text-[11px] text-white/40">—</div>
                    </div>
                </div>
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
                    <div class="text-3xl" style="filter:drop-shadow(0 0 10px rgba(167,139,250,0.45))">📊</div>
                    <div class="min-w-0">
                        <div class="text-[15px] font-bold">Projected usage &amp; cost</div>
                        <div class="text-[11px] text-purple-300/80 mt-0.5 truncate">Today and 30-day outlook · <span id="projAcTag" class="text-white/40"></span></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.07]">
                        <div class="text-[11px] text-white/40 tracking-widest mb-2">TODAY</div>
                        <div id="projUsage" class="text-3xl font-bold text-orange-400 tabular-nums leading-none">—</div>
                        <div class="text-[11px] text-white/35 mt-1.5">usage</div>
                        <div class="mt-3 text-2xl font-bold text-yellow-400 tabular-nums leading-none"><span id="projCost">—</span> <span class="text-[13px] font-semibold text-white/40">XCG</span></div>
                        <div class="text-[11px] text-white/35 mt-1.5">cost</div>
                    </div>
                    <div class="bg-white/[0.04] rounded-2xl p-3 border border-white/[0.07]">
                        <div class="text-[11px] text-white/40 tracking-widest mb-2">30 DAYS</div>
                        <div id="projMonthUsage" class="text-3xl font-bold text-orange-300 tabular-nums leading-none">—</div>
                        <div class="text-[11px] text-white/35 mt-1.5">usage</div>
                        <div id="projMonthCost" class="mt-3 text-2xl font-bold text-purple-400 tabular-nums leading-none">—</div>
                        <div class="text-[11px] text-white/35 mt-1.5">cost</div>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div id="projSolar" class="text-lg font-bold text-emerald-400 tabular-nums">—</div>
                        <div class="text-[11px] text-white/35">Solar</div>
                    </div>
                    <div>
                        <div id="projImport" class="text-lg font-bold text-red-400 tabular-nums">—</div>
                        <div class="text-[11px] text-white/35">Import</div>
                    </div>
                    <div>
                        <div id="projExport" class="text-lg font-bold text-emerald-300 tabular-nums">—</div>
                        <div class="text-[11px] text-white/35">Export</div>
                    </div>
                </div>
                <div class="mt-3 text-center text-[12px] text-white/40">
                    <span id="projSelfSuf" class="text-emerald-400 font-semibold">—</span> self-sufficient today
                </div>
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
  setInterval(tick,1000);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tick);
  else tick();
})();
</script>
`;

function patchJs(html){
    if(typeof html!=='string')return html;

    html=html.replace(
        'function $(id){ return _elCache[id]||(_elCache[id]=document.getElementById(id)); }',
        'function $(id){ var e=_elCache[id]; if(e)return e; e=document.getElementById(id); if(e)return (_elCache[id]=e); if(!_dummyEl){ _dummyEl=document.createElement("div"); _dummyEl.hidden=true; _dummyEl.style.width="0px"; } return _dummyEl; }\nvar _dummyEl=null;'
    );

    html=html.replace(
        'const projSS=projUsage>0?Math.min(100,Math.round((projUsage-projImp)/projUsage*100)):100;',
        'const projSS=projUsage>0?Math.max(0,Math.min(100,Math.round((projUsage-projImp)/projUsage*100))):100;'
    );

    html=html.replace(
        'function buildRain(intensity){\n    const w=$("rainWrap");w.innerHTML="";',
        'function buildRain(intensity){\n    const w=$("rainWrap");if(!w)return;w.innerHTML="";'
    );

    html=html.replace(
        'function renderChart7(){\n    const days=statsData.slice(-7);\n    const total7sol=days.reduce((a,d)=>a+d.solar_kwh,0);',
        'function renderChart7(){\n    const days=statsData.slice(-7);\n    if(!days.length){const z=$("chart7Bars");if(z)z.innerHTML="";return;}\n    const total7sol=days.reduce((a,d)=>a+(d.solar_kwh||0),0);'
    );

    html=html.replace(
        'function renderChart30(){\n    const days=statsData.slice(-30);\n    const total=days.reduce((a,d)=>({sol:a.sol+d.solar_kwh,cost:a.cost+d.cost_xcg}),{sol:0,cost:0});',
        'function renderChart30(){\n    const days=statsData.slice(-30);\n    if(!days.length){const z=$("chart30Bars");if(z)z.innerHTML="";return;}\n    const total=days.reduce((a,d)=>({sol:a.sol+(d.solar_kwh||0),cost:a.cost+(d.cost_xcg||0)}),{sol:0,cost:0});'
    );

    html=html.replace(
        'const c=$("chart7Bars");c.innerHTML="";',
        'const c=$("chart7Bars");if(!c)return;c.innerHTML="";'
    );
    html=html.replace(
        'const c=$("chart30Bars");c.innerHTML="";',
        'const c=$("chart30Bars");if(!c)return;c.innerHTML="";'
    );

    html=html.replace(
        'function updateAcLabels(){\n    $("setpointLabel").innerText=acMode?`Setpoint: ${setpoint}.0°C`:"AC off";\n}',
        'function updateAcLabels(){\n    const el=$("setpointLabel"); if(el)el.innerText=acMode?`Setpoint: ${setpoint}.0°C`:"AC off";\n}'
    );

    return html;
}

function restyleDashboard(html){
    if(typeof html!=='string')return html;

    html=patchJs(html);

    if(html.indexOf('<!-- INDOOR -->')>=0){
        html=html.replace(
            /<!-- INDOOR -->[\s\S]*?<!-- ═══ STATISTICS SECTION ═══ -->/,
            '        </div>\n\n        <!-- ═══ STATISTICS SECTION ═══ -->'
        );
    }

    if(html.indexOf('<!-- WEATHER')>=0 && html.indexOf('Bonaire weather')<0){
        html=html.replace(
            /<!-- WEATHER[\s\S]*?<!-- RADIATION \(2 cols\) -->/,
            WEATHER_HTML + '\n            <!-- RADIATION (2 cols) -->'
        );
    }

    if(html.indexOf('PROJECTED FULL DAY')>=0 || (html.indexOf('id="projUsage"')>=0 && html.indexOf('projMonthUsage')<0)){
        html=html.replace(
            /<!-- ═══ PROJECTED FULL DAY ═══ -->[\s\S]*?<!-- SOLAR \(2 cols\) -->/,
            PROJ_HTML + '\n            <!-- SOLAR (2 cols) -->'
        );
    }

    const missing=STRIP_IDS.filter(id=>html.indexOf('id="'+id+'"')<0);
    if(missing.length){
        const stubs=missing.map(id=>'<div id="'+id+'" hidden></div>').join('');
        if(html.indexOf('<body>')>=0) html=html.replace('<body>', '<body>\n'+stubs);
        else html=html.replace('</body>', stubs+'\n</body>');
    }

    if(html.indexOf('id="uiPatchv123"')<0){
        html=html.replace('</body>', PATCH_SCRIPT+'\n</body>');
    }
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
        if(!text || (text.indexOf('<html')<0 && text.indexOf('<HTML')<0 && text.indexOf('<!DOCTYPE')<0 && text.indexOf('<!doctype')<0)){
            return clone;
        }
        const out=restyleDashboard(text);
        const headers=new Headers(response.headers);
        headers.set('content-type','text/html; charset=utf-8');
        headers.delete('content-length');
        return new Response(out,{status:200, statusText:response.statusText, headers});
    }).catch(()=>clone);
}

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(LOCAL_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    const DATA_HOSTS = ['knmi.nl','open-meteo.com','corsproxy.io','allorigins.win','codetabs.com','r.jina.ai'];
    if (DATA_HOSTS.some(h => url.hostname.includes(h))) {
        return;
    }

    if (url.hostname === self.location.hostname || url.protocol === 'file:') {
        const nav=e.request.mode==='navigate' || e.request.destination==='document';
        e.respondWith(
            caches.open(CACHE).then(c =>
                c.match(e.request).then(cached => {
                    const fromNet = fetch(e.request).then(r => {
                        if (r && r.status === 200) c.put(e.request, r.clone());
                        return r;
                    }).catch(()=>null);
                    const raw = nav ? fromNet.then(r=>r||cached) : Promise.resolve(cached).then(r=>r||fromNet);
                    return raw.then(r => r ? rewriteIfDashboard(e.request, r) : r);
                })
            )
        );
        return;
    }

    e.respondWith(
        caches.open(CACHE).then(c =>
            c.match(e.request).then(cached => {
                const live = fetch(e.request).then(r => {
                    if (r && r.status === 200) c.put(e.request, r.clone());
                    return r;
                }).catch(() => null);
                return cached || live;
            })
        )
    );
});
