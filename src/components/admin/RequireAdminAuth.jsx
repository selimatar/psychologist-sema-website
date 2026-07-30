import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../../lib/adminApi.js";

export default function RequireAdminAuth({ children }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
