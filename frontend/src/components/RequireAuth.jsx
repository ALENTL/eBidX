import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token? Go to Login immediately
    return <Navigate to="/login" replace />;
  }

  // Token exists? Render the protected page
  return children;
};

export default RequireAuth;
