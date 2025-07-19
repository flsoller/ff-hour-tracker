import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createMembersData } from "../../helpers/apiActions";
import { goToPage, userLogin } from "../../helpers/userActions";
import { createMembers } from "../../helpers/utils";

test.describe("Members", () => {
  test.describe.skip("paginated members table", () => {
    test("should display an info text in the table if no members", async ({ page }) => {
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");
      await expect(
        page.getByText("No Members added yet, start adding to see data.", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Add Member/ }),
      ).toBeVisible();
    });

    test("should display all members in the table with default pagination option of 5", async ({ page }) => {
      const membersToCreate = createMembers(5);
      await createMembersData(process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!, membersToCreate);
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");

      for (const member of membersToCreate) {
        await expect(
          page.getByText(member.firstName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.lastName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.emailAddress, {
            exact: true,
          }),
        ).toBeVisible();
      }
    });

    test("should display all members split per each page of the paginated table", async ({ page }) => {
      const membersToCreate = createMembers(10);
      await createMembersData(process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!, membersToCreate);
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");

      // Sort members by last name same as api response for easier comparison of table data
      const sortedMembers = membersToCreate.sort((a, b) =>
        a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0
      );

      for (const member of sortedMembers.slice(0, 5)) {
        await expect(
          page.getByText(member.firstName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.lastName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.emailAddress, {
            exact: true,
          }),
        ).toBeVisible();
      }

      // go to second page in the table
      await page.getByRole("button", { name: /2/ }).click();

      for (const member of sortedMembers.slice(5)) {
        await expect(
          page.getByText(member.firstName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.lastName, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(
          page.getByText(member.emailAddress, {
            exact: true,
          }),
        ).toBeVisible();
      }
    });

    test("should correctly use the sort function of lastName", async ({ page }) => {
      const membersToCreate = createMembers(10);
      await createMembersData(process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!, membersToCreate);
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");

      // Sort members by last name descending for easier comparison of table data
      const sortedMembers = membersToCreate.sort((a, b) =>
        a.lastName < b.lastName ? 1 : b.lastName < a.lastName ? -1 : 0
      );

      await page.getByText("Last Name", { exact: true }).click();
      await page.getByText("Last Name", { exact: true }).click();
      const rows = page.getByRole("row");
      const tableData = await rows.evaluateAll((list) => list.map((el) => el.textContent));
      expect(tableData[1]).toBe(
        `${sortedMembers[0].firstName}${sortedMembers[0].lastName}${sortedMembers[0].emailAddress}`,
      );
    });
  });

  test.describe("add members", () => {
    test("should create a new member via add member modal", async ({ page }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");
      await page.getByText("Add Member", { exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByTestId("firstName").fill(firstName);
      await page.getByTestId("lastName").fill(lastName);
      await page.getByTestId("email").fill(email);
      await page.getByTestId("addMember").click();
      await expect(
        page.getByText(`New member added: ${firstName} ${lastName}`, { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });

    test("should show an error snackbar if adding member fails", async ({ page }) => {
      await userLogin(page, process.env.ADMIN_E2E_EMAIL!, process.env.ADMIN_E2E_PW!);
      await goToPage(page, "members");
      await page.route("**/v1/members", async (route) => {
        await route.fetch();
        route.fulfill({
          status: 400,
        });
      });
      await page.getByText("Add Member", { exact: true }).click();
      await page.getByTestId("firstName").fill("Firstname");
      await page.getByTestId("lastName").fill("Lastname");
      await page.getByTestId("email").fill("first.last@user.com");
      await page.getByTestId("addMember").click();
      await expect(
        page.getByText("Unexpected error while adding a member", {
          exact: true,
        }),
      ).toBeVisible();
    });
  });
});
