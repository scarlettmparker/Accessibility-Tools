import libraryStyles from "@sun/components/style.css?raw";

/**
 * Loads the Sun component library styles plus all local content styles
 * into a single style element for the shadow root.
 */
export async function loadAllStyles(): Promise<HTMLStyleElement> {
  const cssModules = import.meta.glob("../content/styles/*.css", {
    query: "?raw",
    import: "default",
  });
  const cssPromises = Object.values(cssModules).map(
    async (loader) => await loader(),
  );
  const cssContents = await Promise.all(cssPromises);
  const scopedLibraryStyles = libraryStyles.replace(/:root/g, ":host");
  const combinedCSS = [scopedLibraryStyles, ...cssContents].join("\n");

  const style = document.createElement("style");
  style.textContent = combinedCSS;
  return style;
}
