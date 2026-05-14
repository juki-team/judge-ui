import { useT } from '@juki-team/base-ui';

export {
  useJukiUser,
  useFetcher,
  usePrevious,
  useDataViewerRequester,
  useTrackLastPath,
  useEntityDiff,
  useJukiNotification,
  useCheckAndStartServices,
  useMatchMutate,
  usePreload,
  usePreloadComponents,
  useRouterStore,
  useUserStore,
  useLazyLoadingStore,
  useSyncedState,
  useWebsocketStore,
  useUIStore,
  usePageStore,
  useSubscribe,
  useInjectTheme,
  useJukiUserSettings,
  useClickOutside,
  useT,
} from '@juki-team/base-ui';

export const useI18nStore = <T,>(selector: (state: { i18n: { t: (key: string) => string } }) => T): T => {
  const t = useT();
  return selector({ i18n: { t } });
};

export {
  useClickOutside as useOutsideAlerter,
  useSyncedState as useStableState,
  useMatchMutate as useMutate,
} from '@juki-team/base-ui';

export { useResizeDetector } from 'react-resize-detector';
export { useEffect, useRef, useState, useMemo, useCallback } from 'react';
