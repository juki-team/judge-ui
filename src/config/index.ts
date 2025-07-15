import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME } from 'src/constants';

jukiApiManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);

export { jukiApiManager, jukiAppRoutes };
