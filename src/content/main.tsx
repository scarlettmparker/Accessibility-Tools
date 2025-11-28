import globalStyles from "./styles/globals.css?inline";
import buttonStyles from "./styles/button.css?inline";
import "../i18n";

import Toolbar from "@/_components/toolbar";
import { createRoot } from "react-dom/client";

const host = document.createElement("span");

// Inject style text content from global styles
const style = document.createElement("style");
style.textContent = globalStyles + "\n" + buttonStyles;

// Load our font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap";

const shadow = host.attachShadow({ mode: "open" });
shadow.appendChild(style);
shadow.appendChild(fontLink);
document.body.appendChild(host);
createRoot(shadow).render(<Toolbar />);
