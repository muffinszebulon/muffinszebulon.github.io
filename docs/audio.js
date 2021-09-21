var trackCurrentIndex = 0;
var baseTitle = document.title;

async function tracksAudioSet(trackIndex) {
  const audio = document.getElementById('audio');
  const audioAlt = document.getElementById('audio-alt');
  const audioTitle = document.getElementById('audio-title');
  const audioError = document.getElementById('audio-error');
  try {
    audioError.classList.toggle('d-none', true);

    const track = document.tracks[trackIndex];
    audio.src = `audio/${track.file}`;
    audioAlt.href = `audio/${track.file}`;
    audioTitle.textContent = track.title;

    trackCurrentIndex = trackIndex;

    await audio.play();
    document.title = `${track.title} - ${baseTitle}`;
  } catch (error) {
    audioError.innerHTML =
      'MP3 non disponible,<br>téléchargeable en ligne sur la page<a href="app.html" class="badge border ms-1 p-2">App <span class="fas fa-info-circle"></span></a>';
    audioError.classList.toggle('d-none', false);
    console.error(audio.src, error);
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  audio.addEventListener('ended', () => {
    tracksAudioNext();
  });

  this.tracksSlideTo(getParameter('slide'));

  baseTitle = document.title;
  const url = document.location.href;
  const baseUrl = url.indexOf('?') >= 0 ? url.split('?')[0] : url;
  const canonicalElt = document.querySelector('link[rel=canonical]');

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
