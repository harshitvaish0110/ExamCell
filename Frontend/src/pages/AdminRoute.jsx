import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async (email) => {
    const ParsedEmail = email.replaceAll('"', "");
    try {
      const resp = await fetch(
        `http://localhost:8080/api/admin/${ParsedEmail}`,
        {
          method: "GET",
        },
      );
      if (resp.ok) {
        setIsAdmin(true);
        return;
      }
      setIsAdmin(false);
    } catch (error) {
      console.log(error);
      setIsAdmin(false);
    }
  };

  const handleValidAuth = async (email) => {
    await checkAdmin(email);
    setIsLoading(false);
  };

  const handleInvalidAuth = () => {
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("email", "");
    setIsAdmin(false);
    toast.error("Not Authorized");
    setIsLoading(false);
  };

  const validateToken = async () => {
    let token = sessionStorage.getItem("token");
    let email = sessionStorage.getItem("email");
    if (token && email) {
      try {
        let resp = await fetch("http://localhost:8080/api/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });
        // console.log(resp)
        if (resp.ok) {
          handleValidAuth(email);
          return;
        }
        handleInvalidAuth();
      } catch (err) {
        console.log(err);
        handleInvalidAuth();
      }
    } else {
      handleInvalidAuth();
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return !isLoading && (isAdmin ? children : <Navigate to="/admin" replace />);
};

export default AdminRoute;
