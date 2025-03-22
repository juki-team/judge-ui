import {
  jukiApiSocketManager as _jukiApiSocketManager,
  jukiAppRoutes as _jukiAppRoutes,
} from '@juki-team/base-ui/settings';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_SOCKET_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';

export const jukiAppRoutes = _jukiAppRoutes;
export const jukiApiSocketManager = _jukiApiSocketManager;

jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
