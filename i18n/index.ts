import { Language } from '@juki-team/commons'; // required
import type { i18n } from 'i18next';
import i18next from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
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
          resourcesToBackend(localResources),
        ],
        backendOptions: [
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
