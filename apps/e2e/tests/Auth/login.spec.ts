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
    await page.getByTestId("email").fill("admin@user.com");
    await page.getByPlaceholder("Password").fill("support-user-pw");

    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
    await expect(loginBtn).toHaveClass(/p-button-loading/);
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("sidebar")).toBeVisible();
    await expect(page.getByTestId("dashboard")).toBeVisible();
  });

  test("should show user feedback on api response delay and error", async ({ page }) => {
    await page.getByTestId("email").fill("admin@user.com");
    await page.getByPlaceholder("Password").fill("support-user-pw");
    await expect(page.getByTestId("infoContainer")).not.toBeVisible();
    await page.route("**/v0/auth/signin", async (route) => {
      setTimeout(async () => {
        await route.fetch();
        route.fulfill({
          status: 401,
        });
      }, 3000);
    });
    await page.getByTestId("login").click();
    await expect(page.getByTestId("infoContainer")).toBeVisible();
    await expect(
      page.getByText("The free resources enabling this project"),
    ).toBeVisible();
    await expect(
      page.getByText("Invalid Credentials", { exact: true }),
    ).toBeVisible();
  });
});
