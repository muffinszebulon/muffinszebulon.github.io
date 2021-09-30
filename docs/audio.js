var trackCurrentIndex = 0;
var audioCurrentExt = '.mp3';
var audioCurrentBaseUrl = 'audio/';
var baseTitle;

// -------------------------------------------------------------
// Utils

/**
 * Return request parameter value.
 * @param {String} name the parameter name
 * @param {String} [uri] the URI to extract the parameter from.<br>
 *          If not given, <code>location.search</code> is used.
 * @returns {String} parameter value
 */
function getParameter(name, uri) {
  let allParams = location.search;
  if (uri) {
    const pos = uri.indexOf('?');
    if (pos === -1) {
      return '';
    }
    allParams = uri.substring(pos);
  }
  if (!allParams) {
    return '';
  }
  allParams = `&${allParams.substring(1)}`;
  const nameParam = `&${name}=`;
  let value = '';
  let posDeb = allParams.indexOf(nameParam);
  if (posDeb > -1) {
    posDeb += nameParam.length;
    let posFin = allParams.indexOf('&', posDeb);
    if (posFin === -1) {
      posFin = allParams.length;
    }
    value = allParams.substring(posDeb, posFin);
  }
  value = decodeURIComponent(value);
  return value;
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

// -------------------------------------------------------------
// Actions

async function tracksAudioSet(trackIndex, noplay) {
  const audio = document.getElementById('audio');
  const audioAlt = document.getElementById('audio-alt');
  const audioTitle = document.getElementById('audio-title');
  const audioError = document.getElementById('audio-error');
  try {
    audioError.classList.toggle('d-none', true);

    const track = document.tracks[trackIndex];
    const audioSrc = `${audioCurrentBaseUrl}${track.file}${audioCurrentExt}`;
    audio.src = audioSrc;
    audioAlt.href = audioSrc;
    audioTitle.textContent = track.title;

    trackCurrentIndex = trackIndex;

    if (!noplay) {
      await audio.play();
    }
    document.title = `${track.title} - ${baseTitle}`;
  } catch (error) {
    audioError.innerHTML = 'mp3 téléchargeables en ligne sur la page<a href="app.html" class="badge border ms-1 p-2">App <span class="fas fa-info-circle"></span></a>';
    audioError.classList.toggle('d-none', false);
    console.error(audio.src, error);
  }
}

/* exported toggleAudioExt */
function toggleAudioExt() {
  setAudioExt(audioCurrentExt === '.mp3' ? '.flac' : '.mp3');
}
function setAudioExt(audioExt) {
  audioCurrentExt = audioExt;
  let isHifi = audioCurrentExt === '.flac';

  audioCurrentBaseUrl = isHifi ? 'https://www.rochemorel.com/muffinszebulon/' : 'audio/';

  let toggleAudioExtSwitch = document.getElementById('toggleAudioExt');
  let hifiBadge = document.getElementById('hifi');

  toggleAudioExtSwitch.toggleAttribute('checked', isHifi);
  isHifi ? show(hifiBadge) : hide(hifiBadge);

  tracksAudioSet(trackCurrentIndex, true);
}

/* exported tracksAudioNext */
function tracksAudioNext() {
  trackCurrentIndex = ++trackCurrentIndex % document.tracks.length;
  tracksAudioSet(trackCurrentIndex);
}

/* exported tracksAudioPrev */
function tracksAudioPrev() {
  if (trackCurrentIndex === 0) {
    trackCurrentIndex = document.tracks.length - 1;
  } else {
    trackCurrentIndex--;
  }
  tracksAudioSet(trackCurrentIndex);
}

function tracksSlideTo(slideIndex) {
  const carousel = document.getElementById('carouselDark');
  const carouselBs = bootstrap.Carousel.getOrCreateInstance(carousel);
  if (slideIndex) {
    carouselBs.to(slideIndex);
  }
}

/* exported tracksSlideToCurrent */
function tracksSlideToCurrent() {
  tracksSlideTo(trackCurrentIndex + 2);
}

// --------------------------------------------------
// Listeners

document.addEventListener('DOMContentLoaded', () => {
  baseTitle = document.querySelector('meta[property="og:title"]').content;

  const audio = document.getElementById('audio');
  audio.addEventListener('ended', () => {
    tracksAudioNext();
  });
  this.setAudioExt(audioCurrentExt);

  const url = document.location.href;
  const baseUrl = url.indexOf('?') >= 0 ? url.split('?')[0] : url;
  const canonicalElt = document.querySelector('link[rel=canonical]');

  let pSlideIndex = getParameter('slide');
  this.tracksSlideTo(pSlideIndex);
  let pTrackIndex = pSlideIndex > 1 ? pSlideIndex - 2 : 0;
  this.tracksAudioSet(pTrackIndex, true);

  const carousel = document.getElementById('carouselDark');
  carousel.addEventListener('slid.bs.carousel', (event) => {
    const slideIndex = event.to;
    const trackIndex = slideIndex - 2;
    if (slideIndex === 1) {
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `Crédits - ${baseTitle}`;
    } else if (trackIndex >= 0 && trackIndex < document.tracks.length) {
      const track = document.tracks[trackIndex];
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `${track.title} - ${baseTitle}`;
    } else {
      canonicalElt.href = baseUrl;
      document.title = baseTitle;
    }
  });
});
