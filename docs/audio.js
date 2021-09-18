var trackCurrentIndex = 0;

function tracksAudioSet(trackIndex) {
  const track = document.tracks[trackIndex];
  const audio = document.getElementById('audio');
  audio.src = `audio/${track.file}`;
  audio.play();

  const audioAlt = document.getElementById('audio-alt');
  audioAlt.href = `audio/${track.file}`;

  const audioTitle = document.getElementById('audio-title');
  audioTitle.textContent = track.title;

  this.trackCurrentIndex = trackIndex;
}

function tracksAudioNext() {
  this.trackCurrentIndex = ++this.trackCurrentIndex % document.tracks.length;
  tracksAudioSet(this.trackCurrentIndex);
}

function tracksAudioPrev() {
  if (this.trackCurrentIndex === 0) {
    this.trackCurrentIndex = document.tracks.length - 1;
  } else {
    this.trackCurrentIndex--;
  }
  tracksAudioSet(this.trackCurrentIndex);
}

function tracksSlideTo(slideIndex) {
  const carousel = document.getElementById('carouselDark');
  const carouselBs = bootstrap.Carousel.getOrCreateInstance(carousel);
  if (slideIndex) {
    carouselBs.to(slideIndex);
  }
}

function tracksSlideToCurrent() {
  tracksSlideTo(this.trackCurrentIndex + 2);
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

  const baseTitle = document.title;
  const url = document.location.href;
  const baseUrl = url.indexOf('?') >= 0 ? url.split('?')[0] : url;
  const canonicalElt = document.querySelector('link[rel=canonical]');

  const carousel = document.getElementById('carouselDark');
  carousel.addEventListener('slid.bs.carousel', (event) => {
    const slideIndex = event.to;
    const trackIndex = slideIndex - 2;
    if (slideIndex === 1) {
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `${baseTitle} - Crédits`;
    } else if (trackIndex >= 0 && trackIndex < document.tracks.length) {
      const track = document.tracks[trackIndex];
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `${baseTitle} - ${track.title}`;
    } else {
      canonicalElt.href = baseUrl;
      document.title = baseTitle;
    }
  });
});
