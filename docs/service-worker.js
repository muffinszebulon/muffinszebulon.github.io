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
const BASE_URL = 'https://muffinszebulon.github.io/';
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
const CACHED_URLS_EXTERNAL = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
  // 'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
];

async function addUrlToCache(cache, url) {
  try {
    console.log(`cache add ${url}`);
    // Setting {cache: 'reload'} in the new request will ensure that
    // the response isn't fulfilled from the HTTP cache;
    // i.e., it will be from the network.
    await cache.add(new Request(BASE_URL + url, { cache: 'reload' }));
  } catch (error) {
    console.error(url, error);
  }
}

async function addExternalRequestToCache(cache, url) {
  try {
    const fontawesome = url.indexOf('fontawesome') >= 0;
    console.log(`cache add ${url} ${fontawesome}`);
    if (fontawesome) {
      await cache.add(new Request(url, { mode: 'cors', integrity: 'sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf' }));
    } else {
      await cache.add(new Request(url));
    }
  } catch (error) {
    console.error(url, error);
  }
}

async function putResponseInCacheDynamic(request, response) {
  try {
    console.log(`add response to cache for ${request.url}`);
    const cache = await caches.open(CACHE_DYNAMIC);
    await cache.put(request, response);
  } catch (error) {
    console.error(request.url, error);
  }
}

async function deleteCache(cacheName) {
  try {
    console.log(`cache delete ${cacheName}`);
    await caches.delete(cacheName);
  } catch (error) {
    console.error(error);
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
        for (const urlExt of CACHED_URLS_EXTERNAL) {
          addExternalRequestToCache(cache, urlExt);
        }
      } catch (error) {
        console.error(error);
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
            deleteCache(cacheName);
          }
        }
        if (self.registration.navigationPreload) {
          await self.registration.navigationPreload.enable();
        }
      } catch (error) {
        console.error(error);
      }
    })()
  );
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  event.respondWith(
    (async () => {
      try {
        if (request.method !== 'GET') {
          // Always fetch non-GET requests from the network
          return fetch(request); // networkResponse
        }
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log(`response from cache for ${request.url}`);
          return cachedResponse;
        }
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          console.warn(`response from preload for ${request.url}`);
          putResponseInCacheDynamic(request, preloadResponse.clone());
          return preloadResponse;
        }
        const networkResponse = await fetch(request);
        console.warn(`response from network for ${request.url} (status: ${networkResponse.status} type:${networkResponse.type})`);
        if (networkResponse && networkResponse.status === 200) {
          putResponseInCacheDynamic(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error(request.url, error);
        return caches.match(OFFLINE_URL); // cachedResponse
      }
    })()
  );
});
