import { expect, Page } from "@playwright/test";
import { generateRandomString } from "../utils";
import { Navigation } from "./navigation";

export class Config {
  constructor(private page: Page, private nav: Navigation) {}

  /**
   * Navigates to the config page to create an activity type
   * and sets it as a search param to interact with
   * @param prefix - Prefix for the random activity name (default: "test_activity")
   * @returns the generated activity name
   */
  async createActivityTypeAndFocus(prefix: string = "test_activity"): Promise<string> {
    const activityName = generateRandomString(prefix);
    await this.nav.viaSidebar("config");
    await this.page.getByRole("button", { name: "Add Activity Type" }).click();
    await this.page.getByTestId("name").click();
    await this.page.getByTestId("name").fill(activityName);
    await this.page.getByTestId("description").click();
    await this.page.getByTestId("description").fill(`${activityName} description`);
    await this.page.getByTestId("submitActivityType").click();
    await expect(this.page.getByText(`New activity type added: ${activityName}`)).toBeVisible();
    await this.page.getByRole("textbox", { name: "Search activity types..." }).click();
    await this.page.getByRole("textbox", { name: "Search activity types..." }).fill(activityName);
    await expect(this.page.getByRole("button", { name: "Open menu" })).toHaveCount(1);
    return activityName;
  }
}
