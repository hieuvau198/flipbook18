// src/contexts/authContext.js
import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase/firebase"; 

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authCallback, setAuthCallback] = useState(null);
  const [role, setRole] = useState(null); // Track user role (admin/customer/etc.)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await initializeUser(user);
      if (authCallback) {
        authCallback(user);
      }
    });

    return unsubscribe;
  }, [authCallback]);

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

        // Set role and currentUser state with user info and role
        setRole(userRole);
        setCurrentUser({ ...user, role: userRole });
      } else {
        // If no Firestore record, set default role as 'customer'
        setRole("customer");
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
      setRole(null); // Reset role when logged out
    }
  }
  
  // Log currentUser whenever it changes
  useEffect(() => {
    console.log("Current User: ", currentUser);
  }, [currentUser]);

  const setAuthCallbackHandler = (callback) => {
    setAuthCallback(() => callback);
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    role, // Expose the role in context
    setCurrentUser,
    setAuthCallback: setAuthCallbackHandler,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
