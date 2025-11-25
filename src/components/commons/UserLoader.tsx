'use client';

import { T } from 'components';
import { useUserStore } from 'hooks';
import { AnimatePresence, motion } from 'motion/react';
import { CSSProperties, useEffect, useState } from 'react';

export const UserLoader = () => {
  const user = useUserStore(state => state.user);
  const [ showLoader, setShowLoader ] = useState(true);
  useEffect(() => {
    if (user.sessionId) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 200);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ user.sessionId ]);
  
  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          key="loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.9, y: '-100vh' }}
          transition={{ ease: 'easeOut' }}
          className="expand-absolute pe-ne jk-col bc-pd"
          style={{ zIndex: 999 }}
        >
          <h1
            className="jk-row cr-pt"
            style={{ alignItems: 'baseline' }}
          >
            {!user.sessionId ? (
              <>
                <T className="tt-se">loading user</T>&nbsp;
                <div
                  className="dot-flashing"
                  style={{
                    '--dot-flashing-color': 'var(--t-color-primary-text)',
                    '--dot-flashing-color-light': 'var(--t-color-primary-light)',
                    '--dot-flashing-size': '10px',
                  } as CSSProperties}
                />
              </>
            ) : (
              <div className="jk-col">
                <T className="tt-se">welcome</T>
                {user.nickname && <div>{user.nickname}</div>}
              </div>
            )}
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
