import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    localStorage.removeItem("studentData");
    toast.success("Logged Out Successfully");
  };

  useEffect(() => {
    logout();
  });

  return <Navigate to="/" replace />;
};

export default Logout;
