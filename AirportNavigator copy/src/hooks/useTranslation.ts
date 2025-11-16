import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  return {
    t: translations[language],
    language,
  };
}
