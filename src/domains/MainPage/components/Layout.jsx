import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";

const Layout = () => {
    const location = useLocation();

    // ❌ Footer를 숨길 페이지 리스트
    const hideFooterRoutes = [
        "/mypage",
        "/mypage/projects",
        "/mypage/scraps",
        "/mypage/posts",
        "/mypage/portfolios",
        "/mypage/sidebar",
        "/projects"
    ];

    // ❌ 현재 URL이 hideFooterRoutes에 포함되면 Footer 숨김
    const shouldShowFooter = !hideFooterRoutes.some(route => location.pathname.startsWith(route));

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh" // ✅ 전체 페이지 높이를 최소 100vh로 설정
        }}>
            <Header />
            <div style={{ flex: 1 }}> {/* ✅ 컨텐츠가 Footer 위로 밀리지 않도록 */}
                <Outlet />
            </div>
            {shouldShowFooter && <Footer />}
        </div>
    );
};

export default Layout;
