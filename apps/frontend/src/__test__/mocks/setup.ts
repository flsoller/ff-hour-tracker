import { afterAll, afterEach, beforeAll } from "vitest";
import { config } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import primeVue from "primevue/config";
import DialogService from "primevue/dialogservice";
import { server } from "./server";
import "whatwg-fetch";

// Test setups
beforeAll(() => {
  config.global.plugins = [
    primeVue,
    DialogService,
    createTestingPinia({ stubActions: false }),
  ];
  server.listen({
    onUnhandledRequest(req) {
      // eslint-disable-next-line no-console
      console.error(
        "Found an unhandled %s request to %s",
        req.method,
        req.url.href
      );
    },
  });
});

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
