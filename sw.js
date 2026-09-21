const SURUM = "ezber-b244a654c25f";
const DOSYALAR = ["./", "./index.html", "./kelimeler.json",
                  "./manifest.webmanifest", "./ikon-192.png", "./ikon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM)
    .then(c => c.addAll(DOSYALAR))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  // Surum degisince eski onbellekleri sil; yoksa telefon eski desteyi gosterir.
  e.waitUntil(caches.keys()
    .then(adlar => Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Tanimadigi istekler (ornegin uygulamanin api/deck yoklamasi) aga gecer ve
  // cevrimdisiyken basarisiz olur - uygulama bunu mod seciminde bekliyor.
  e.respondWith(caches.match(e.request).then(bulunan => bulunan || fetch(e.request)));
});
