import { mount, VueWrapper } from "@vue/test-utils";
import { expect, vi } from "vitest";
import AddMember from "../../components/AddMember.vue";
import { useMembersStore } from "../../stores/members";
import { flushPromises } from "../mocks/helpers";

describe("Add Member", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(AddMember, {
      global: {
        provide: {
          dialogRef: { value: { close: vi.fn() } },
        },
      },
    });
    flushPromises();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create", async () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it("should have add member button disabled with invalid form", async () => {
    const button = wrapper.find("button");
    await wrapper.find("[placeholder=\"First Name\"]").setValue("First");
    await wrapper.find("[placeholder=\"Last Name\"]").setValue("Last");
    expect(button.element.disabled).toBe(true);
  });

  it("should have add member button enabled with valid inputs", async () => {
    const button = wrapper.find("button");
    await wrapper.find("[placeholder=\"First Name\"]").setValue("First");
    await wrapper.find("[placeholder=\"Last Name\"]").setValue("Last");
    await wrapper.find("input[type=email]").setValue("user@email.com");
    expect(button.element.disabled).toBe(false);
  });

  it("should call members store with correct input values", async () => {
    const store = useMembersStore();
    const button = wrapper.find("button");
    await wrapper.find("[placeholder=\"First Name\"]").setValue("First");
    await wrapper.find("[placeholder=\"Last Name\"]").setValue("Last");
    await wrapper.find("input[type=email]").setValue("user@email.com");
    expect(button.element.disabled).toBe(false);
    await wrapper.find("form").trigger("submit");
    expect(store.addNewMember).toHaveBeenCalledTimes(1);
    expect(store.addNewMember).toHaveBeenCalledWith({
      firstName: "First",
      lastName: "Last",
      emailAddress: "user@email.com",
    });
  });
});
