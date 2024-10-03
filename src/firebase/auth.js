import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);

    const dataToStore = {
      ...userData,
      uid: user.uid,
      email: email,
      role: "customer",
    };

    await setDoc(userDocRef, dataToStore);

    return user;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

export const signIn = async (email, password, setErrorMessage) => {
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
    if (error.code === 'auth/invalid-credential') {
      setErrorMessage("Credential không hợp lệ. Vui lòng kiểm tra và thử lại.");
    } else if (error.code === 'auth/user-not-found') {
      setErrorMessage("Người dùng không tồn tại.");
    } else if (error.code === 'auth/wrong-password') {
      setErrorMessage("Mật khẩu không đúng.");
    } else {
      setErrorMessage("Lỗi: " + error.message);
    }
    console.error("Error signing in: ", error);
    throw error;
  }
};



export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

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