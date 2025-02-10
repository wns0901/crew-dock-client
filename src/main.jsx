import { Provider } from "react-redux";
import { myStore } from "./containers/store";
import { createRoot } from "react-dom/client";
import LoginPage from "./domains/LoginPage/LoginPage";
import ChatComponent from "./components/chat/ChatComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./contexts/LoginContextProvider";
import SampleIndex from "./SampleIndex";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={myStore}>
      <LoginContextProvider>
        <ChatComponent />
        <Routes>
          <Route path="/" element={<SampleIndex />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </LoginContextProvider>
    </Provider>
  </BrowserRouter>
);
