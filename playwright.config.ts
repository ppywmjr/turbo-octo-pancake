import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,

  use: {
    baseURL: 'http://localhost:3010',
    trace: 'on',
    screenshot: 'on',
  },

  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 5000,

    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },

    toMatchSnapshot: {
      // An acceptable ratio of pixels that are different to the
      // total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 0.1,
    },
  },

  webServer: {
    command: '',
    reuseExistingServer: true,
  },

  projects: [
    {name: 'DesktopChrome', use: {...devices['Desktop Chrome']}},
    {name: 'DesktopSafari', use: {...devices['Desktop Safari']}},
    {name: 'Pixel10Pro', use: {...devices['Pixel 10 Pro']}},
    {name: 'GalaxyS24', use: {...devices['Galaxy S24']}},
    {name: 'iPhoneAir', use: {...devices['iPhone Air']}},
  ],

});