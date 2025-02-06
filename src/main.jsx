import { createRoot } from "react-dom/client";
// import "./index.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
// import ProjectInfo from "./domains/ProjectPage/components/projectInfo";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";
import ProjectMain from "./domains/ProjectPage/components/ProjectMain";
import ProjectSettings from "./domains/ProjectPage/components/ProjectSettings";
import ProjectManagement from "./domains/ProjectPage/components/ProjectManagement";
import PendingMembers from "./domains/ProjectPage/components/PendingMembers";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
    <Route path="/projects/:projectId" element={<ProjectMain />}>
    <Route index element={<GitData />} />
        <Route path="members" element={<ProjectMembers />} />
        <Route path="resignations" element={<Resignations />} />
        <Route path="settings" element={<ProjectSettings />} />
        <Route path="manage" element={<ProjectManagement />} />
        <Route path="pending" element={<PendingMembers />} />
    </Route>
    </Routes>
  </BrowserRouter>
);
