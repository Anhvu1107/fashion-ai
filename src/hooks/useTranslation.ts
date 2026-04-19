import { useAppStore } from '../store/useAppStore';
import en from '../locales/en';
import vi from '../locales/vi';

const translations = { en, vi };

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const t = (key: keyof typeof en) => {
    return translations[language][key] || key;
  };
  return { t, language };
}
