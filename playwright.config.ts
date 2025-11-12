import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // Maximum time one test can run for
  timeout: 90 * 1000,

  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 20000
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  // Limit workers to prevent memory issues on webkit
  workers: process.env.CI ? 1 : 2,

  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // Disable video for webkit due to path encoding issues with Japanese characters
        video: 'off',
        // Disable screenshots to reduce memory usage
        screenshot: 'off',
        // Increase timeouts for webkit
        actionTimeout: 30000,
        navigationTimeout: 30000,
      },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Increase timeout for mobile browsers
        actionTimeout: 30000,
        navigationTimeout: 30000,
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        // Disable video for webkit due to path encoding issues with Japanese characters
        video: 'off',
        // Disable screenshots to reduce memory usage
        screenshot: 'off',
        // Increase timeout for mobile browsers
        actionTimeout: 30000,
        navigationTimeout: 30000,
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
