import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should route to login from base URL when not authed with expected UI", async ({ page }) => {
    const loginBtn = page.getByTestId("login");
    await expect(page).toHaveURL(/login/);
    await expect(loginBtn).toBeVisible();
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(loginBtn).toBeDisabled();
    await expect(page.getByTestId("sidebar")).not.toBeVisible();
  });

  test("should login the user and route to the base URL / dashboard", async ({ page }) => {
    const loginBtn = page.getByTestId("login");

    // Login with test user generated in seed script
    await page.getByTestId("email").fill(process.env.ADMIN_E2E_EMAIL!);
    await page.getByPlaceholder("Password").fill(process.env.ADMIN_E2E_PW!);

    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(loginBtn).toHaveAttribute("loading");
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("sidebar")).toBeVisible();
    await expect(page.getByTestId("dashboard")).toBeVisible();
  });
});
