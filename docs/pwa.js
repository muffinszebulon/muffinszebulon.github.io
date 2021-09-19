window.addEventListener('load', async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('service-worker.js');
      console.log('Service worker registration succeeded:', registration);
    } else {
      console.log('Service workers are not supported.');
    }
  } catch (error) {
    console.log(error);
  }
});

// Initialize deferredPrompt for use later to show browser install prompt.
var deferredPrompt;

function hideDivInstall() {
  const divInstall = document.getElementById('divInstall');
  divInstall.classList.toggle('d-none', true);
}

function showDivInstall() {
  const divInstall = document.getElementById('divInstall');
  divInstall.classList.toggle('d-none', false);

  const buttonInstall = document.getElementById('buttonInstall');
  buttonInstall.addEventListener('click', async () => {
    if (!this.deferredPrompt) {
      return;
    }
    // Hide the app provided install promotion
    hideDivInstall();
    // Show the install prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    this.deferredPrompt = null;
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  this.deferredPrompt = event;
  // Update UI notify the user they can install the PWA
  showDivInstall();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`, event);
});

window.addEventListener('appinstalled', (event) => {
  // Hide the app-provided install promotion
  hideDivInstall();
  // Clear the deferredPrompt so it can be garbage collected
  this.deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed', event);
});
