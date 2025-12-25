import { createTestingPinia } from "@pinia/testing";
import { mount, VueWrapper } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { expect, vi } from "vitest";
import { computed, ref } from "vue";
import { useMembersStore } from "../../stores/members";
import { AppConstants } from "../../utils/constants";
import Members from "../../views/Members.vue";
import { flushPromises } from "../mocks/helpers";
import { server } from "../mocks/server";
import { i18n } from "../mocks/setup";

// Mock Clerk Vue composables
vi.mock("@clerk/vue", () => ({
  useAuth: () => ({
    isSignedIn: ref(true),
    getToken: computed(() => async () => "mock-token"),
    signOut: computed(() => async () => {}),
  }),
  useUser: () => ({
    user: ref({ fullName: "Test User", primaryEmailAddress: { emailAddress: "test@example.com" } }),
  }),
  useOrganization: () => ({
    organization: ref({ name: "Test Org" }),
  }),
}));

describe("Members View", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(Members, {
      global: {
        plugins: [createTestingPinia({ stubActions: false }), i18n],
      },
    });
    flushPromises();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create", async () => {
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.find("h1").text()).toContain("Members");
    expect(wrapper.find("button").text()).toContain("Add Member");
  });

  it("should call members store getMembersPaginated method on mount", async () => {
    const store = useMembersStore();
    expect(store.loading).toBe(true);
    expect(store.getMembersPaginated).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(store.loading).toBe(false);
  });

  it("should display correct table headers", async () => {
    const headers = await wrapper.findAll("th");
    const expectedHeaders = ["", "Member", "Email Address", "Status", ""];

    expectedHeaders.forEach((header, i) => {
      expect(headers[i]?.text()).toContain(header);
    });
  });

  it("should display member data in table rows", async () => {
    await flushPromises();
    const tableData = await wrapper.findAll("tbody > tr > td");

    // First cell contains avatar with initials
    expect(tableData[0]?.text()).toContain("PT");
    // Second cell contains full name
    expect(tableData[1]?.text()).toContain("Paige Turner");
    // Third cell contains email
    expect(tableData[2]?.text()).toContain("pt@mail.com");
  });

  it("should trigger api call with correct order query when sorting column", async () => {
    const store = useMembersStore();
    // Find the sort button that contains "Last Name" text
    const sortButtons = await wrapper.findAll("button");
    const sortButton = sortButtons.find(button => button.text().includes("Last Name"));
    expect(sortButton).toBeDefined();
    await sortButton?.trigger("click");
    expect(store.changeSortOrder).toHaveBeenCalledWith("desc", 5, 0);
  });

  it("should show an info text when there are no members", async () => {
    server.use(
      http.get(`${AppConstants.apiUrl}/v1/members`, () => {
        return HttpResponse.json({ data: [], totalCount: 0 });
      }),
    );
    const noDataWrapper = mount(Members, {
      global: {
        plugins: [createTestingPinia({ stubActions: false }), i18n],
      },
    });
    await flushPromises();
    expect(noDataWrapper.text()).toContain("No members yet");
  });

  it("should open AddMember dialog when Add Member button is clicked", async () => {
    const addButton = wrapper.find("button");
    await addButton.trigger("click");

    // Check that AddMember component is rendered (dialog is open)
    expect(wrapper.findComponent({ name: "AddMember" }).exists()).toBe(true);
  });

  it("should call addNewMember when AddMember emits submit", async () => {
    const store = useMembersStore();
    const addButton = wrapper.find("button");
    await addButton.trigger("click");

    const addMemberComponent = wrapper.findComponent({ name: "AddMember" });
    await addMemberComponent.vm.$emit("submit", {
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@example.com",
    });

    expect(store.addNewMember).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@example.com",
    }, {
      limit: "5",
      offset: "0",
      order: "asc",
    });
  });
});
