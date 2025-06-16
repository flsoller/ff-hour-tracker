import { expect, test } from "@playwright/test";
import { userLogin } from "../../helpers/userActions";

test.describe.skip("App navigation", () => {
  test.describe("path matching", () => {
    test("should route to login for unauthenticated user on non matched routes", async ({ page }) => {
      await page.goto("/somethingelse");
      await expect(page.getByTestId("sidebar")).not.toBeVisible();
      await expect(page).toHaveURL(/login/);
    });
  });

  test.describe("sidebar navigation", () => {
    test.beforeEach(async ({ page }) => {
      await userLogin(page);
    });

    test("should navigate to the correct paths via sidebar", async ({ page }) => {
      await expect(page.getByTestId("dashboardLink")).toBeVisible();
      page.getByTestId("dashboardLink").click();
      await expect(page).toHaveURL("/");

      await expect(page.getByTestId("timesheetLink")).toBeVisible();
      page.getByTestId("timesheetLink").click();
      await expect(page).toHaveURL("/timelog");

      await expect(page.getByTestId("configLink")).toBeVisible();
      page.getByTestId("configLink").click();
      await expect(page).toHaveURL("/config");

      await expect(page.getByTestId("membersLink")).toBeVisible();
      page.getByTestId("membersLink").click();
      await expect(page).toHaveURL("/members");

      await expect(page.getByTestId("reportsLink")).toBeVisible();
      page.getByTestId("reportsLink").click();
      await expect(page).toHaveURL("/reports");
    });
  });
});
