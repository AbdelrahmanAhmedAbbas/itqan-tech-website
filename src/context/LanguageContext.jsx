import React, { useState, useEffect, useMemo, useCallback } from "react";
import enTranslations from "../i18n/en.json";
import arTranslations from "../i18n/ar.json";
import { LanguageContext } from "./language-context";

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const translations = useMemo(() => lang === "ar" ? arTranslations : enTranslations, [lang]);
  const isRTL = lang === "ar";

  useEffect(() => {
    localStorage.setItem("lang", lang);
    const html = document.documentElement;
    html.dir = isRTL ? "rtl" : "ltr";
    html.lang = lang;
  }, [lang, isRTL]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback((keypath) => {
    return keypath
      .split(".")
      .reduce((obj, key) => (obj && typeof obj === "object" ? obj[key] : undefined), translations);
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, isRTL, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
