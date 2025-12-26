import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { expect, test as base } from "@playwright/test";
import { Config } from "./fixtures/config";
import { Navigation } from "./fixtures/navigation";

export const test = base.extend<{
  forEachTest: void;
  nav: Navigation;
  config: Config;
}>({
  forEachTest: [async ({ page, baseURL }, use) => {
    await setupClerkTestingToken({
      page,
      options: { frontendApiUrl: baseURL?.split("//")[1] },
    });
    await use();
  }, { auto: true }],
  // Navigation fixture - always available
  nav: async ({ page }, use) => {
    await use(new Navigation(page));
  },
  config: async ({ page, nav }, use) => {
    await use(new Config(page, nav));
  },
});

export { expect };
