import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../providers/auth-provider";

export default function GuestRoute() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return null;
  }

  if (user !== null) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
