import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes } from "react-router-dom";
import ProjectIssuePage from "./domains/ProjectPage/ProjectIssuePage";

createRoot(document.getElementById("root")).render(
    <ProjectIssuePage/>
);
