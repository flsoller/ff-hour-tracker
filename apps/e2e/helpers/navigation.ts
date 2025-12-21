import { expect, Page } from "@playwright/test";

const sidebarLinks = {
  dashboard: { testId: "dashboardLink", url: "/" },
  members: { testId: "membersLink", url: "/members" },
  timelog: { testId: "timesheetLink", url: "/timelog" },
  config: { testId: "configLink", url: "/config" },
  reports: { testId: "reportsLink", url: "/reports" },
} as const;

export type RouteName = keyof typeof sidebarLinks;

/**
 * Navigate via sidebar link click (tests sidebar integration)
 */
export async function navigateViaSidebar(page: Page, route: RouteName) {
  const { testId, url } = sidebarLinks[route];
  await page.getByTestId(testId).click();
  await expect(page).toHaveURL(url);
}

/**
 * Navigate directly via URL (faster, use when sidebar isn't the focus)
 */
export async function navigateTo(page: Page, route: RouteName) {
  const { url } = sidebarLinks[route];
  await page.goto(url);
  await expect(page).toHaveURL(url);
}
