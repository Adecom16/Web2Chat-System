// i18nextConfig.js
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-express-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr'], // Preload all supported languages
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json')
    }
  });

module.exports = i18next;
