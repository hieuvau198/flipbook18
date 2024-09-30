import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

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
    const user = await signInWithEmailAndPassword(email, password);
    return user;
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

    // Prepare userData to store in Firestore
    const userData = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      role: 'customer',
      provider: "google",
    };

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });

    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};


export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    return error;
  }
};
