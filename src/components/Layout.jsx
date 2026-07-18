import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="font-sans text-charcoal leading-relaxed bg-cream overflow-x-hidden">
      <Navbar />
      <div style={{ paddingTop: "var(--navbar-h, 72px)" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}