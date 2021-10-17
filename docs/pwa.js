/**
 * ServiceWorker.<br>
 * sources :<br>
 * https://web.dev/offline-fallback-page/<br>
 * https://gist.github.com/adactio/fbaa3a5952774553f5e7<br>
 * https://googlechrome.github.io/samples/service-worker/basic/<br>
 * https://felixgerschau.com/how-to-communicate-with-service-workers/<br>
 * https://www.netguru.com/blog/pwa-ios<br>
 * check :<br>
 * chrome://serviceworker-internals<br>
 * about:debugging#/runtime/this-firefox<br>
 */
var messageChannel;
var deferredPrompt;

const TRACK_ROW = `
  <div class="row">
<div class="col-3 col-md-2 col-lg-1 pt-2">
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="toggleCache%ALBUM%_%TRACK_INDEX%" onchange="toggleCache(event, '%ALBUM%', %TRACK_INDEX%)">
    <label class="form-check-label track" for="toggleCache%ALBUM%_%TRACK_INDEX%"><span class="badge border">%TRACK_INDEX%</span></label>
  </div>
</div>
<div class="col-8 col-md-9 col-lg-10 pt-2">
  <div class="progress"><div id="toggleCacheProgress%ALBUM%_%TRACK_INDEX%" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div></div>
</div>
</div>
`;

// -------------------------------------------------------------
// Utils

