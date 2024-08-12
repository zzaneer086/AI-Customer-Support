import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome to HeadstarterAI",
        firstMessage:
          "Hi there! I'm the Headstarter virtual assistant. How can I help?",
        // Add more key-value pairs for translations
      },
    },
    es: {
      translation: {
        welcome: "Bienvenido a HeadstarterAI",
        firstMessage:
          "¡Hola! Soy el asistente virtual de Headstarter. ¿Cómo puedo ayudarte?",
        // Add more translations here
      },
    },
    // Add more languages here
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18next;
