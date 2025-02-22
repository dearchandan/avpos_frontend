import { createI18n } from "vue-i18n";
import en from '../lang/en.json';
import ar from '../lang/ar.json';

const messages = {
  en: en,
  ar: ar
}
export default createI18n({
  locale: (localStorage.getItem('language'))?localStorage.getItem('language'):import.meta.env.VITE_DEFAULT_LOCALE, // <--- 1
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE, // <--- 2
  legacy: false, // <--- 3
  messages
})