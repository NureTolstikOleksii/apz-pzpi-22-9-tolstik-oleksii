import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // ⬅️ Додано

import en from './locales/en.json';
import uk from './locales/uk.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            uk: { translation: uk },
        },
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false,
        },
        detection: {
            // порядок визначення мови
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;
