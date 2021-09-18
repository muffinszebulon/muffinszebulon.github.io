function getNewTooltipWithTitle(tooltip, button, title) {
  if (!tooltip || !button || !title) {
    return null;
  }
  button.title = 'URL copiée';
  tooltip.dispose();
  const newTooltip = new bootstrap.Tooltip(button);
  newTooltip.show();
  return newTooltip;
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('share-button');
  const canonicalElt = document.querySelector('link[rel=canonical]');
  if (navigator && navigator.share) {
    shareButton.title = 'Partager';
  } else if (navigator && navigator.clipboard) {
    shareButton.title = "Copier l'URL";
  } else {
    shareButton.title = 'Partager via Mail';
  }
  let shareTooltip = new bootstrap.Tooltip(shareButton);

  shareButton.addEventListener('click', () => {
    const title = document.title;
    const url = canonicalElt ? canonicalElt.href : document.location.href;
    if (navigator && navigator.share) {
      navigator.share({ title: title, url: url });
    } else if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(`${title}:\n${url}`);
      shareTooltip = getNewTooltipWithTitle(shareTooltip, shareButton, title);
    } else {
      const body = `${title}:\n${url}`;
      window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`);
    }
  });
});
