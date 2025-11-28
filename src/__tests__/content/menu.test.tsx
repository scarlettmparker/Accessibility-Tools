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

  it("menus with components", () => {
    const menusWithComponent = [
      "text-to-speech",
      "text",
      "theme",
      "dictionary",
      "translate",
      "magnify",
    ];
    menusWithComponent.forEach((key) => {
      expect(menu[key].component).toBeDefined();
    });
  });

  it("menus without components", () => {
    const menusWithoutComponent = ["manual", "settings"];
    menusWithoutComponent.forEach((key) => {
      expect(menu[key].component).toBeUndefined();
    });
  });
});
