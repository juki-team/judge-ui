'use client';

import { Button, Modal, T } from 'components';
import { jukiApiManager } from 'config';
import { authorizedRequest, cleanRequest, consoleError, consoleInfo } from 'helpers';
import { useCallback, useEffect, useRouterStore, useState } from 'hooks';
import { ContentsResponseType } from 'types';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function InstallPWAModal() {
  const [ isOpen, setIsOpen ] = useState(true);
  const [ supportsInstall, setSupportsInstall ] = useState(false);
  const [ deferredPrompt, setDeferredPrompt ] = useState<BeforeInstallPromptEvent | null>(null);
  const [ isInstalled, setIsInstalled ] = useState(false);
  const isLoadingRoute = useRouterStore(store => store.isLoadingRoute);
  
  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setSupportsInstall(true);
    };
    
    const onAppInstalled = () => {
      setIsInstalled(true);
      setSupportsInstall(false);
      setDeferredPrompt(null);
    };
    
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [ isLoadingRoute ]);
  
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    const token = jukiApiManager.getToken();
    const { url, ...options } = jukiApiManager.API_V1.log.info({
      body: {
        location,
        token,
        infoName: 'Juki Judge App installed',
        infoMessage: JSON.stringify(result),
      },
    });
    const response = cleanRequest<ContentsResponseType<true>>(await authorizedRequest(url, options));
    if (response.success) {
      consoleInfo('Log reported');
    } else {
      consoleError('log reported failed', {
        infoName: 'Juki Judge App installed',
        infoMessage: result,
        location,
        token,
        response,
      });
    }
    setDeferredPrompt(null);
    setSupportsInstall(false);
  }, [ deferredPrompt ]);
  
  // iOS no tiene beforeinstallprompt; puedes mostrar guía si detectas iOS
  const isIOS = typeof window !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
  
  if (isInstalled) {
    return null;
  }
  
  if (!supportsInstall) {
    // Opcional: muestra fallback para iOS
    if (isIOS) {
      return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="jk-pg jk-col gap">
            <h3><T className="tt-se">install Juki Judge on your phone</T></h3>
            <p><T className="tt-se">please install Juki Judge on your phone for the best experience!</T></p>
            <Button
              onClick={() => alert('En iOS: comparte → “Añadir a pantalla de inicio”')}
            >
              <T className="tt-se">how to install on iOS</T>
            </Button>
            <Button type="text" onClick={() => setIsOpen(false)}>
              <T className="tt-se">{`I'm fine, I'll just view it on my mobile`}</T>
            </Button>
          </div>
        </Modal>
      );
    }
    return null;
  }
  
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="jk-pg jk-col gap">
        <h3><T className="tt-se">install Juki Judge on your phone</T></h3>
        <p><T className="tt-se">please install Juki Judge on your phone for the best experience!</T></p>
        <Button
          onClick={handleInstall}
          aria-label="install app"
        >
          <T className="tt-ce">install app</T>
        </Button>
        <Button type="text" onClick={() => setIsOpen(false)}>
          <T className="tt-se">{`I'm fine, I'll just view it on my mobile`}</T>
        </Button>
      </div>
    </Modal>
  );
}
