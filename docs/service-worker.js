/**
 * ServiceWorker.<br>
 * https://web.dev/offline-fallback-page/<br>
 * https://gist.github.com/adactio/fbaa3a5952774553f5e7<br>
 * https://googlechrome.github.io/samples/service-worker/basic/<br>
 */
const VERSION = '1';
const CACHE_STATIC = `CACHE_STATIC_${VERSION}`;
const CACHE_DYNAMIC = `CACHE_DYNAMIC_${VERSION}`;
const CACHES = [CACHE_STATIC, CACHE_DYNAMIC];
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_STATIC);
        // Setting {cache: 'reload'} in the new request will ensure that
        // the response isn't fulfilled from the HTTP cache;
        // i.e., it will be from the network.
        await cache.addAll([
          new Request(OFFLINE_URL, { cache: 'reload' }),
          new Request('favicon-32x32.png', { cache: 'reload' }),
          new Request('images/MuffinsZebulon-header.jps', { cache: 'reload' }),
          new Request('images/MuffinsZebulon-2021-TimesRoll_192.png', { cache: 'reload' }),
          new Request('images/MuffinsZebulon-2010-AfterAllTheStoryGoes_192.jpg', { cache: 'reload' }),
          new Request('images/MuffinsZebulon-2000-MuffinsZebulon_192.jpg', { cache: 'reload' }),

          new Request('2000-MuffinsZebulon.css', { cache: 'reload' }),
          new Request('2000-MuffinsZebulon.html', { cache: 'reload' }),
          new Request('2000-MuffinsZebulon.js', { cache: 'reload' }),
          new Request('2010-AfterAllTheStoryGoes.css', { cache: 'reload' }),
          new Request('2010-AfterAllTheStoryGoes.html', { cache: 'reload' }),
          new Request('2010-AfterAllTheStoryGoes.js', { cache: 'reload' }),
          new Request('2021-TimesRoll.css', { cache: 'reload' }),
          new Request('2021-TimesRoll.html', { cache: 'reload' }),
          new Request('2021-TimesRoll.js', { cache: 'reload' }),
          new Request('audio.js', { cache: 'reload' }),
          new Request('common-album.css', { cache: 'reload' }),
          new Request('common.css', { cache: 'reload' }),
          new Request('index.css', { cache: 'reload' }),
          new Request('index.html', { cache: 'reload' }),
          new Request('share.js', { cache: 'reload' }),

          new Request('audio/MuffinsZebulon-2021-TimesRoll-01-TimesGoinBy.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-02-Vinaigre.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-01-TimesGoinBy.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-02-Vinaigre.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-03-GirlAndBoy.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-04-IllBeHere.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-05-OneMoreYear.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-06-ItsTimeForYou.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-07-Virus.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-08-Alien.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-09-BadJoke.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-10-MysteryGirl.mp3', { cache: 'reload' }),
          new Request('audio/MuffinsZebulon-2021-TimesRoll-11-AVeryGoodMum.mp3', { cache: 'reload' }),
        ]);
      } catch (error) {
        console.log(error);
      }
    })(),
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        for (const key of keys) {
          if (CACHES.includes(key)) {
            caches.delete(key);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })(),
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const request = event.request;
        if (request.method !== 'GET') { // Always fetch non-GET requests from the network
          return fetch(request); // networkResponse
        }
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_DYNAMIC);
        await cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.log(error);
        return caches.match(OFFLINE_URL); // cachedResponse
      }
    })(),
  );
});
