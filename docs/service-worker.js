const VERSION = '3.0';
const CACHE_STATIC = `CACHE_STATIC_${VERSION}`;
const CACHE_DYNAMIC = `CACHE_DYNAMIC_${VERSION}`;
const CACHE_A3 = `A3`;
const CACHE_A2 = `A2`;
const CACHES = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_A3, CACHE_A2];

const OFFLINE_URL = 'offline.html';
const BASE_URL = 'https://muffinszebulon.github.io/';
const BASE_URL_MP3 = BASE_URL + 'audio/';
const CACHE_STATIC_URLS_INTERNAL = [
  BASE_URL + OFFLINE_URL,
  BASE_URL + 'favicon-32x32.png',
  BASE_URL + 'images/MuffinsZebulon-2021-TimesRoll_80.jpg',
  BASE_URL + 'images/MuffinsZebulon-2010-AfterAllTheStoryGoes_80.jpg',
  BASE_URL + 'images/MuffinsZebulon-2000-MuffinsZebulon_80.jpg',

  BASE_URL + 'images/MuffinsZebulon_575.jpg',
  BASE_URL + 'images/MuffinsZebulon-2021-TimesRoll_575.jpg',
  BASE_URL + 'images/MuffinsZebulon-2010-AfterAllTheStoryGoes_575.jpg',
  BASE_URL + 'images/MuffinsZebulon-2000-MuffinsZebulon_575.jpg',

  BASE_URL + '2000-MuffinsZebulon.css',
  BASE_URL + '2000-MuffinsZebulon.html',
  BASE_URL + '2000-MuffinsZebulon.js',
  BASE_URL + '2010-AfterAllTheStoryGoes.css',
  BASE_URL + '2010-AfterAllTheStoryGoes.html',
  BASE_URL + '2010-AfterAllTheStoryGoes.js',
  BASE_URL + '2021-TimesRoll.css',
  BASE_URL + '2021-TimesRoll.html',
  BASE_URL + '2021-TimesRoll.js',
  BASE_URL + 'app.html',
  BASE_URL + 'audio.js',
  BASE_URL + 'common-album.css',
  BASE_URL + 'common.css',
  BASE_URL + 'favicon-rondblanc.png',
  BASE_URL + 'index.css',
  BASE_URL + 'index.html',
  BASE_URL + 'pwa.js',
  BASE_URL + 'share.js',
  BASE_URL + 'site.webmanifest',
];
const CACHE_STATIC_URLS_EXTERNAL = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
  // 'https://use.fontawesome.com/releases/v5.8.1/css/all.css',
];
const CACHE_A3_URLS = [
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-01-TimesGoinBy.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-02-Vinaigre.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-03-GirlAndBoy.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-04-IllBeHere.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-05-OneMoreYear.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-06-ItsTimeForYou.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-07-Virus.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-08-Alien.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-09-BadJoke.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-10-MysteryGirl.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2021-TimesRoll-11-AVeryGoodMum.mp3',
];
const CACHE_A2_URLS = [
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-01-HereWeAre.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-02-LongAgo.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-03-MyDad.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-04-YoullBePartOfMyWorld.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-05-TypicalPostcard.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-06-IHadEnough.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-07-ManyYearsFromNow.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-08-PreciousOne.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-09-WantItNow.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-10-SuchAMess.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-11-Travel.mp3',
  BASE_URL_MP3 + 'MuffinsZebulon-2010-AfterAllTheStoryGoes-12-AfterAllTheStoryGoes.mp3',
];

var messageChannelPort;

// -------------------------------------------------------------
// Utils

function getCacheUrls(cacheName) {
  if (cacheName === CACHE_A3) {
    return CACHE_A3_URLS;
  } else if (cacheName === CACHE_A2) {
    return CACHE_A2_URLS;
  } else {
    console.debug(cacheName + ' not found');
    return null;
  }
}
function piste2Url(cacheName, piste) {
  let urls = getCacheUrls(cacheName);
  if (!urls) {
    return null;
  }
  if (!piste) {
    return null;
  }
  let index = 0;
  for (const url of urls) {
    index++;
    if (piste === index) {
      return url;
    }
  }
  return null;
}

