document.addEventListener("DOMContentLoaded", function() {
  const shareButton = document.getElementById('share-button');
  const canonicalElt = document.querySelector('link[rel=canonical]'); 
  if (navigator && navigator.share) {
    shareButton.title = "Partager";
  } else if (navigator && navigator.clipboard) {
    shareButton.title = "Copier l'URL";
  } else {
    shareButton.title = "Partager via Mail";
  }
  var shareTooltip = new bootstrap.Tooltip(shareButton);

  shareButton.addEventListener('click', event => {
    let title = document.title;
    let url = canonicalElt ? canonicalElt.href : document.location.href;
    if (navigator && navigator.share) {
      navigator.share({ title: title, url: url })
    } else if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(title + ":\n" + url);
      shareTooltip = setTooltipTitle(shareTooltip, shareButton, title);
    } else {
      var body = title + ":\n" + url;
      window.open("mailto:?subject="+ encodeURIComponent(title) + "&body=" + encodeURIComponent(body));
    }
  });
});

function setTooltipTitle(tooltip, button, title) {
  if (!tooltip || !button || !title) {
    return;
  }
  button.title = "URL copiée";
  tooltip.dispose();
  tooltip = new bootstrap.Tooltip(button);
  tooltip.show();
  return tooltip;
}
