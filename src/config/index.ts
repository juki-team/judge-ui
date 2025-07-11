import { jukiApiSocketManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_SOCKET_BASE_URL, JUKI_TOKEN_NAME } from 'src/constants';

jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);

export { jukiApiSocketManager, jukiAppRoutes };
