import { expect, test } from "../../helpers/fixtures";

test.describe("Localization", () => {
  test.describe("Unauthenticated user", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("can switch language on login page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/.*login.*/);
      await expect(page.getByText("Sign in to Timecraft")).toBeVisible();

      await page.getByRole("button", { name: "Select language" }).click();
      await page.getByRole("menuitem", { name: "Deutsch" }).click();

      await page.waitForLoadState("domcontentloaded");

      await expect(page.getByText("In Timecraft einloggen")).toBeVisible();
    });
  });

  test.describe("Authenticated user", () => {
    test("can switch language on members page", async ({ page, nav }) => {
      await page.goto("/");
      await nav.viaSidebar("members");
      await expect(
        page.getByText("Manage your organization members"),
      ).toBeVisible();

      await page.getByRole("button", { name: "Select language" }).click();
      await page.getByRole("menuitem", { name: "Deutsch" }).click();

      await page.waitForLoadState("domcontentloaded");

      await expect(
        page.getByText("Verwalten Sie Ihre Organisationsmitglieder"),
      ).toBeVisible();
    });
  });
});
