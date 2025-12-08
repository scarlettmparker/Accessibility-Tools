import {
  adjustFontSize,
  resetForTests,
  resetFontSize,
  observer,
} from "@/utils/text";

describe("text utils", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    resetForTests();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("adjustFontSize", () => {
    it("should increase font size", () => {
      // Create a text node
      const div = document.createElement("div");
      div.textContent = "Test text";
      div.style.fontSize = "16px";
      document.body.appendChild(div);

      adjustFontSize("increase");

      expect(div.style.fontSize).toBe("17.6px"); // 16 * 1.1
    });

    it("should decrease font size", () => {
      const div = document.createElement("div");
      div.textContent = "Test text";
      div.style.fontSize = "16px";
      document.body.appendChild(div);

      adjustFontSize("decrease");

      expect(div.style.fontSize).toBe("14.4px"); // 16 * 0.9
    });

    it("should adjust input elements", () => {
      const input = document.createElement("input");
      input.style.fontSize = "16px";
      document.body.appendChild(input);

      adjustFontSize("increase");

      expect(input.style.fontSize).toBe("17.6px");
    });

    it("should adjust textarea elements", () => {
      const textarea = document.createElement("textarea");
      textarea.style.fontSize = "16px";
      document.body.appendChild(textarea);

      adjustFontSize("increase");

      expect(textarea.style.fontSize).toBe("17.6px");
    });

    it("should handle nested elements", () => {
      const parent = document.createElement("div");
      parent.style.fontSize = "20px";
      const child = document.createElement("span");
      child.textContent = "Child text";
      parent.appendChild(child);
      document.body.appendChild(parent);

      adjustFontSize("increase");

      expect(parent.style.fontSize).toBe("22px"); // 20 * 1.1
    });

    it("should skip script and style content", () => {
      const script = document.createElement("script");
      script.textContent = "console.log('test');";
      document.body.appendChild(script);

      adjustFontSize("increase");

      // Script should not have font-size set
      expect(script.style.fontSize).toBe("");
    });

    it("should set up observer on first call", () => {
      const div = document.createElement("div");
      div.textContent = "Test";
      document.body.appendChild(div);

      expect(observer).toBeNull();

      adjustFontSize("increase");

      expect(observer).not.toBeNull();
    });

    it("should handle multiple calls", () => {
      const div = document.createElement("div");
      div.textContent = "Test";
      div.style.fontSize = "16px";
      document.body.appendChild(div);

      adjustFontSize("increase");
      expect(div.style.fontSize).toBe("17.6px");

      adjustFontSize("increase");
      expect(parseFloat(div.style.fontSize)).toBeCloseTo(19.36); // 16 * 1.1 * 1.1
    });
  });

  describe("resetFontSize", () => {
    it("should reset font size multiplier and clear baseFontSizes", () => {
      const div = document.createElement("div");
      div.textContent = "Test";
      div.style.fontSize = "16px";
      document.body.appendChild(div);

      adjustFontSize("increase");
      expect(div.style.fontSize).toBe("17.6px");

      resetFontSize();
      expect(div.style.fontSize).toBe("");
    });
  });
});
