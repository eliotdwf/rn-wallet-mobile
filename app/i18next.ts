import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from '../locales/en/translation.json';
import translationFr from '../locales/fr/translation.json';

const resources = {
    en: {
        translation: translationEn,
    },
    fr: {
        translation: translationFr,
    },
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: 'fr',
        fallbackLng: 'fr',
        supportedLngs: ['en', 'fr'],
        interpolation: {
            escapeValue: false,
        },
        cleanCode: true,
        ns: ['translation'],
        defaultNS: 'translation',
        compatibilityJSON: 'v4',
    })
    .then();

export default i18next;