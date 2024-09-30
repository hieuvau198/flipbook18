import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.role === 'customer') {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
