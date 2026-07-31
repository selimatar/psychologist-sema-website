import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, setToken } from "../../lib/adminApi.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await login(email, password);
      setToken(accessToken);
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    } catch {
      setError("E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-8 flex flex-col gap-5 border border-charcoal/10"
      >
        <h1 className="font-serif text-2xl font-medium text-ink m-0 text-center">
          Yönetim Girişi
        </h1>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">E-posta</label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        {error && <p className="text-sm text-red-600 m-0">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-terracotta text-white py-3.5 rounded-full text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
