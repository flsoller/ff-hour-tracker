import { createTestingPinia } from "@pinia/testing";
import { config } from "@vue/test-utils";
import primeVue from "primevue/config";
import DialogService from "primevue/dialogservice";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./server";
import "whatwg-fetch";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock canvas and 2D context for ParticleBackground component
const mockContext = {
  clearRect: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
};

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => mockContext),
});

// Mock requestAnimationFrame to prevent infinite loop
let animationFrameId = 1;
global.requestAnimationFrame = vi.fn(() => {
  return animationFrameId++;
});
global.cancelAnimationFrame = vi.fn();

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
        req.url.href,
      );
    },
  });
});

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
