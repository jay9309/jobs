import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ admin = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate
      to={admin ? "/admin/login" : "/login"}
      replace
      state={{ from: location.pathname }}
    />;
  }
  if (admin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
