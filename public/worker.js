self.__WB_DISABLE_DEV_LOGS = true;

if (self.controller) {
  self.controller.postMessage(UPDATE_CHECK);
  self.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

self.ready.then(async (registration) => {
  if ('periodicSync' in registration) {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync'
    });
    
    if (status.state === 'granted') {
      await registration.periodicSync.register(UPDATE_CHECK, {
        minInterval: 24 * 60 * 60 * 1000
      });
    }
  }
  
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'hidden') {
        self.controller?.postMessage(UPDATE_CHECK);
        registration.update();
      }
    });
  }
});
