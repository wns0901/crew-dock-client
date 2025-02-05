import { createRoot } from "react-dom/client";
// import "./index.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import ProjectInfo from "./domains/ProjectPage/components/projectInfo";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/projects/:projectId" element={<ProjectInfo />}/>
      <Route path="/projects/:projectId/gitData" element={<GitData/>}/>
      <Route path="/projects/:projectId/members" element={<ProjectMembers/>}/>
      <Route path="/projects/:projectId/resignations" element={<Resignations/>}/>
   
    </Routes>
  </BrowserRouter>
);
