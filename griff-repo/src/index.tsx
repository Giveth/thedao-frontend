import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TheDaoWireframe } from "./screens/TheDaoWireframe";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <TheDaoWireframe />
  </StrictMode>,
);
