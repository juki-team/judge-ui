import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const OnlineStatusContext = createContext(true);

export const OnlineStatusProvider = ({ children }: PropsWithChildren<{}>) => {
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);
  
  useEffect(() => {
    window?.addEventListener('offline', () => {
      setOnlineStatus(false);
    });
    window?.addEventListener('online', () => {
      setOnlineStatus(true);
    });
    
    return () => {
      window?.removeEventListener('offline', () => {
        setOnlineStatus(false);
      });
      window?.removeEventListener('online', () => {
        setOnlineStatus(true);
      });
    };
  }, []);
  
  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};