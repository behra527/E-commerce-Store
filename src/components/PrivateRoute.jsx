import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Or any auth token check
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
