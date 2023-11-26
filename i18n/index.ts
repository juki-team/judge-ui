import { Language } from '@juki-team/commons';
import type { i18n } from 'i18next';
import i18next from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import Backend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';

// the translations
// (tip move them in a JSON file and import them)
const localResources = {
  [Language.ES]: { translation: {} },
  [Language.EN]: { translation: {} },
};

let i18nInstance: i18n | undefined = undefined;

const initI18next = (cb: (error: Error) => void) => {
  i18nInstance = i18next.createInstance()
  i18nInstance
    .use(ChainedBackend)
    .init({
      // debug: true,
      lng: Language.EN,
      fallbackLng: Language.EN,
      preload: [ Language.EN, Language.ES ],
      ns: [ 'translation' ],
      defaultNS: 'translation',
      keySeparator: false, // we do not use keys in form messages.welcome
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      backend: {
        backends: [
          Backend, // if a namespace can't be loaded via normal http-backend loadPath, then the inMemoryLocalBackend will try to return the correct resources
          resourcesToBackend(localResources),
        ],
        backendOptions: [
          { loadPath: `${process.env.NEXT_PUBLIC_JUKI_SERVICE_BASE_URL}/api/v1/locale/{{lng}}/{{ns}}` },
        ],
      },
    }, cb)
}

initI18next((err: Error) => {
  if (err) {
    return console.error('error on initI18next', err);
  }
})

export default i18nInstance;
