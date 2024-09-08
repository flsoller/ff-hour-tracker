import { expect, Page } from '@playwright/test';

async function userLogin(page: Page, emailAddress?: string, password?: string) {
  await page.goto('/');
  await page.getByTestId('email').fill(emailAddress || 'admin@user.com');
  await page.getByPlaceholder('Password').fill(password || 'support-user-pw');
  await page.getByTestId('login').click();
  await expect(page).toHaveURL('/');
}

async function goToPage(page: Page, pageName: string) {
  const pageMap = {
    members: ['membersLink', '/members'],
  };

  page.getByTestId(pageMap[pageName][0]).click();
  await expect(page).toHaveURL(pageMap[pageName][1]);
}

export { userLogin, goToPage };
