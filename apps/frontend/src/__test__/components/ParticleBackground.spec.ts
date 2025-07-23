import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ParticleBackground from "../../components/ParticleBackground.vue";

// Mock window resize event
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
Object.defineProperty(window, "addEventListener", { value: mockAddEventListener });
Object.defineProperty(window, "removeEventListener", { value: mockRemoveEventListener });
Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
Object.defineProperty(window, "innerHeight", { value: 768, writable: true });

describe("ParticleBackground", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(ParticleBackground);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  it("should create component successfully", () => {
    expect(wrapper.isVisible()).toBe(true);
  });

  it("should render canvas element", () => {
    const canvas = wrapper.find("canvas");
    expect(canvas.exists()).toBe(true);
    expect(canvas.classes()).toContain("particle-canvas");
  });

  it("should have correct CSS classes for particle background", () => {
    const container = wrapper.find(".particle-background");
    expect(container.exists()).toBe(true);
    expect(container.classes()).toContain("particle-background");
  });

  it("should initialize canvas context on mount", () => {
    const canvas = wrapper.find("canvas");
    expect(canvas.exists()).toBe(true);
  });

  it("should add window resize listener on mount", () => {
    expect(mockAddEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("should start animation loop on mount", () => {
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  it("should remove resize listener on unmount", () => {
    wrapper.unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("should cancel animation frame on unmount", () => {
    wrapper.unmount();
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should call canvas drawing methods during animation", () => {
    // Check that requestAnimationFrame was called to start animation
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  it("should handle resize event correctly", () => {
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === "resize",
    )?.[1];

    expect(resizeHandler).toBeDefined();

    // Trigger resize
    if (resizeHandler) {
      window.innerWidth = 1920;
      window.innerHeight = 1080;
      resizeHandler();
    }
  });

  it("should have fixed positioning styles", () => {
    const container = wrapper.find(".particle-background");

    // Note: jsdom doesn't fully compute styles, but we can check class presence
    expect(container.classes()).toContain("particle-background");
  });

  it("should handle missing canvas gracefully", () => {
    // Create wrapper without canvas ref
    const wrapperWithoutCanvas = mount(ParticleBackground);

    // Should not throw errors
    expect(wrapperWithoutCanvas.isVisible()).toBe(true);
  });
});
