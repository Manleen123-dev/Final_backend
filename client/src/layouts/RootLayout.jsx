import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-apple-cloud text-apple-black transition-colors duration-500 dark:bg-apple-black dark:text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
