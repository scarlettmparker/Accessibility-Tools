import { createRoot } from "react-dom/client";

const host = document.createElement("div");
const shadow = host.attachShadow({ mode: "open" });
document.body.appendChild(host);
createRoot(shadow).render(<></>);
