// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // backend/ es el servidor (Node): no se lintea con las reglas de la app.
    ignores: ['dist/*', 'backend/**'],
  },
]);
