import { createTestingPinia } from "@pinia/testing";
import { config } from "@vue/test-utils";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { createI18n } from "vue-i18n";
import { server } from "./server";
import "whatwg-fetch";

// Create a minimal i18n instance for testing
export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {
      common: {
        buttons: {
          addMember: "Add Member",
          addActivityType: "Add Activity Type",
        },
        actions: {
          sortBy: "Sort by",
        },
        placeholders: {
          searchMembers: "Search members...",
          enterFirstName: "Enter first name",
          enterLastName: "Enter last name",
          enterEmail: "Enter email address",
        },
        labels: {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email Address",
        },
        itemNames: {
          members: "members",
          activityTypes: "activity types",
        },
        pagination: {
          showing: "Showing {start}-{end} of {total} {items}",
          noItems: "No {items} found",
          rowsPerPage: "Rows per page:",
          pageOf: "Page {current} of {total}",
          goToPreviousPage: "Go to previous page",
          goToNextPage: "Go to next page",
        },
      },
      members: {
        title: "Members",
        subtitle: "Manage your organization members",
        sortByLastName: "Last Name",
        tableHeaders: {
          member: "Member",
          emailAddress: "Email Address",
          status: "Status",
        },
        states: {
          loading: "Loading members...",
          active: "Active",
        },
        memberSince: "Member since {date}",
        emptyState: {
          title: "No members yet",
          description: "Get started by adding your first team member",
          button: "Add First Member",
        },
        noSearchResults: {
          title: "No results found",
          description: "Try adjusting your search to find what you're looking for",
        },
        actions: {
          edit: "Edit Member",
          viewDetails: "View Details",
          delete: "Delete Member",
          openMenu: "Open menu",
        },
        addMemberDialog: {
          title: "Add Member",
        },
      },
    },
  },
});

// Mock requestAnimationFrame to prevent infinite loop
let animationFrameId = 1;
global.requestAnimationFrame = vi.fn(() => {
  return animationFrameId++;
});
global.cancelAnimationFrame = vi.fn();

// Test setups
beforeAll(() => {
  config.global.plugins = [
    createTestingPinia({ stubActions: false }),
    i18n,
  ];
  server.listen({
    onUnhandledRequest(req) {
      // eslint-disable-next-line no-console
      console.error(
        "Found an unhandled %s request to %s",
        req.method,
        req.url,
      );
    },
  });
});

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
