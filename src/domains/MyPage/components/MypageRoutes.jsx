import { Routes, Route } from "react-router-dom";
import MypageMain from "./MypageMain";
import PostsPage from "./PostsPage";
import PortfoliosPage from "./PortfoliosPage";
import ProjectsPage from "./ProjectsPage";
import ScrapsPage from "./ScrapsPage";

const MypageRoutes = () => {
    return (
        <Routes>
            <Route path="mypage" element={<MypageMain />}>
                <Route path="posts" element={<PostsPage />} />
                <Route path="portfolios" element={<PortfoliosPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="scraps" element={<ScrapsPage />} />
            </Route>
        </Routes>
    );
};

export default MypageRoutes;
