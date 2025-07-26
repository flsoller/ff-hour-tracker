import { createTestingPinia } from "@pinia/testing";
import { config } from "@vue/test-utils";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./server";
import "whatwg-fetch";

// Mock requestAnimationFrame to prevent infinite loop
let animationFrameId = 1;
global.requestAnimationFrame = vi.fn(() => {
  return animationFrameId++;
});
global.cancelAnimationFrame = vi.fn();

// Test setups
beforeAll(() => {
  config.global.plugins = [
    createTestingPinia({ stubActions: false }),
  ];
  server.listen({
    onUnhandledRequest(req) {
      // eslint-disable-next-line no-console
      console.error(
        "Found an unhandled %s request to %s",
        req.method,
        req.url,
      );
    },
  });
});

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
