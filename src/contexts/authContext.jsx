// src/contexts/authContext.js
import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase"; 
import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase/firebase"; 

// Exporting AuthContext so it can be used in other components
export const AuthContext = React.createContext(); 

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
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      const isGoogle = user.providerData.some(
        (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      );
      setIsGoogleUser(isGoogle);

      const userDocRef = doc(db, "users", user.uid); 
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role || "customer"; 

        setCurrentUser({ ...user, role: userRole });
      } else {
        setCurrentUser({ ...user, role: "customer" });
      }

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    }

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
