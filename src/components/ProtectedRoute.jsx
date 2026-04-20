import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute token:", token);

  if (!token) {
    console.log("No token, redirecting ❌");
    return <Navigate to="/" />;
  }

  console.log("Access granted ✅");

  return children;
};

export default ProtectedRoute;