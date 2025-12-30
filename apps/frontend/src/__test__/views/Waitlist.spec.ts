import { mount, VueWrapper } from "@vue/test-utils";
import { expect, vi } from "vitest";
import WaitlistView from "../../views/Waitlist.vue";

// Mock Clerk Vue components
vi.mock("@clerk/vue", () => ({
  Waitlist: {
    name: "Waitlist",
    template: "<div data-testid=\"clerk-waitlist\">Clerk Waitlist</div>",
  },
  SignedIn: {
    name: "SignedIn",
    template: "<div><slot /></div>",
  },
  UserButton: {
    name: "UserButton",
    template: "<div data-testid=\"clerk-user-button\">User Button</div>",
  },
  clerkPlugin: {
    install: vi.fn(),
  },
}));

describe("Waitlist View", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(WaitlistView, {
      global: {
        stubs: {
          Waitlist: {
            template: "<div data-testid=\"clerk-waitlist\">Clerk Waitlist</div>",
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

    it("should render the Clerk Waitlist component", () => {
      const waitlist = wrapper.find("[data-testid=\"clerk-waitlist\"]");
      expect(waitlist.exists()).toBe(true);
    });

    it("should render the main element", () => {
      const main = wrapper.find("main");
      expect(main.exists()).toBe(true);
    });
  });
});
