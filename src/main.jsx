import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatComponent from "./components/ChatComponent";
import LoginPage from "./domains/LoginPage/LoginPage";
import LoginContextProvider from "./contexts/LoginContextProvider";
import ProjectIssuePage from "./domains/ProjectPage/ProjectIssuePage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projectIssue" element={<ProjectIssuePage/>}/>
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
