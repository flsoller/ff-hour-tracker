import { clerk, clerkSetup } from "@clerk/testing/playwright";
import path from "path";
import { test as setup } from "./helpers";

setup.describe.configure({
  mode: "serial",
});

setup("global setup", async () => {
  await clerkSetup();
  if (!process.env.E2E_CLERK_USER_EMAIL) {
    throw new Error(
      "Please provide E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD environment variables.",
    );
  }
});

const authFile = path.join(__dirname, "playwright/.clerk/user.json");

setup("authenticate and save state", async ({ page }) => {
  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  });
  await page.waitForSelector("[data-testid=\"sidebar\"]");
  await page.context().storageState({ path: authFile });
});
