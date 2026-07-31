import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../../lib/adminApi.js";

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive ? "bg-terracotta text-white" : "text-charcoal hover:bg-sand"
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-medium text-ink m-0">Yönetim Paneli</p>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/admin" end className={navLinkClass}>
              Talepler
            </NavLink>
            <NavLink to="/admin/reservations" className={navLinkClass}>
              Rezervasyonlar
            </NavLink>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-charcoal transition-colors"
            >
              Çıkış Yap
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}
