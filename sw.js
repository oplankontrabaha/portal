/* =====================================================================
   OKB PORTAL · sw.js  (optional helper for the GitHub Pages copy)
   Put this file beside index.html. It lets the portal OPEN when there is
   no signal, using the copy of the page kept from the last visit.

   What it does:
     • the page itself  → newest from the network; the kept copy if the
                          network does not answer
     • Leaflet (the map) and the fonts → kept copy first
   What it never does:
     • it does not touch anything sent to the OKB server. Saving, the
       outbox and syncing are done by the page.
   Change VERSION only if you want every device to drop its kept copies.
   ===================================================================== */
const VERSION = 'okb-portal-v1';
const SHELL = VERSION + ':page';
const LIBS = VERSION + ':libs';
const LIB_HOSTS = /(^|\.)(unpkg\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

/* Kept right away, so the very next visit can already open with no signal. */
const FIRST_LIBS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    try {
      const page = await fetch('./', { cache: 'reload' });
      if (page && page.ok) await (await caches.open(SHELL)).put('page', page);
    } catch (e) { /* kept on the next visit instead */ }
    const libs = await caches.open(LIBS);
    await Promise.all(FIRST_LIBS.map(async u => {
      try {
        const res = await fetch(u, { mode: 'cors' });
        if (res && res.ok) await libs.put(u, res);
      } catch (e) { /* kept when the page asks for it */ }
    }));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.indexOf('okb-portal-') === 0 && n.indexOf(VERSION + ':') !== 0).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;                         // saves go straight to the server
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate' || /(\/|\.html)$/.test(url.pathname)) { event.respondWith(pageFirst(req)); return; }
    if (/\/(api|test)\//.test(url.pathname) || /sw\.js$/.test(url.pathname)) return;
    event.respondWith(networkFirst(req));
    return;
  }
  if (LIB_HOSTS.test(url.hostname)) event.respondWith(keptFirst(req));
});

function timeout(ms) { return new Promise((resolve, reject) => setTimeout(() => reject(new Error('timeout')), ms)); }

/* The page: the network gets a few seconds; after that the kept copy opens
   (and the fresh page still replaces the kept copy when it does arrive). */
async function pageFirst(req) {
  const cache = await caches.open(SHELL);
  const fromNet = fetch(req).then(res => {
    if (res && res.ok) cache.put('page', res.clone());
    return res;
  });
  try {
    return await Promise.race([fromNet, timeout(5000)]);
  } catch (err) {
    const kept = await cache.match('page');
    if (kept) { fromNet.catch(() => {}); return kept; }
    return fromNet;
  }
}

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const kept = await cache.match(req);
    if (kept) return kept;
    throw err;
  }
}

async function keptFirst(req) {
  const cache = await caches.open(LIBS);
  const kept = await cache.match(req);
  if (kept) return kept;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}
