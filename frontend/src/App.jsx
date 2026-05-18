import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HealthAssistant from "./pages/HealthAssistant";
import Chats from "./pages/Chats";
import Connect from "./pages/Connect";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default → Redirect to Login */}
        <Route path="/" element={<Navigate to="/auth" />} />

        {/* Auth Page */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Layout */}
        <Route element={<MainLayout />}>
          <Route path="/assistant" element={<HealthAssistant />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}