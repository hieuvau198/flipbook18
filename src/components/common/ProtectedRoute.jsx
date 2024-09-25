import React from "react";

const ProtectedRoute = ({ children }) => {
  // Không cần kiểm tra đăng nhập, trả về nội dung của trang luôn
  return children;
};

export default ProtectedRoute;
