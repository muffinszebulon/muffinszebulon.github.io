document.addEventListener("DOMContentLoaded", function() {
  const url = document.location.href;
  if (url.indexOf("page=notfound") >= 0) {
    document.title = "Page non trouvée  | Muffin's Zebulon";
    document.getElementById('page-title').textContent = "Page non trouvée !";
    document.getElementById('page-subtitle').textContent = "Accédez ci-dessous à l'ensemble des pages du site.";
  }
});
