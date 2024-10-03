import { db } from "../firebase/firebase";
import { getFirestore, query, where, collection, getDoc, getDocs , doc, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Importing pdfjs library

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

export const fetchImageByPdfId = async (pdfId) => {
  try {
    // Reference to the 'images' collection in Firestore
    const imagesCollectionRef = collection(db, "images");

    // Create a query to find the image document with the matching pdfId
    const q = query(imagesCollectionRef, where("pdfId", "==", pdfId));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    // Check if we got any results
    if (querySnapshot.empty) {
      throw new Error(`No image found for pdfId: ${pdfId}`);
    }

    // Assuming only one image corresponds to each pdfId, get the first result
    const imageDoc = querySnapshot.docs[0];
    const imageData = imageDoc.data();

    // Return the image URL
    return imageData.imageUrl;
  } catch (error) {
    console.error("Error fetching image: ", error);
    throw error;
  }
};

export const getPdfByUrl = async (pdfUrl) => {
  try {
    const q = query(collection(db, "pdfFiles"), where("url", "==", pdfUrl));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No PDF found with the given URL.");
      return null; 
    }
    const pdfDoc = querySnapshot.docs[0];
    return { id: pdfDoc.id, ...pdfDoc.data() };
  } catch (error) {
    console.error("Error fetching PDF by URL: ", error);
    throw error;
  }
};

export const savePdfFirstPageAsImage = async (pdfFileUrl, pdfId) => {
  try {
    // Load the PDF from the URL
    const pdf = await pdfjsLib.getDocument(pdfFileUrl).promise;

    // Get the first page
    const page = await pdf.getPage(1);

    // Set up a canvas to render the page
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the page onto the canvas
    await page.render({ canvasContext: context, viewport }).promise;

    // Convert the canvas to a Blob (image format)
    const imageBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.8); // Convert to JPEG format
    });

    // Upload the image to Firebase Storage
    const storage = getStorage();
    const imageStorageRef = ref(storage, `images/${pdfId}.jpg`);
    const snapshot = await uploadBytes(imageStorageRef, imageBlob);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Save the image metadata to Firestore
    await addDoc(collection(db, "images"), {
      pdfId: pdfId, // Link the image to the saved PDF
      imageUrl: imageUrl,
      uploadedAt: Timestamp.now(),
    });

    console.log("First page image saved successfully.");
  } catch (error) {
    console.error("Error extracting or saving first page as image: ", error);
    throw error;
  }
};

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

    // Extract and save the first page of the PDF as an image
    await savePdfFirstPageAsImage(downloadURL, docRef.id);

    // Return the document ID of the saved Firestore record
    return docRef.id;
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};

export const savePdfToFirestoreTemp = async (pdfFile, fileName, collectionName) => {
  if (!pdfFile) throw new Error("No PDF file to save.");
  
  //await clearStorage();

  const storage = getStorage();
  const storageRef = ref(storage, `${collectionName}/${fileName}`);
  
  const response = await fetch(pdfFile);
  const blob = await response.blob();

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const expiryDate = Timestamp.now().toMillis();

    
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

export const clearStorage = async () => {
  const twoHoursAgo = Timestamp.now().toMillis() - 2 * 60 * 60 * 1000; // 2 hours ago in milliseconds
  const collectionName = "temps";

  try {
    // Query documents where viewedAt is older than two hours
    const q = query(collection(db, collectionName), where("viewedAt", "<", Timestamp.fromMillis(twoHoursAgo)));
    const querySnapshot = await getDocs(q);

    const storage = getStorage();

    // Loop through each document and delete the corresponding storage file and document
    querySnapshot.forEach(async (doc) => {
      const docData = doc.data();
      const fileName = docData.name;
      const fileRef = ref(storage, `${collectionName}/${doc.id}`);

      try {
        // Delete the file from Firebase Storage
        //await deleteObject(fileRef);

        // Delete the document from Firestore
        await deleteDoc(doc.ref);

        console.log(`Deleted file: ${fileName} and document: ${doc.id}`);
      } catch (error) {
        console.error(`Error deleting file ${fileName} or document ${doc.id}: `, error);
      }
    });

    console.log("Storage and collection cleared for expired files.");
  } catch (error) {
    console.error("Error clearing storage and Firestore collection: ", error);
    throw error;
  }
};
