const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es', 'fr', 'de', 'zh'], // Add the locales you want to support
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: true,
  syncFiles: true,
  objectNotation: true,
});

module.exports = i18n;
