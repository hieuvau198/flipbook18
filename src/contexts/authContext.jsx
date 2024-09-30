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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await initializeUser(user);
    });

    return unsubscribe;
  }, []); // No dependencies needed here

  async function initializeUser(user) {
    try {
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
    } catch (error) {
      console.error("Error initializing user: ", error);
    } finally {
      setLoading(false);
    }
  }
  
  // Log currentUser whenever it changes
  useEffect(() => {
    console.log("Current User: ", currentUser);
  }, [currentUser]);

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
