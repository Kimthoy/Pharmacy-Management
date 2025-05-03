// src/context/LanguageContext.js
import React, { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [langCode, setLangCode] = useState(
    localStorage.getItem("selectedLanguage") || "en"
  );

  const changeLanguage = (newLang) => {
    if (["en", "km"].includes(newLang)) {
      setLangCode(newLang);
    }
  };

  useEffect(() => {
    localStorage.setItem("selectedLanguage", langCode);
  }, [langCode]);

  return (
    <LanguageContext.Provider value={{ langCode, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
