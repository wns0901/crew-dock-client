import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatConpent from "./components/ChatConpent";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ChatConpent />} />
    </Routes>
  </BrowserRouter>
);
