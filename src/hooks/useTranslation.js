// src/hooks/useTranslation.js
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../locales/translations-en.json";
import km from "../locales/translations-km.json";

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  // Log for debugging
  console.log("Language Context Value:", context);

  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  const { langCode, changeLanguage } = context;

  const translations = {
    en,
    km,
  };

  const t = (key) => {
    const keys = key.split(".");
    let result = translations[langCode];

    for (let k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }

    return result;
  };

  return { t, langCode, changeLanguage };
};
