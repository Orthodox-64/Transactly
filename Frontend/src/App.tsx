import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { SendMoney } from './pages/SendMoney'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/send"
        element={
          <PrivateRoute>
            <SendMoney />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
