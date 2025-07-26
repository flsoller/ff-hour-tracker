/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, VueWrapper } from "@vue/test-utils";
import { expect, vi } from "vitest";
import AddMember from "../../components/AddMember.vue";
import { flushPromises } from "../mocks/helpers";

describe("Add Member", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(AddMember, {
      props: {
        open: true,
      },
      attachTo: document.body,
    });
    await flushPromises();
  });

  afterEach(() => {
    vi.clearAllMocks();
    wrapper?.unmount();
  });

  it("should create", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should emit submit event with correct form data", async () => {
    const componentInstance = wrapper.vm as any;
    componentInstance.form.firstName = "John";
    componentInstance.form.lastName = "Doe";
    componentInstance.form.emailAddress = "john@example.com";

    componentInstance.onSubmit();

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")![0]).toEqual([{
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@example.com",
    }]);
  });

  it("should emit update:open event when cancel is called", async () => {
    const componentInstance = wrapper.vm as any;
    componentInstance.onCancel();

    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")![0]).toEqual([false]);
  });

  it("should reset form when submitted", async () => {
    const componentInstance = wrapper.vm as any;
    componentInstance.form.firstName = "John";
    componentInstance.form.lastName = "Doe";
    componentInstance.form.emailAddress = "john@example.com";

    componentInstance.onSubmit();

    // Check that form fields are cleared
    expect(componentInstance.form.firstName).toBe("");
    expect(componentInstance.form.lastName).toBe("");
    expect(componentInstance.form.emailAddress).toBe("");
  });

  it("should watch prop changes for open state", async () => {
    await wrapper.setProps({ open: false });
    await wrapper.vm.$nextTick();

    const componentInstance = wrapper.vm as any;
    expect(componentInstance.isOpen).toBe(false);

    await wrapper.setProps({ open: true });
    await wrapper.vm.$nextTick();

    expect(componentInstance.isOpen).toBe(true);
  });
});
