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
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", ), {
      ...userData,
      uid: user.user.uid,
      email: email,
      password: password,
      role: "customer",
    });
    return user.user;
  } catch (error) {
    return error;
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
