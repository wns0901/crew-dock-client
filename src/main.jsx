import { createRoot } from "react-dom/client";
// import "./index.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
// import ProjectInfo from "./domains/ProjectPage/components/projectInfo";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";
import ProjectMain from "./domains/ProjectPage/components/ProjectMain";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
    <Route path="/projects/:projectId" element={<ProjectMain />}>
    <Route index element={<GitData />} />
        <Route path="members" element={<ProjectMembers />} />
        <Route path="resignations" element={<Resignations />} />
    </Route>
    </Routes>
  </BrowserRouter>
);
