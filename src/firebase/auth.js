import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password, userData) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the document reference using user.uid
    const userDocRef = doc(db, "users", user.uid);
    
    // Prepare user data to store in Firestore
    const dataToStore = {
      ...userData,
      uid: user.uid,
      email: email,
      role: "customer",
      password: password,
    };

    // Save user data to Firestore
    await setDoc(userDocRef, dataToStore);

    return user; // Return the user object
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { user, role: userData.role };
    } else {
      throw new Error("No such user document!");
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Fetch user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { user, role: userData.role };
    } else {
      throw new Error("No such user document!");
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    return error;
  }
};