import { setFontFace, getCurrentFontFace, fontFaces } from "@/utils/font-face";

describe("font-face utils", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.style.fontFamily = "";
  });

  describe("setFontFace", () => {
    it("should set font family on body", () => {
      setFontFace("Arial, sans-serif");
      expect(document.body.style.fontFamily).toBe("Arial, sans-serif");
      expect(getCurrentFontFace()).toBe("Arial, sans-serif");
    });

    it("should set to the provided font value", () => {
      setFontFace("Times New Roman, serif");
      expect(document.body.style.fontFamily).toBe("Times New Roman, serif");
    });
  });

  describe("fontFaces", () => {
    it("should include default and standard fonts", () => {
      expect(fontFaces.length).toBeGreaterThan(1);
      expect(fontFaces[0].name).toBe("Default");
      expect(typeof fontFaces[0].value).toBe("string");
    });
  });
});
