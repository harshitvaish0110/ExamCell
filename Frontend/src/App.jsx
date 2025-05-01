import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import InputForm from "./pages/InputForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/History" element={<History/>} />
        <Route path="/inputform" element={<InputForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
