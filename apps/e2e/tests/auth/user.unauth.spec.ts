import { expect, test } from "../../helpers";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Unauthenticated flows", () => {
  test("unauthenticated user is redirected to login when accessing root page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.getByText("Sign in to Timecraft")).toBeVisible();
  });

  test("unauthenticated user is redirected to login when accessing members page", async ({ page }) => {
    await page.goto("/members");
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.getByText("Sign in to Timecraft")).toBeVisible();
  });

  test("should allow unauthenticated user to change theme", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*login.*/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
