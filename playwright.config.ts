import {defineConfig} from '@playwright/test';
import config from './src/env.js'

export default defineConfig({
    testDir: './test/e2e',
    timeout: 30_000,
    fullyParallel: true,
    workers: undefined,
    retries: 0,
    reporter: [['html', { open: 'never'}], ['list']],

    use: {
        baseURL: `http://localhost:${config.PORT}`,
        extraHTTPHeaders: {
            'Content-Type' : 'application/json',
        },
        trace: 'retain-on-failure',
    },

    // webServer: {
    //     command: 'npm run start:test',
    //     url: `http://localhost:${config.PORT}/health`,
    //     timeout: 20_000,
    //     env: {
    //         NODE_ENV: 'test'
    //     },
    // },

    globalSetup: './test/e2e/global-setup.ts',
    globalTeardown: './test/e2e/global-teardown.ts'
})