/**
 * Loads all CSS files dynamically from the styles folder and adds them to a style tag.
 * @returns Promise resolving to the style element containing all combined CSS.
 */
export async function loadAllStyles(): Promise<HTMLStyleElement> {
  const cssModules = import.meta.glob("../content/styles/*.css", { as: "raw" });
  const cssPromises = Object.values(cssModules).map(
    async (loader) => await loader()
  );
  const cssContents = await Promise.all(cssPromises);
  const combinedCSS = cssContents.join("\n");

  const style = document.createElement("style");
  style.textContent = combinedCSS;
  return style;
}
