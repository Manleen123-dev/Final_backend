import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./contexts/AuthContext";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomeFeedPage from "./pages/HomeFeedPage";
import WatchPage from "./pages/WatchPage";
import ProfilePage from "./pages/ProfilePage";
import ChannelPage from "./pages/ChannelPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({ children }) {
  const { booting, user } = useAuth();

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-apple-cloud text-apple-black dark:bg-apple-black dark:text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-apple-line border-t-apple-blue dark:border-white/[0.15] dark:border-t-white" />
      </div>
    );
  }

  return user ? children : <Navigate replace to="/login" />;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<HomeFeedPage />} />
          <Route path="/watch/:videoId" element={<WatchPage />} />
          <Route path="/channel/:username" element={<ChannelPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
