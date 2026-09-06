import "../i18n";

import Toolbar from "@/_components/toolbar";
import { createRoot } from "react-dom/client";
import { loadAllStyles } from "../utils/load-styles";
import { setShadowRoot } from "./shadow-root";

const host = document.createElement("span");
host.id = "accessibility-tools-host";
host.style.position = "relative";
host.style.zIndex = "2147483600";

// Load our font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";

(async () => {
  // Inject style text content from all styles
  const style = await loadAllStyles();

  const shadow = host.attachShadow({ mode: "open" });
  setShadowRoot(shadow);
  shadow.appendChild(style);
  shadow.appendChild(fontLink);
  document.body.appendChild(host);
  createRoot(shadow).render(<Toolbar />);
})();
