import { Link } from "react-router-dom";

const AdminSideBar = () => {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <h2>관리자페이지</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/admin" style={linkStyle}>
            통계
          </Link>
        </li>
        <li>
          <Link to="/admin/user" style={linkStyle}>
            회원
          </Link>
        </li>
        <li>
          <Link to="/admin/project" style={linkStyle}>
            프로젝트
          </Link>
        </li>
        <li>
          <Link to="/admin/stack" style={linkStyle}>
            기술 스택 관리
          </Link>
        </li>
        <li>
          <Link to="/admin/recruitment" style={linkStyle}>
            프로젝트 모집글
          </Link>
        </li>
        <li>
          <Link to="/admin/posts" style={linkStyle}>
            게시판
          </Link>
        </li>
        <li>
          <Link to="/admin/banners" style={linkStyle}>
            배너관리
          </Link>
        </li>
        {/* <li><Link to="/admin/stackusage" style={linkStyle}>Stack Usage</Link></li> */}
        {/* <li><Link to="/admin/hopeposition" style={linkStyle}>Hope Position Usage</Link></li> */}
      </ul>
    </div>
  );
};

// 링크 스타일링
const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: "16px",
  padding: "10px 0",
  display: "block",
};

export default AdminSideBar;
