import { Provider } from "react-redux";
import { myStore } from "./containers/store";
import { createRoot } from "react-dom/client";
import LoginPage from "./domains/LoginPage/LoginPage";
import ChatComponent from "./components/chat/ChatComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./contexts/LoginContextProvider";
import SampleIndex from "./SampleIndex";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";
import ProjectMain from "./domains/ProjectPage/components/ProjectMain";
import ProjectSettings from "./domains/ProjectPage/components/ProjectSettings";
import ProjectManagement from "./domains/ProjectPage/components/ProjectManagement";
import PendingMembers from "./domains/ProjectPage/components/PendingMembers";
import Layout from "./domains/MainPage/components/Layout";
import DeadlineProjects from "./domains/MainPage/components/DeadlineProjects";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={myStore}>
      <LoginContextProvider>
        <ChatComponent />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SampleIndex />} />
            <Route path="/main" element={<DeadlineProjects/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/projects/:projectId" element={<ProjectMain />}>
              <Route index element={<GitData />} />
              <Route path="Git" element={<GitData />} />
              <Route path="members" element={<ProjectMembers />} />
              <Route path="resignations" element={<Resignations />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="manage" element={<ProjectManagement />} />
              <Route path="pending" element={<PendingMembers />} />
            </Route>
          </Route>
        </Routes>
      </LoginContextProvider>
    </Provider>
  </BrowserRouter>
);
