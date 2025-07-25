import { createTestingPinia } from "@pinia/testing";
import { mount, VueWrapper } from "@vue/test-utils";
import { rest } from "msw";
import { expect, vi } from "vitest";
import { useMembersStore } from "../../stores/members";
import { AppConstants } from "../../utils/constants";
import Members from "../../views/Members.vue";
import { flushPromises } from "../mocks/helpers";
import { server } from "../mocks/server";

describe("Members View", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(Members, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    flushPromises();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create", async () => {
    expect(wrapper.isVisible()).toBe(true);
    expect(
      await wrapper.find(".members-table__header > span").text(),
    ).toContain("Members");
    expect(
      await wrapper.find(".members-table__header > Button").text(),
    ).toContain("Add Member");
  });

  it("should call members store getMembersPaginated method on mount", async () => {
    const store = useMembersStore();
    expect(store.loading).toBe(true);
    expect(store.getMembersPaginated).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(store.loading).toBe(false);
  });

  it("should display correct number of table rows", async () => {
    expect(await wrapper.findAll("thead > tr").length).toBe(1);
    expect(await wrapper.findAll("tbody > tr").length).toBe(1);
    expect(wrapper.html()).not.toContain("class=\"members-table__footer\"");
  });

  it("should display correct information in table rows", async () => {
    await flushPromises();
    const headers = await wrapper.findAll("th");
    const tableData = await wrapper.findAll("tbody > tr > td");

    ["First Name", "Last Name", "Email Address"].forEach((header, i) => {
      expect(headers[i].text()).toContain(header);
    });
    ["Paige", "Turner", "pt@mail.com"].forEach((text, i) => {
      expect(tableData[i].text()).toContain(text);
    });
  });

  it("should trigger api call with correct order query when sorting column desc", async () => {
    const store = useMembersStore();
    // click twice as initial click sets sort to default 'asc'
    await wrapper.find(".p-datatable-sortable-column").trigger("click");
    await wrapper.find(".p-datatable-sortable-column").trigger("click");
    expect(store.getMembersPaginated).toHaveBeenLastCalledWith({
      order: "desc",
    });
  });

  it("should show an info text when there are no members", async () => {
    server.use(
      rest.get(`${AppConstants.apiUrl}/v1/members`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: [], totalCount: 0 }));
      }),
    );
    const noDataWrapper = mount(Members);
    await flushPromises();
    expect(noDataWrapper.html()).toContain("class=\"members-table__footer\"");
    expect(
      await noDataWrapper.find(".members-table__footer > span").text(),
    ).toContain("No Members added yet, start adding to see data.");
  });

  it("should trigger api call with correct offset query when changing table page", async () => {
    const data: Record<string, string>[] = [];
    for (let i = 0; i < 25; i++) {
      data.push({
        firstName: `first${i}`,
        lastName: `last${i}`,
        emailAddress: `first${i}@last${i}.com`,
      });
    }
    server.use(
      rest.get(`${AppConstants.apiUrl}/v1/members`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ data, totalCount: data.length }),
        );
      }),
    );
    const moreDataWrapper = mount(Members);
    const store = useMembersStore();
    await flushPromises();

    await moreDataWrapper.find("[aria-label=\"Next Page\"]").trigger("click");
    expect(store.getMembersPaginated).toHaveBeenLastCalledWith({
      limit: "5",
      offset: "5",
      order: "asc",
    });
  });

  it("should trigger api call with correct limit query when changing table row limit", async () => {
    const data: Record<string, string>[] = [];
    for (let i = 0; i < 25; i++) {
      data.push({
        firstName: `first${i}`,
        lastName: `last${i}`,
        emailAddress: `first${i}@last${i}.com`,
      });
    }
    server.use(
      rest.get(`${AppConstants.apiUrl}/v1/members`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ data, totalCount: data.length }),
        );
      }),
    );
    const moreDataWrapper = mount(Members, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
      attachTo: document.body,
    });
    const store = useMembersStore();
    await flushPromises();

    // Directly trigger the page event on the DataTable with the expected page event structure
    const dataTable = moreDataWrapper.findComponent({ name: "DataTable" });

    // Simulate a page event as if the user changed rows per page to 20
    await dataTable.vm.$emit("page", {
      first: 0, // offset
      rows: 20, // limit
      page: 0,
      pageCount: Math.ceil(25 / 20),
      sortField: undefined,
      sortOrder: 1, // asc
    });
    await flushPromises();

    expect(store.getMembersPaginated).toHaveBeenLastCalledWith({
      limit: "20",
      offset: "0",
      order: "asc",
    });
  });
});
