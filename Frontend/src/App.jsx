import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/DashboardPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import CertificateRequestsPage from "./pages/CertificateRequestsPage";
import TemplatesPage from "./pages/TemplatesPage";
import GeneratedCertificatesPage from "./pages/GeneratedCertificatesPage";
import History from "./pages/History";
import InputForm from "./pages/InputForm";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./pages/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="exam-cell-theme">
      <Toaster reverseOrder={false} position="top-right" />
      <BrowserRouter>
        {
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <AdminRoute>
                  <ManageUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/certificate-requests"
              element={
                <AdminRoute>
                  <CertificateRequestsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <AdminRoute>
                  <TemplatesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/generated-certificates"
              element={
                <AdminRoute>
                  <GeneratedCertificatesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/history"
              element={
                <AdminRoute>
                  <History />
                </AdminRoute>
              }
            />
            <Route
              path="/inputform"
              element={
                <ProtectedRoute>
                  <InputForm />
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        }
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
