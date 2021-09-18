document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  audio.addEventListener('ended', (event) => {
    tracksAudioNext();
  });

  const baseTitle = document.title;
  const url = document.location.href;
  const baseUrl = url.indexOf('?') >= 0 ? url.split('?')[0] : url;

  const canonicalElt = document.querySelector('link[rel=canonical]');
  const carousel = document.getElementById('carouselDark');
  const carouselBs = bootstrap.Carousel.getOrCreateInstance(carousel);

  const slideIndexParam = getParameter('slide');
  if (slideIndexParam) {
    carouselBs.to(slideIndexParam);
  }

  const self = this;
  carousel.addEventListener('slid.bs.carousel', (event) => {
    const slideIndex = event.to;
    const trackIndex = slideIndex - 2;
    if (slideIndex === 1) {
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `${baseTitle} - Crédits`;
    } else if (trackIndex >= 0 && trackIndex < self.tracks.length) {
      const track = self.tracks[trackIndex];
      canonicalElt.href = `${baseUrl}?slide=${slideIndex}`;
      document.title = `${baseTitle} - ${track.title}`;
    } else {
      canonicalElt.href = baseUrl;
      document.title = baseTitle;
    }
  });
});

function tracksAudioSet(trackIndex) {
  const track = this.tracks[trackIndex];
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
  this.trackCurrentIndex = ++this.trackCurrentIndex % this.tracks.length;
  tracksAudioSet(this.trackCurrentIndex);
}

function tracksAudioPrev() {
  if (this.trackCurrentIndex === 0) {
    this.trackCurrentIndex = this.tracks.length - 1;
  } else {
    this.trackCurrentIndex--;
  }
  tracksAudioSet(this.trackCurrentIndex);
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
    if (pos == -1) {
      return '';
    }
    allParams = uri.substring(pos);
  }
  if (!allParams) {
    return '';
  }
  allParams = `&${allParams.substring(1)}`;
  name = `&${name}=`;
  let value = '';
  let posDeb = allParams.indexOf(name);
  if (posDeb > -1) {
    posDeb += name.length;
    let posFin = allParams.indexOf('&', posDeb);
    if (posFin == -1) {
      posFin = allParams.length;
    }
    value = allParams.substring(posDeb, posFin);
  }
  value = decodeURIComponent(value);
  return value;
}
