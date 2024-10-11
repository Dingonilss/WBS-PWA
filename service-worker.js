
// Name des Cashes (frei wählbarer Name)
const staticCashName = 'site-static'

// Array mit Datein die gecashed werden sollen
const assets = [
    '/',
    '/style.css',
    '/script.js'
]

/*
Läd die Datein beim Installieren des Service Workers am Anfang herunter.
(Daten aus dem asset Array oben)
*/
self.addEventListener('install', (event) => {
    console.log('Service Worker Installiert.')
    event.waitUntil(
        caches.open(staticCashName).then(cache => {
            cache.addAll(assets)
        })
    )
})




self.addEventListener('activate', (event) => {  // eslint-disable-line no-unused-vars
})



/*
Wenn keine Internetverbindung wird der fetch an den Service Worker weitergeleitet.
Wenn die gesuchte Datei im Service Worker gespeichert ist (asset Array oben)
dann wird er vom Service Worker aus gesendet.
*/
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            return cacheResponse || fetch(event.request)
        })
    )
})