import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import RequireAdminAuth from "./components/admin/RequireAdminAuth.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import BookingRequests from "./pages/admin/BookingRequests.jsx";
import Reservations from "./pages/admin/Reservations.jsx";

export default function App() {
  return (
    <Routes>
      {/* Layout wraps every page so the navbar/footer never remount on route change */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin panel has its own chrome (no public Navbar/Footer) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <AdminLayout />
          </RequireAdminAuth>
        }
      >
        <Route index element={<BookingRequests />} />
        <Route path="reservations" element={<Reservations />} />
      </Route>
    </Routes>
  );
}