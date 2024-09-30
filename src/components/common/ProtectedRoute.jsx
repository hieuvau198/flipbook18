import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // Nếu không có người dùng đăng nhập hoặc người dùng là customer, điều hướng về trang chủ
  if (!currentUser || currentUser.role === 'customer') {
    return <Navigate to="/home" replace />;
  }

  // Nếu là admin, điều hướng đến trang admin
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children; // Nếu không điều hướng nào xảy ra, trả về children
};

export default ProtectedRoute;
