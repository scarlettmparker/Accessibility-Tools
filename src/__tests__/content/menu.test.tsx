import menu from "@/content/menu";

describe("Menu", () => {
  it("has expected menu keys", () => {
    const expectedKeys = [
      "text-to-speech",
      "text",
      "theme",
      "dictionary",
      "translate",
      "magnify",
      "manual",
      "settings",
    ];
    expect(Object.keys(menu)).toEqual(expectedKeys);
  });

  it("text menu has component", () => {
    expect(menu.text.component).toBeDefined();
  });

  it("other menus do not have component", () => {
    const menusWithoutComponent = [
      "text-to-speech",
      "theme",
      "dictionary",
      "translate",
      "magnify",
      "manual",
      "settings",
    ];
    menusWithoutComponent.forEach((key) => {
      expect(menu[key].component).toBeUndefined();
    });
  });
});
