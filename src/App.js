import "./styles/App.css";
import './styles/index.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./pages/Homepage/Homepage.jsx";
import FlipBook from "./pages/Flipbook/Flipbook.jsx";
import Share from "./pages/Share/Share.jsx"; // Import the Share component
import { AuthProvider } from "./contexts/authContext.jsx";
import { PdfProvider } from "./contexts/PdfContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <PdfProvider>
        <BrowserRouter>
          <Header />
          <div className="w-full min-h-screen pt-16 flex flex-col">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flipbook"
                element={
                  <ProtectedRoute>
                    <FlipBook />
                  </ProtectedRoute>
                }
              />
              <Route path="/share" element={<Share />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/home" replace />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PdfProvider>
    </AuthProvider>
  );
}

export default App;
