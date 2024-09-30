import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';

const UserDashboard = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Current User in Dashboard: ", currentUser);
  }, [currentUser]);

  return (
    <div>
      {currentUser ? (
        <>
          <h1>Welcome, {currentUser.displayName || "User"}</h1>
        </>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
};

export default UserDashboard;
