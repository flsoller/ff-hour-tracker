import { expect, Page } from "@playwright/test";

export class Navigation {
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
