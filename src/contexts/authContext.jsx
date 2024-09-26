// src/contexts/authContext.js
import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase"; // Ensure this path is correct
import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore
import { db } from "../firebase/firebase"; // Import Firestore instance

const AuthContext = React.createContext();

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await initializeUser(user);
    });
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      // Determine if the user signed in using email/password
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      // Determine if the user signed in using Google
      const isGoogle = user.providerData.some(
        (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      );
      setIsGoogleUser(isGoogle);

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid); // Reference to Firestore document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role || "customer"; // Default role is 'customer' if not found

        // Set currentUser state with user info and role
        setCurrentUser({ ...user, role: userRole });
      } else {
        // If no Firestore record, set default role as 'customer'
        setCurrentUser({ ...user, role: "customer" });
      }

      // Set user as logged in
      setUserLoggedIn(true);
    } else {
      // Reset all states if no user is authenticated
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    }

    // Set loading state to false after processing user data
    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
