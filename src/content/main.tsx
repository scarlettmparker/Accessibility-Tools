import globalStyles from "./styles/globals.css?inline";
import buttonStyles from "./styles/button.css?inline";

import Toolbar from "@/_components/toolbar";
import { createRoot } from "react-dom/client";

const host = document.createElement("span");

// Inject style text content from global styles
const style = document.createElement("style");
style.textContent = globalStyles + "\n" + buttonStyles;

const shadow = host.attachShadow({ mode: "open" });
shadow.appendChild(style);
document.body.appendChild(host);
createRoot(shadow).render(<Toolbar />);
