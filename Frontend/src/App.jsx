import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/DashboardPage"
import ManageUsersPage from "./pages/ManageUsersPage"
import CertificateRequestsPage from "./pages/CertificateRequestsPage"
import TemplatesPage from "./pages/TemplatesPage"
import GeneratedCertificatesPage from "./pages/GeneratedCertificatesPage"

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="exam-cell-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
          <Route path="/certificate-requests" element={<CertificateRequestsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/generated-certificates" element={<GeneratedCertificatesPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
