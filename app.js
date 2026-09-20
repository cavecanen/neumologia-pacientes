const installButton = document.querySelector('#installButton');
const installDialog = document.querySelector('#installDialog');
const connectionStatus = document.querySelector('#connectionStatus');
let deferredInstallPrompt = null;

const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
if (standalone) installButton.hidden = true;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  installDialog.showModal();
});

window.addEventListener('appinstalled', () => { installButton.hidden = true; });

function updateConnectionStatus() {
  connectionStatus.hidden = navigator.onLine;
}
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
