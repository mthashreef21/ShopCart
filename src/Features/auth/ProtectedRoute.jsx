import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "./authService";

export default function ProtectedRoute() {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}