import { db } from "../firebase/firebase";
import { collection, getDoc, getDocs , doc, addDoc, Timestamp } from "firebase/firestore";
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

export const fetchSavedPdfById = async (id) => {
  try {
    const pdfDoc = await getDoc(doc(db, "pdfFiles", id));
    if (pdfDoc.exists()) {
      return { id: pdfDoc.id, ...pdfDoc.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF by ID: ", error);
    throw error;
  }
};

export const savePdfToFirestore = async (pdfFile, fileName, currentUser) => {
  if (!pdfFile) throw new Error("No PDF file to save.");
  if (!currentUser || !(currentUser.displayName || currentUser.email)) {
    throw new Error("Current user name is not available.");
  }

  const userName = currentUser.displayName || currentUser.email; // Use either displayName or email

  const storage = getStorage();
  const storageRef = ref(storage, `pdfFiles/${userName}/${fileName}`);

  // Convert blob to a file and upload
  const response = await fetch(pdfFile);
  const blob = await response.blob();

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save the URL and name to a subcollection within "pdfFiles" collection
    await addDoc(collection(db, `pdfFiles/${userName}/userPdfs`), {
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
