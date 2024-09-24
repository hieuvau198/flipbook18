import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Fetch saved PDFs from Firestore
export const fetchSavedPdfs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pdfFiles"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching PDFs: ", error);
    throw error;
  }
};

// Save PDF to Firestore and Firebase Storage
export const savePdfToFirestore = async (pdfFile, fileName) => {
  if (!pdfFile) throw new Error("No PDF file to save.");

  const storage = getStorage();
  const storageRef = ref(storage, `pdfFiles/${fileName}`);

  // Convert blob to a file and upload
  const response = await fetch(pdfFile);
  const blob = await response.blob();

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the URL and name to Firestore
    await addDoc(collection(db, "pdfFiles"), {
      name: fileName,
      url: downloadURL,
      viewedAt: Timestamp.now(),
    });

    return { success: true, message: "PDF file saved to Firestore!" };
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};
