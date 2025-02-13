import { Provider } from "react-redux";
import { myStore } from "./containers/store";
import { createRoot } from "react-dom/client";
import LoginPage from "./domains/LoginPage/LoginPage";
import ChatComponent from "./components/chat/ChatComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./contexts/LoginContextProvider";
import SampleIndex from "./SampleIndex";
import GitData from "./domains/ProjectPage/components/gitData";
import ProjectIssue from"./domains/ProjectPage/components/IssueTable";
import ProjectMembers from "./domains/ProjectPage/components/ProjectMembers";
import Resignations from "./domains/ProjectPage/components/Resignations";
import ProjectMain from "./domains/ProjectPage/components/ProjectMain";
import ProjectSettings from "./domains/ProjectPage/components/ProjectSettings";
import ProjectManagement from "./domains/ProjectPage/components/ProjectManagement";
import PendingMembers from "./domains/ProjectPage/components/PendingMembers";
import Layout from "./domains/MainPage/components/Layout";
import AdminDashboard from "./domains/AdminPage/components/AdminDashboard";
import AdminUser from "./domains/AdminPage/components/AdminUser";
import AdminProject from "./domains/AdminPage/components/AdminProject";
import AdminStack from "./domains/AdminPage/components/AdminStack";
import AdminRecruitmentPost from "./domains/AdminPage/components/AdminRecruitmentPost";
import AdminPosts from "./domains/AdminPage/components/AdminPosts";
import AdminBanner from "./domains/AdminPage/components/AdminBanner";
import AdminStackUsage from "./domains/AdminPage/components/AdminStackUsage";
import AdminHopePositionUsage from "./domains/AdminPage/components/AdminHopePositionUsage";
import RegisterPage from "./domains/RegisterPage/RegisterPage";
import SocialRegisterPage from "./domains/RegisterPage/SocialRegisterPage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={myStore}>
      <LoginContextProvider>
        <ChatComponent />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SampleIndex />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/social-register" element={<SocialRegisterPage />} />
            <Route path="/projects/:projectId" element={<ProjectMain />}>
              <Route index element={<GitData />} />
              <Route path="issues" element={<ProjectIssue/>}/>
              <Route path="Git" element={<GitData />} />
              <Route path="members" element={<ProjectMembers />} />
              <Route path="resignations" element={<Resignations />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="manage" element={<ProjectManagement />} />
              <Route path="pending" element={<PendingMembers />} />
            </Route>

            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/user" element={<AdminUser />} />
            <Route path="admin/project" element={<AdminProject />} />
            <Route path="admin/stack" element={<AdminStack />} />
            <Route path="admin/recruitment" element={<AdminRecruitmentPost />} />
            <Route path="admin/posts" element={<AdminPosts />} />
            <Route path="admin/banners" element={<AdminBanner />} />
            <Route path="admin/stackusage" element={<AdminStackUsage />} />
            <Route path="admin/hopeposition" element={<AdminHopePositionUsage />} />
          </Route>

        </Routes>
      </LoginContextProvider>
    </Provider>
  </BrowserRouter>
);
