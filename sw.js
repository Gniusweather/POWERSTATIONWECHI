const CACHE = 'powerdash-v122-hide-indoor-house-cost';
// v122: rewrite index.html on the fly so Indoor / House Total / Today's Cost
// cards are removed even though the committed index.html is still the old file.
const LOCAL_FILES = ['./', './index.html', './manifest.json', './icon.svg'];

const STRIP_IDS = ['indoor','setpointLabel','outdoor','indoorDelta','houseTotal','bdAcBar','bdAc','bdFridgeBar','bdFridge','bdOtherBar','bdOther','rateLabel','daily','dailyTrend','monthly','savings'];

function stripRemovedCards(html){
    if(typeof html!=='string')return html;
    if(html.indexOf('<!-- INDOOR -->')>=0){
        html=html.replace(
            /<!-- INDOOR -->[\s\S]*?<!-- ═══ STATISTICS SECTION ═══ -->/,
            '        </div>\n\n        <!-- ═══ STATISTICS SECTION ═══ -->'
        );
    }
    if(html.indexOf('id="houseTotal"')>=0){
        html=html.replace(
            /<!-- INDOOR -->[\s\S]*?id="houseTotal"[\s\S]*?<!-- ═══ STATISTICS SECTION ═══ -->/,
            '        </div>\n\n        <!-- ═══ STATISTICS SECTION ═══ -->'
        );
    }
    if(STRIP_IDS.some(id=>html.indexOf('id="'+id+'"')<0)){
        const stubs=STRIP_IDS.map(id=>'<div id="'+id+'" hidden></div>').join('');
        html=html.replace('</body>', stubs+'\n</body>');
    }
    return html;
}

function rewriteIfDashboard(request, response){
    if(!response || response.status!==200)return Promise.resolve(response);
    const url=new URL(request.url);
    const nav=request.mode==='navigate' || request.destination==='document';
    const isIndex=/(^|\/)(index\.html)?$/.test(url.pathname);
    if(!nav && !isIndex)return Promise.resolve(response);
    const ct=(response.headers.get('content-type')||'').toLowerCase();
    if(ct && !ct.includes('html') && !ct.includes('text') && ct.includes('javascript'))return Promise.resolve(response);
    return response.text().then(text=>{
        const out=stripRemovedCards(text);
        const headers=new Headers(response.headers);
        headers.set('content-type','text/html; charset=utf-8');
        headers.delete('content-length');
        return new Response(out,{status:200, statusText:response.statusText, headers});
    }).catch(()=>response);
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
        e.respondWith(
            caches.open(CACHE).then(c =>
                c.match(e.request).then(cached => {
                    const fromNet = fetch(e.request).then(r => {
                        if (r && r.status === 200) c.put(e.request, r.clone());
                        return r;
                    });
                    const raw = cached || fromNet;
                    return Promise.resolve(raw).then(r => rewriteIfDashboard(e.request, r));
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