/** Detects if device is on iOS. */
function isIos() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|macintosh/.test(userAgent);
}
function show(element, innerHTML) {
  if (!element) {
    return;
  }
  if (innerHTML !== undefined) {
    element.innerHTML = innerHTML;
  }
  element.classList.toggle('d-none', false);
}
function hide(element) {
  element && element.classList.toggle('d-none', true);
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function getPWADisplayMode() {
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  }
  if ('standalone' in navigator && navigator.standalone) {
    return 'standalone';
  }
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
function isInAppMode() {
  return getPWADisplayMode() != 'browser';
}
function setPwaMessage(message) {
  const isAppInstalled = message === 'Application installée';
  const isAppCanBeInstalled = message === '';
  const divMessage = document.getElementById('pwa-message');
  const buttonInstall = document.getElementById('buttonInstall');
  if (!divMessage || !buttonInstall) {
    return;
  }
  if (isAppInstalled) {
    hide(buttonInstall);
    show(divMessage, message);
  } else if (isAppCanBeInstalled) {
    if (isIos()) {
      hide(buttonInstall);
      show(
        divMessage,
        `Pour installer l'application, cliquer sur <img src="apple-share.jpg" width="16" height="16" alt=""> puis tout en bas,` +
          `sur l'action ajouter <span class="text-nowrap">« Sur l'écran d'accueil <span class="far fa-plus-square"></span> »</span>`
      );
    } else {
      show(buttonInstall);
      buttonInstall.toggleAttribute('disabled', false);
      show(divMessage, '');
    }
  } else {
    hide(buttonInstall);
    hide(divMessage);
  }
}
function setProgress(progressId, toggleId, percent, isProgress) {
  const progress = document.getElementById(progressId);
  if (progress) {
    progress.classList.toggle('progress-bar-striped', isProgress);
    progress.classList.toggle('progress-bar-animated', isProgress);
    progress.setAttribute('aria-valuenow', percent);
    progress.setAttribute('style', `width: ${percent}%`);
  }
  if (!isProgress) {
    const toggleCacheCheck = document.getElementById(toggleId);
    toggleCacheCheck && toggleCacheCheck.toggleAttribute('checked', percent === '100');
  }
}

// -------------------------------------------------------------
// Actions

/* exported toggleCache */
async function toggleCache(event, aN, piste) {
  var cache = event.target.checked;
  try {
    navigator.serviceWorker.controller.postMessage({ type: cache ? 'CACHE' : 'UNCACHE', cache: aN, piste: piste });
  } catch (error) {
    console.error(error);
  }
}
function cacheState(data, isProgress) {
  const percent = ((100 * data.cachedCount) / data.max).toFixed(0);
  setProgress('toggleCacheProgress' + data.cache, 'toggleCache' + data.cache, percent, isProgress);
  let i = 0;
  for (const mp3 of data.mp3s) {
    i++;
    setProgress('toggleCacheProgress' + data.cache + '_' + i, 'toggleCache' + data.cache + '_' + i, mp3 ? '100' : '0', false);
  }
  displayStorage();
}
/* exported reset */
async function reset(includeMp3) {
  try {
    if ('serviceWorker' in navigator) {
      var controller = navigator.serviceWorker.controller;
      if (controller) {
        controller.postMessage({ type: 'UNCACHE', cache: includeMp3 ? 'ALL' : 'ALL_EXCEPTMP3' });
      }
      var registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations) {
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
    } else {
      console.debug('Service workers are not supported.');
    }
  } catch (error) {
    console.error(error);
  }
  window.location.href = 'index.html';
}

// --------------------------------------------------
// Listeners

window.addEventListener('load', async () => {
  const isAppPage = document.getElementById('toggleCacheProgressA3');
  let pwaMessage = 'Application non instalable avec ce navigateur.';
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('service-worker.js');
      console.debug('Service worker registration succeeded:', registration);
      if (isInAppMode()) {
        pwaMessage = 'Application installée';
      } else if (isIos()) {
        pwaMessage = ''; // pas de beforeinstallprompt mais installable
      } else {
        pwaMessage = 'En attente du prompt'; // on saura si l'app est instalable si beforeinstallprompt est déclenché
      }
    } else {
      console.debug('Service workers are not supported.');
    }
  } catch (error) {
    console.warn(error);
  }
  if (isAppPage) {
    initMessageChannel();
    setPwaMessage(pwaMessage);
    displayTrackRows();
    displayStorage();
  }
});
async function initMessageChannel() {
  try {
    if (!navigator || !navigator.serviceWorker || !navigator.serviceWorker.controller) {
      console.debug('navigator.serviceWorker.controller undefined');
      return;
    }
    document.querySelectorAll('.toggleCache').forEach((element) => show(element));

    messageChannel = new MessageChannel();
    navigator.serviceWorker.controller.postMessage({ type: 'INIT_PORT' }, [messageChannel.port2]);
    navigator.serviceWorker.controller.postMessage({ type: 'VERSION' });
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATE', cache: 'A3' });
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATE', cache: 'A2' });
    messageChannel.port1.onmessage = (event) => {
      var data = event.data;
      if (!data) {
        return;
      }
      console.log(`APP receive ${data.type}`, event);
      if (data.type === 'VERSION') {
        document.getElementById('version').textContent = data.version;
      } else if (data.type === 'CACHE_STATE') {
        cacheState(data, false);
      } else if (data.type === 'CACHE_PROGRESS') {
        cacheState(data, true);
      }
    };
  } catch (error) {
    console.error(error);
  }
}
async function displayStorage() {
  try {
    if (!navigator || !navigator.storage) {
      return;
    }
    const estimate = await navigator.storage.estimate();
    const usage = formatBytes(estimate.usage, 0);
    const quota = formatBytes(estimate.quota, 0);
    const percent = ((100 * estimate.usage) / estimate.quota).toFixed(0);
    document.getElementById('storage').textContent = `${usage} utilisés sur ${quota} (${percent}%)`;
    document.querySelectorAll('.storage').forEach((element) => show(element));
  } catch (error) {
    console.error(error);
  }
}
async function displayTrackRows() {
  try {
    let trackRowHtml = '';
    const albums = ['A3', 'A2', 'A1'];
    for (const album of albums) {
      const len = album === 'A2' ? 12 : 11;
      trackRowHtml = '';
      for (var i = 0; i < len; i++) {
        trackRowHtml += TRACK_ROW.replaceAll('%TRACK_INDEX%', i + 1).replaceAll('%ALBUM%', album);
      }
      document.getElementById(`cache${album}Detail`).innerHTML = trackRowHtml;
    }
  } catch (error) {
    console.error(error);
  }
}
/**
 * Interception du prompt d'install.<br>
 * Non déclenché sur iPhone => installation manuelle : bouton partager en bas > Sur l'écran d'accueil [+]
 */
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  deferredPrompt = event; // Stash the event so it can be triggered later.
  console.debug(`'beforeinstallprompt' event was fired.`, event);
  setPwaMessage('');
});
/* exported install */
async function install(event) {
  event.preventDefault();
  if (!deferredPrompt) {
    return;
  }
  deferredPrompt.prompt(); // Show the install prompt
  const { outcome } = await deferredPrompt.userChoice; // Wait for the user to respond to the prompt
  console.debug(`User response to the install prompt: ${outcome}`);
  deferredPrompt = null;
}
window.addEventListener('appinstalled', (event) => {
  deferredPrompt = null; // Clear the deferredPrompt so it can be garbage collected
  console.debug('PWA was installed', event);
  setPwaMessage('Application installée');
});
