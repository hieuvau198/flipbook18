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
      // Ensure imageUrl is included in the fetched data
      imageUrl: doc.data().imageUrl || '', // Default to empty string if not set
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

export const fetchSavedPdfByIdAndCollection = async (id, collection) => {
  try {
    const pdfDoc = await getDoc(doc(db, collection, id));
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

export const fetchSavedPdfByICReturnUrl = async (id, collection) => {
  try {
    const pdfDoc = await getDoc(doc(db, collection, id));
    if (pdfDoc.exists()) {
      return { url: pdfDoc.url, ...pdfDoc.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF by ID: ", error);
    throw error;
  }
};

export const fetchSavedPdfByUrl = async (url) => {
  try {
    const pdfDoc = await getDoc(doc(db, "pdfFiles", url));
    if (pdfDoc.exists()) {
      return { url: pdfDoc.url, ...pdfDoc.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF by URL: ", error);
    throw error;
  }
};

// Save PDF to Firestore and Firebase Storage
export const savePdfToFirestore = async (pdfFileUrl, fileName, collectionName) => {
  if (!pdfFileUrl) throw new Error("No PDF file URL to save.");
  
  // Initialize Firebase Storage
  const storage = getStorage();
  const storageRef = ref(storage, `${collectionName}/${fileName}`);

  try {
    // Fetch the PDF from the URL
    const response = await fetch(pdfFileUrl);
    const blob = await response.blob(); // Convert the response to a Blob

    // Upload the Blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL for the uploaded PDF
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save metadata (including download URL) to Firestore
    const docRef = await addDoc(collection(db, collectionName), {
      name: fileName,
      url: downloadURL,
      viewedAt: Timestamp.now(),
    });

    // Return the document ID of the saved Firestore record
    return docRef.id;
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};

export const savePdfToFirestoreTemp = async (pdfFile, fileName, collectionName) => {
  if (!pdfFile) throw new Error("No PDF file to save.");
  
  const storage = getStorage();
  const storageRef = ref(storage, `${collectionName}/${fileName}`);
  
  const response = await fetch(pdfFile);
  const blob = await response.blob();

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const expiryDate = Timestamp.now().toMillis() + 60 * 1000;

    
    const docRef = addDoc(collection(db, collectionName), {
      name: fileName,
      url: downloadURL,
      viewedAt: Timestamp.now(),
      expiryDate: expiryDate // Add expiry date
    });

    return (await docRef).id;
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};