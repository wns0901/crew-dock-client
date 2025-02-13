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
import PostCreateContainer from "./domains/BoardPage/containers/PostCreateContainer";
import PostDetailContainer from "./domains/BoardPage/containers/PostDetailContainer";
import PostEditContainer from "./domains/BoardPage/containers/PostEditiorContainer";
import PostListContainers from "./domains/BoardPage/containers/PostListContainer";
import ProjectCreateContainer from "./domains/ProjectPage/containers/ProjectCreateContainer";
import ProjectEditContainer from "./domains/ProjectPage/containers/ProjectEditContainer";
import ProjectListContainer from "./domains/ProjectPage/containers/ProjectListContainer";
import ProjectDetailContainer from "./domains/ProjectPage/containers/ProjectDetailContainer";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={myStore}>
      <LoginContextProvider>
        <ChatComponent />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SampleIndex />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/projects/:projectId" element={<ProjectMain />}>
              <Route index element={<GitData />} />
              <Route path="Git" element={<GitData />} />
              <Route path="members" element={<ProjectMembers />} />
              <Route path="resignations" element={<Resignations />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="manage" element={<ProjectManagement />} />
              <Route path="pending" element={<PendingMembers />} />
              <Route path="posts">
                <Route index element={<ProjectListContainer />} />
                <Route path="create" element={<ProjectCreateContainer />} />
                <Route path=":postId" element={<ProjectDetailContainer />} />
                <Route path=":postId/edit" element={<ProjectEditContainer />} />
              </Route>
            </Route>

            <Route path="/posts">
              <Route index element={<PostListContainers />} />
              <Route path="create" element={<PostCreateContainer />} />
              <Route path=":postId" element={<PostDetailContainer />} />
              <Route path=":postId/edit" element={<PostEditContainer />} />
            </Route>
            
          </Route>
        </Routes>
      </LoginContextProvider>
    </Provider>
  </BrowserRouter>
);
