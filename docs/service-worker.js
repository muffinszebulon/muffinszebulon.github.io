/**
 * ServiceWorker.<br>
 * https://web.dev/offline-fallback-page/<br>
 * https://gist.github.com/adactio/fbaa3a5952774553f5e7<br>
 * https://googlechrome.github.io/samples/service-worker/basic/<br>
 * check : chrome://serviceworker-internals<br>
 */
const VERSION = '1';
const CACHE_STATIC = `CACHE_STATIC_${VERSION}`;
const CACHE_DYNAMIC = `CACHE_DYNAMIC_${VERSION}`;
const CACHES = [CACHE_STATIC, CACHE_DYNAMIC];
const OFFLINE_URL = 'offline.html';
const CACHED_URLS = [
  OFFLINE_URL,
  'favicon-32x32.png',
  'images/MuffinsZebulon-header.jpg',
  'images/MuffinsZebulon-2021-TimesRoll_192.png',
  'images/MuffinsZebulon-2010-AfterAllTheStoryGoes_192.jpg',
  'images/MuffinsZebulon-2000-MuffinsZebulon_192.jpg',

  '2000-MuffinsZebulon.css',
  '2000-MuffinsZebulon.html',
  '2000-MuffinsZebulon.js',
  '2010-AfterAllTheStoryGoes.css',
  '2010-AfterAllTheStoryGoes.html',
  '2010-AfterAllTheStoryGoes.js',
  '2021-TimesRoll.css',
  '2021-TimesRoll.html',
  '2021-TimesRoll.js',
  'audio.js',
  'common-album.css',
  'common.css',
  'index.css',
  'index.html',
  'share.js',

  'audio/MuffinsZebulon-2021-TimesRoll-01-TimesGoinBy.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-02-Vinaigre.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-01-TimesGoinBy.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-02-Vinaigre.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-03-GirlAndBoy.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-04-IllBeHere.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-05-OneMoreYear.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-06-ItsTimeForYou.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-07-Virus.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-08-Alien.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-09-BadJoke.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-10-MysteryGirl.mp3',
  'audio/MuffinsZebulon-2021-TimesRoll-11-AVeryGoodMum.mp3',
];

async function addUrlToCache(cache, url) {
  try {
    console.log(`cache add ${url}`);
    // Setting {cache: 'reload'} in the new request will ensure that
    // the response isn't fulfilled from the HTTP cache;
    // i.e., it will be from the network.
    await cache.add(new Request(url, { cache: 'reload' }));
  } catch (error) {
    console.log(url, error);
  }
}

self.addEventListener('install', (event) => {
  console.log('event install');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_STATIC);
        for (const url of CACHED_URLS) {
          addUrlToCache(cache, url);
        }
      } catch (error) {
        console.log(error);
      }
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('event activate');
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (!CACHES.includes(cacheName)) {
            console.log(`cache delete ${cacheName}`);
            caches.delete(cacheName);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })()
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const request = event.request;
        if (request.method !== 'GET') {
          // Always fetch non-GET requests from the network
          return fetch(request); // networkResponse
        }
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log(`response from cache for ${request.url}`);
          return cachedResponse;
        }
        const networkResponse = await fetch(request);
        console.log(`response from network for ${request.url} (status: ${networkResponse.status} type:${networkResponse.type})`);
        if (networkResponse && networkResponse.status !== 500) {
          console.log(`add response to cache for ${request.url}`);
          const cache = await caches.open(CACHE_DYNAMIC);
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.log(error);
        return caches.match(OFFLINE_URL); // cachedResponse
      }
    })()
  );
});
