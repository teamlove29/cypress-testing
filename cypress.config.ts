import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      apiUrl: 'http://127.0.0.1:5000/api/v1',
    },
    retries: {
      runMode: 3,
    },
    // viewportHeight: 1080,
    // viewportWidth: 1920,
    video: false,
    screenshotOnRunFailure: false,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
