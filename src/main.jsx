import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatComponent from "./components/ChatComponent";
import LoginPage from "./domains/LoginPage/LoginPage";
import LoginContextProvider from "./contexts/LoginContextProvider";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";
import ProjectMain from "./domains/ProjectPage/components/ProjectMain";
import ProjectSettings from "./domains/ProjectPage/components/ProjectSettings";
import ProjectManagement from "./domains/ProjectPage/components/ProjectManagement";
import PendingMembers from "./domains/ProjectPage/components/PendingMembers";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projects/:projectId" element={<ProjectMain />}>
          <Route index element={<GitData />} />
          <Route path="members" element={<ProjectMembers />} />
          <Route path="resignations" element={<Resignations />} />
          <Route path="settings" element={<ProjectSettings />} />
          <Route path="manage" element={<ProjectManagement />} />
          <Route path="pending" element={<PendingMembers />} />
        </Route>
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
