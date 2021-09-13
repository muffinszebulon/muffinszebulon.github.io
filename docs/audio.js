document.addEventListener("DOMContentLoaded", () => {
  var audio = document.getElementById('audio');
  audio.addEventListener('ended', function(event) {
    tracksAudioNext();
  });

  var baseTitle = document.title;
  var url = document.location.href;
  var baseUrl = url.indexOf("?") >= 0 ? url.split("?")[0] : url;

  var canonicalElt = document.querySelector('link[rel=canonical]'); 
  var carousel = document.getElementById('carouselDark');
  var carouselBs = bootstrap.Carousel.getOrCreateInstance(carousel);

  let slideIndexParam = getParameter("slide");
  if (slideIndexParam) {
    carouselBs.to(slideIndexParam);
  }

  var self = this;
  carousel.addEventListener('slid.bs.carousel', function (event) {
    let slideIndex = event.to;
    let trackIndex = slideIndex - 2; 
    if (slideIndex === 1) {
      canonicalElt.href = baseUrl + "?slide=" + slideIndex;
      document.title = baseTitle + " - Crédits";
    } else if (trackIndex >=0 && trackIndex < self.tracks.length) {
      var track = self.tracks[trackIndex];
      canonicalElt.href = baseUrl + "?slide=" + slideIndex;
      document.title = baseTitle + " - " + track.title;
    } else {
      canonicalElt.href = baseUrl;
      document.title = baseTitle;
    }
  });
  
});

function tracksAudioSet(trackIndex) {
  var track = this.tracks[trackIndex];
  var audio = document.getElementById('audio');
  audio.src = "audio/"+track.file;
  audio.play();

  var audioAlt = document.getElementById('audio-alt');
  audioAlt.href = "audio/"+track.file;

  var audioTitle = document.getElementById('audio-title');
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
  var allParams = location.search;
  if (uri) {
    var pos = uri.indexOf("?");
    if (pos == -1) {
      return "";
    }
    allParams = uri.substring(pos);
  }
  if (!allParams) {
    return "";
  }
  allParams = "&" + allParams.substring(1);
  name = "&" + name + "=";
  var value = "";
  var posDeb = allParams.indexOf(name);
  if (posDeb > -1) {
    posDeb += name.length;
    var posFin = allParams.indexOf("&", posDeb);
    if (posFin == -1) {
      posFin = allParams.length;
    }
    value = allParams.substring(posDeb, posFin);
  }
  value = decodeURIComponent(value);
  return value;
}
