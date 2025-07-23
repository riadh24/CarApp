import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const isLanguage = (lng) => {
    return i18n.language === lng;
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    isLanguage,
    currentLanguage: i18n.language,
  };
};

export default useTranslation;
