import { expect, Page } from "@playwright/test";

async function userLogin(page: Page, emailAddress?: string, password?: string) {
  await page.goto("/");
  await page.getByTestId("email").fill(emailAddress ?? process.env.ADMIN_E2E_EMAIL!);
  await page.getByPlaceholder("Password").fill(password ?? process.env.ADMIN_E2E_PW!);
  await page.getByTestId("login").click();
  await expect(page).toHaveURL("/");
}

async function goToPage(page: Page, pageName: string) {
  const pageMap = {
    members: ["membersLink", "/members"],
  };

  page.getByTestId(pageMap[pageName as keyof typeof pageMap][0]).click();
  await expect(page).toHaveURL(pageMap[pageName as keyof typeof pageMap][1]);
}

export { goToPage, userLogin };
