import { Provider } from "react-redux";
import { myStore } from "./containers/store";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatComponent from "./components/chat/ChatComponent";
import LoginPage from "./domains/LoginPage/LoginPage";
import LoginContextProvider from "./contexts/LoginContextProvider";
import SampleIndex from "./SampleIndex";
import GitData from "./domains/ProjectPage/components/GitData";
import ProjectIssue from "./domains/ProjectPage/components/IssueTable";
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
import MainPage from "./domains/MainPage/MainPage";
import WriteRecruitmentPost from "./domains/MainPage/components/WriteRecruitmentPost";
import MypageMain from "./domains/MyPage/components/MypageMain";
import PostsPage from "./domains/MyPage/components/PostsPage";
import PortfoliosPage from "./domains/MyPage/components/PortfoliosPage";
import PortfoliosEditPage from "./domains/MyPage/components/PortfoliosEditPage";
import ProjectsPage from "./domains/MyPage/components/ProjectsPage";
import ScrapsPage from "./domains/MyPage/components/ScrapsPage";
import MypageSidebar from "./domains/MyPage/components/MypageSidebar";
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
import ProjectCalendar from "./domains/ProjectPage/components/ProjectCalendar";
import DetailRecruitmentsPost from "./domains/MainPage/components/DetailRecruitmentsPost";
import EditRecruitmentPost from "./domains/MainPage/components/EditRecruitmentPost"; 
import UrgentIssues from "./domains/ProjectPage/components/UrgentIssues";
import ProjectMainDashboard from "./domains/ProjectPage/components/ProjectMainDashBoard";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={myStore}>
      <LoginContextProvider>
        <ChatComponent />
        <Routes>
          <Route element={<Layout />}>

            {/* <Route path="/" element={<SampleIndex />} /> */}
            <Route path="/" element={<MainPage />} />
            <Route
              path="/recruitmemt/write"
              element={<WriteRecruitmentPost />}
            />
            <Route path="/recruitment/write" element={<WriteRecruitmentPost />} />
            <Route path="/recruitments/:recruitmentsId" element={<DetailRecruitmentsPost />} />  {/* 동적 라우트 추가 */}
            <Route path="/recruitments/edit/:recruitmentId" element={<EditRecruitmentPost />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/social-register" element={<SocialRegisterPage />} />
            <Route path="issues" element={<ProjectIssue />} />
            <Route
              path="/recruitmemt/write"
              element={<WriteRecruitmentPost />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/social-register" element={<SocialRegisterPage />} />
            
            <Route path="/projects/:projectId" element={<ProjectMain />}>

              <Route index element={<ProjectMainDashboard />} />
              <Route path="issues" element={<ProjectIssue />} />
              <Route path="Git" element={<GitData />} />
              <Route path="members" element={<ProjectMembers />} />
              <Route path="resignations" element={<Resignations />} />
              <Route path="settings" element={<ProjectSettings />} />
              <Route path="manage" element={<ProjectManagement />} />
              <Route path="pending" element={<PendingMembers />} />
              <Route path="Urgent" element={<UrgentIssues />} />

              <Route path="posts">
                <Route index element={<ProjectListContainer />} />
                <Route path="create" element={<ProjectCreateContainer />} />
                <Route path=":postId" element={<ProjectDetailContainer />} />
                <Route
                  path=":postId/edit"
                  element={<ProjectEditContainer />}
                />
              </Route>

            </Route>

            <Route path="/posts">
              <Route index element={<PostListContainers />} />
              <Route path="create" element={<PostCreateContainer />} />
              <Route path=":postId" element={<PostDetailContainer />} />
              <Route path=":postId/edit" element={<PostEditContainer />} />
            </Route>

            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/user" element={<AdminUser />} />
            <Route path="admin/project" element={<AdminProject />} />
            <Route path="admin/stack" element={<AdminStack />} />
            <Route
              path="admin/recruitment"
              element={<AdminRecruitmentPost />}
            />
            <Route path="admin/posts" element={<AdminPosts />} />
            <Route path="admin/banners" element={<AdminBanner />} />
            <Route path="admin/stackusage" element={<AdminStackUsage />} />
            <Route
              path="admin/hopeposition"
              element={<AdminHopePositionUsage />}
            />

            <Route path="/mypage" element={<MypageMain />} />
            <Route path="/mypage/:userId" element={<MypageMain />} />
            <Route path="/mypage/posts" element={<PostsPage />} />
            <Route path="/mypage/portfolios" element={<PortfoliosPage />} />
            <Route
              path="/mypage/:userId/portfolios"
              element={<PortfoliosPage />}
            />
            <Route
              path="/mypage/portfolios/edit/:portfolioId"
              element={<PortfoliosEditPage />}
            />
            <Route
              path="/mypage/portfolios/new"
              element={<PortfoliosEditPage />}
            />
            <Route path="/mypage/projects" element={<ProjectsPage />} />
            <Route path="/mypage/scraps" element={<ScrapsPage />} />
            <Route path="/mypage/sidebar" element={<MypageSidebar />} />
            
          </Route>
        </Routes>
      </LoginContextProvider>
    </Provider>
  </BrowserRouter>
);
