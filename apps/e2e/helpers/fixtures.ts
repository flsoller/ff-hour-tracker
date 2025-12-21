import { setupClerkTestingToken } from "@clerk/testing/playwright";
import { expect, Page, test as base } from "@playwright/test";

// Navigation helper class
class Navigation {
  constructor(private page: Page) {}

  private routes = {
    dashboard: { testId: "dashboardLink", url: "/" },
    members: { testId: "membersLink", url: "/members" },
    timelog: { testId: "timesheetLink", url: "/timelog" },
    config: { testId: "configLink", url: "/config" },
    reports: { testId: "reportsLink", url: "/reports" },
  } as const;

  /** Navigate by clicking sidebar link */
  async viaSidebar(route: keyof typeof this.routes) {
    const { testId, url } = this.routes[route];
    await this.page.getByTestId(testId).click();
    await expect(this.page).toHaveURL(url);
  }

  /** Navigate directly via URL */
  async to(route: keyof typeof this.routes) {
    const { url } = this.routes[route];
    await this.page.goto(url);
  }
}

export const test = base.extend<{
  forEachTest: void;
  nav: Navigation;
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
});

export { expect };
