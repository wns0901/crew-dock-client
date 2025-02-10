import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatComponent from "./components/ChatComponent";
import LoginContextProvider from "./contexts/LoginContextProvider";
import PostCreateContainer from "./domains/BoardPage/containers/PostCreateContainer";
import PostDetailContainer from "./domains/BoardPage/containers/PostDetailContainer";
import PostEditContainer from "./domains/BoardPage/containers/PostEditiorContainer";
import LoginPage from "./domains/LoginPage/LoginPage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/posts/create" element={<PostCreateContainer/>} />
        <Route path="/posts/:postId/edit" element={<PostEditContainer/>} />
        <Route path="/posts/:postId" element={<PostDetailContainer/>} />
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
