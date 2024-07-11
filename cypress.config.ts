import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    screenshotsFolder: process.env.DO_SCREENSHOTS_FOR_COMMIT
      ? 'cypress/screenshotsComponentAuto'
      : 'cypress/screenshotsComponentLocal',
  },
})
