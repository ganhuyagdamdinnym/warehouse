import { Navigate } from "react-router-dom";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
