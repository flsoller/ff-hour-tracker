import { afterAll, afterEach, beforeAll } from 'vitest';
import { config } from '@vue/test-utils';
import primeVue from 'primevue/config';
import { server } from './server';
import 'whatwg-fetch';

// Test setups
beforeAll(() => {
  config.global.plugins = [primeVue];
  server.listen();
});

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
