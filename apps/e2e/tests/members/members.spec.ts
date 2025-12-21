import { expect, test } from "../../helpers/fixtures";

test.describe("Members Page", () => {
  test("shows empty state when no members exist", async ({ page, nav }) => {
    await page.goto("/");
    await nav.viaSidebar("members");
    await expect(page.getByRole("button", { name: "Add First Member" })).toBeVisible();
  });
});
