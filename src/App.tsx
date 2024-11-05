import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";

import SignUp from "./features/signUp";
import Login from "./features/login";
import ChatPage from "./features/chatPage";
import OtpVerification from "./features/otp_verification";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat-page" element={<ChatPage />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
