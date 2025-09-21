// TokenGuard.jsx
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../lib/api";

const TokenGuard = ({ children }) => {
  const checkTokenValidity = () => {
    // Use the helper function to check authentication status
    // This checks both localStorage and sessionStorage
    return isAuthenticated();
  };

  const clearUserData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
  };

  useEffect(() => {
    // Check token validity periodically (every minute)
    const interval = setInterval(() => {
      if (!checkTokenValidity()) {
        window.location.href = "/login";
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!checkTokenValidity()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default TokenGuard;
