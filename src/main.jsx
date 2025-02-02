import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes></Routes>
  </BrowserRouter>
);
