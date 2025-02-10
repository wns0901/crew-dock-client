import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />  {/* 현재 라우트의 자식 컴포넌트가 여기에 렌더링됨 */}
        </>
    );
};

export default Layout;