async function addUrlToCache(cache, url) {
  try {
    console.log(`cache add ${url}`);
    // Setting {cache: 'reload'} in the new request will ensure that
    // the response isn't fulfilled from the HTTP cache;
    // i.e., it will be from the network.
    await cache.add(new Request(url, { cache: 'reload' }));
    return true;
  } catch (error) {
    console.error(url, error);
    return false;
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
  if (
    request.url.indexOf('.flac') >= 0 || // trop lourd pour être caché
    request.url.indexOf('.mp3') >= 0 || // trop lourd pour être caché sans consentement utilisateur
    request.url.indexOf('service-worker.js') >= 0 //
  ) {
    return; // pas de mise en cache
  }
  try {
    console.log(`add response to cache for ${request.url}`);
    const cache = await caches.open(CACHE_DYNAMIC);
    await cache.put(request, response);
  } catch (error) {
    console.error(request.url, error);
  }
}
async function deleteCache(cacheName, piste) {
  try {
    console.debug(`cache delete ${cacheName}`);
    if (!piste) {
      await caches.delete(cacheName);
    } else {
      const cache = await caches.open(cacheName);
      let url = piste2Url(cacheName, piste);
      console.debug(`cache delete ${piste} ${url}`);
      if (url) {
        await cache.delete(url);
      }
    }
    cacheState(cacheName);
  } catch (error) {
    console.error(error);
  }
}
async function deleteCacheAll() {
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    deleteCache(cacheName);
  }
}
async function deleteCacheAllExceptMp3() {
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    if (cacheName.indexOf('A') !== 0) {
      deleteCache(cacheName);
    }
  }
}
// -------------------------------------------------------------
// Actions

async function addAllToCacheStatic() {
  try {
    const cache = await caches.open(CACHE_STATIC);
    for (const url of CACHE_STATIC_URLS_INTERNAL) {
      addUrlToCache(cache, url);
    }
    for (const urlExt of CACHE_STATIC_URLS_EXTERNAL) {
      addExternalRequestToCache(cache, urlExt);
    }
  } catch (error) {
    console.error(error);
  }
}

async function addToCache(cacheName, piste) {
  try {
    let urls = getCacheUrls(cacheName);
    if (!urls) {
      return;
    }
    const cache = await caches.open(cacheName);
    let index = 0;
    const len = urls.length;
    let mp3s = [];
    let cachedCount = 0;
    for (const url of urls) {
      index++;
      let isUrlCached = false;
      if (!piste || piste === index) {
        isUrlCached = await addUrlToCache(cache, url);
      } else {
        isUrlCached = !!(await cache.match(url));
      }
      mp3s.push(isUrlCached);
      if (isUrlCached) {
        cachedCount++;
      }
      messageChannelPort && messageChannelPort.postMessage({ type: 'CACHE_PROGRESS', cache: cacheName, cachedCount: cachedCount, max: len, mp3s: mp3s });
    }
    messageChannelPort && messageChannelPort.postMessage({ type: 'CACHE_STATE', cache: cacheName, cachedCount: cachedCount, max: len, mp3s: mp3s });
  } catch (error) {
    console.error(error);
  }
}

async function cacheState(cacheName) {
  let urls = getCacheUrls(cacheName);
  if (!urls) {
    return;
  }
  const cache = await caches.open(cacheName);
  let mp3s = [];
  let cachedCount = 0;
  for (const url of urls) {
    const isUrlCached = !!(await cache.match(url));
    mp3s.push(isUrlCached);
    if (isUrlCached) {
      cachedCount++;
    }
  }
  const len = urls.length;
  messageChannelPort && messageChannelPort.postMessage({ type: 'CACHE_STATE', cache: cacheName, cachedCount: cachedCount, max: len, mp3s: mp3s });
}

// --------------------------------------------------
// Listeners

self.addEventListener('install', (event) => {
  console.log('event install');
  event.waitUntil(
    (async () => {
      addAllToCacheStatic();
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
        const cachedResponse = await caches.match(request.url);
        if (cachedResponse) {
          console.debug(`response from cache for ${request.url}`);
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

self.addEventListener('message', (event) => {
  var data = event.data;
  if (!data) {
    return;
  }
  console.log(`SW receive ${data.type}`, event);
  if (data.type === 'INIT_PORT') {
    messageChannelPort = event.ports[0];
    messageChannelPort.postMessage({ type: 'INIT_PORT' });
  } else if (data.type === 'VERSION') {
    messageChannelPort.postMessage({ type: 'VERSION', version: VERSION });
  } else if (data.type === 'CACHE_STATE') {
    cacheState(data.cache);
  } else if (data.type === 'CACHE') {
    addToCache(data.cache, data.piste);
  } else if (data.type === 'UNCACHE') {
    if (data.cache === 'ALL') {
      deleteCacheAll();
    } else if (data.cache === 'ALL_EXCEPTMP3') {
      deleteCacheAllExceptMp3();
    } else {
      deleteCache(data.cache, data.piste);
    }
  }
});
