const CACHE = 'powerdash-v100-bugfixes';
// Force update: real-elapsed-time kWh accounting, bill-field XSS fix, SW auto-reload
const LOCAL_FILES = ['./', './index.html', './manifest.json', './icon.svg'];

// ── Install: precache local app shell ──────────────────────────────────────
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(LOCAL_FILES))
            .then(() => self.skipWaiting())
    );
});

// ── Activate: purge old caches ─────────────────────────────────────────────
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// ── Fetch strategy ─────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Never intercept live weather/data requests — these must always hit the
    // network so radiation & conditions are never served stale from cache.
    // Covers Open-Meteo (primary) + every CORS proxy used by fetchKnmiPage.
    const DATA_HOSTS = ['knmi.nl','open-meteo.com','corsproxy.io','allorigins.win','codetabs.com','r.jina.ai'];
    if (DATA_HOSTS.some(h => url.hostname.includes(h))) {
        return;
    }

    // Local app files: cache-first (instant offline load)
    if (url.hostname === self.location.hostname || url.protocol === 'file:') {
        e.respondWith(
            caches.open(CACHE).then(c =>
                c.match(e.request).then(cached =>
                    cached || fetch(e.request).then(r => {
                        if (r && r.status === 200) c.put(e.request, r.clone());
                        return r;
                    })
                )
            )
        );
        return;
    }

    // CDN resources (Tailwind, Font Awesome, Google Fonts): stale-while-revalidate
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
