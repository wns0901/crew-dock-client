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


import MypageMain from "./domains/MyPage/components/MypageMain";
import PostsPage from "./domains/MyPage/components/PostsPage";
import PortfoliosPage from "./domains/MyPage/components/PortfoliosPage";
import ProjectsPage from "./domains/MyPage/components/ProjectsPage";
import ScrapsPage from "./domains/MyPage/components/ScrapsPage";
import Layout from "./domains/MainPage/components/Layout";
import MypageSidebar from "./domains/MyPage/components/MypageSidebar";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
      
        <Route path="/login" element={<LoginPage />} />    
      <Route element={<Layout />}>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/projects/:projectId" element={<ProjectMain />}>
          <Route index element={<GitData />} />
          <Route path="Git" element={<GitData />} />
          <Route path="members" element={<ProjectMembers />} />
          <Route path="resignations" element={<Resignations />} />
          <Route path="settings" element={<ProjectSettings />} />
          <Route path="manage" element={<ProjectManagement />} />
          <Route path="pending" element={<PendingMembers />} />
        </Route>

        <Route path="/mypage" element={<MypageMain />} />
        
        <Route path="/mypage/posts" element={<PostsPage />} />
        <Route path="/mypage/portfolios" element={<PortfoliosPage />} />
        <Route path="/mypage/projects" element={<ProjectsPage />} />
        <Route path="/mypage/scraps" element={<ScrapsPage />} />
        <Route path="/mypage/sidebar" element={<MypageSidebar />} />
        </Route>
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
