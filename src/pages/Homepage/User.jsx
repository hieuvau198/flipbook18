import React from 'react';
import { useAuth } from '../../contexts/authContext';

const UserDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {currentUser ? (
        <>
          <h1>Welcome, {currentUser.email}</h1>
        </>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
};
export default UserDashboard;
