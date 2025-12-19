import { mount, VueWrapper } from "@vue/test-utils";
import { expect, vi } from "vitest";
import LoginView from "../../views/Login.vue";

// Mock Clerk Vue components
vi.mock("@clerk/vue", () => ({
  SignIn: {
    name: "SignIn",
    template: "<div data-testid=\"clerk-sign-in\">Clerk SignIn</div>",
  },
  clerkPlugin: {
    install: vi.fn(),
  },
}));

describe("Login View", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(LoginView, {
      global: {
        stubs: {
          SignIn: {
            template: "<div data-testid=\"clerk-sign-in\">Clerk SignIn</div>",
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("component tests", () => {
    it("should render the component", () => {
      expect(wrapper.isVisible()).toBe(true);
    });

    it("should render the Clerk SignIn component", () => {
      const signIn = wrapper.find("[data-testid=\"clerk-sign-in\"]");
      expect(signIn.exists()).toBe(true);
    });

    it("should be centered on the page", () => {
      const container = wrapper.find("div");
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("items-center");
      expect(container.classes()).toContain("justify-center");
    });
  });
});
