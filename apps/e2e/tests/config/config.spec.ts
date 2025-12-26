import { expect, test } from "../../helpers";

test.describe("Configuration Page - Activity Types", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("allows a user to edit an existing activity type", async ({ page, config }) => {
    const activityName = await config.createActivityTypeAndFocus();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("name")).toHaveValue(activityName);

    const nameInput = dialog.getByTestId("name");
    const updatedName = `${activityName} - Updated`;
    const descriptionInput = dialog.getByTestId("description");
    const updatedDescription = `${activityName} - Updated Description`;
    await nameInput.clear();
    await descriptionInput.clear();

    await nameInput.fill(updatedName);
    await descriptionInput.fill(updatedDescription);

    await dialog.getByTestId("submitActivityType").click();
    await expect(page.getByText(`Activity type updated: ${updatedName}`)).toBeVisible();

    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toContainText(updatedName);
    await expect(firstRow).toContainText(updatedDescription);
  });
});
