import { getDocument } from 'pdfjs-dist';
import { db } from "../firebase/firebase";
import { getFirestore, query, where, collection, getDoc, getDocs , doc, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
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

export const fetchSavedPdfByCollection = async (collectionName) => {
  try {
    // Get the documents from the specified collection
    const querySnapshot = await getDocs(collection(db, collectionName));

    // Map through the documents and return their data along with the document ID
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Ensure imageUrl is included in the fetched data
      imageUrl: doc.data().imageUrl || '', // Default to empty string if not set
    }));
  } catch (error) {
    console.error(`Error fetching PDFs from collection: ${collectionName}`, error);
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

export const savePdfFirstPageAsImage = async (pdfFileUrl, pdfId) => {
  try {
    // Load the PDF document
    const pdf = await getDocument(pdfFileUrl).promise;

    // Extract the PDF metadata (including the title)
    const pdfMetadata = await pdf.getMetadata();
    const pdfTitle = pdfMetadata.info.Title || "Untitled PDF"; // Use the title from metadata or default to "Untitled PDF"

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
    const imageStorageRef = ref(storage, `images/${pdfId}_${pdfTitle}.jpg`); // Save the image with the PDF title
    const snapshot = await uploadBytes(imageStorageRef, imageBlob);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(snapshot.ref);

    // Save the image metadata to Firestore
    await addDoc(collection(db, "images"), {
      pdfId: pdfId,           // Link the image to the saved PDF
      pdfTitle: pdfTitle,      // Save the PDF title as metadata
      imageUrl: imageUrl,
      uploadedAt: Timestamp.now(),
    });

    console.log("First page image saved successfully with title: ", pdfTitle);
  } catch (error) {
    console.error("Error extracting or saving first page as image: ", error);
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
  
  await clearStorage();

  const storage = getStorage();
  const storageRef = ref(storage, `${collectionName}/${fileName}`);
  
  const response = await fetch(pdfFile);
  const blob = await response.blob();

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const expiryDate = Timestamp.now().toMillis() + 2 * 60 * 60 * 1000;

    
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

export const deleteCoverPageByPdfFileId = async (pdfFileId) => {
  if (!pdfFileId) {
    console.error("No PDF file ID provided.");
    return;
  }

  try {
    // Step 1: Query the Firestore "images" collection to find the document with the matching pdfId
    const imagesCollectionRef = collection(db, "images");
    const q = query(imagesCollectionRef, where("pdfId", "==", pdfFileId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No image found for the given PDF file ID.");
      return;
    }

    // Step 2: Iterate through documents (in case there are multiple) and delete the image
    querySnapshot.forEach(async (docSnapshot) => {
      const { imageUrl } = docSnapshot.data();
      
      if (!imageUrl) {
        console.error("No image URL found for the cover page.");
        return;
      }

      // Step 3: Delete the image from Firebase Storage
      const storage = getStorage();
      const imageStorageRef = ref(storage, `images/${pdfFileId}.jpg`);

      await deleteObject(imageStorageRef)
        .then(() => {
          console.log("Cover page image deleted from Firebase Storage.");
        })
        .catch((error) => {
          console.error("Error deleting cover page image from Firebase Storage:", error);
        });

      // Step 4: Delete the document from the Firestore "images" collection
      await deleteDoc(docSnapshot.ref)
        .then(() => {
          console.log("Image metadata deleted from Firestore.");
        })
        .catch((error) => {
          console.error("Error deleting image metadata from Firestore:", error);
        });
    });
  } catch (error) {
    console.error("Error during cover page deletion process:", error);
  }
};

export const deletePdfByIdAndCollection = async (pdfFileId, collectionName) => {
  if (!pdfFileId) {
    console.error("No PDF file ID provided.");
    return;
  }

  try {
    // Step 1: Get the document reference from Firestore
    const docRef = doc(db, collectionName, pdfFileId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("Document not found in Firestore.");
      return;
    }

    // Step 2: Retrieve the PDF's name and download URL from the Firestore document
    const { name, url } = docSnap.data(); // It's 'name', not 'fileName'

    if (!url || !name) {
      console.error("Missing data in Firestore: No URL or file name found for the PDF.");
      return;
    }

    // Step 3: Delete the PDF from Firebase Storage using the file name
    const storage = getStorage();
    const storageRef = ref(storage, `${collectionName}/${name}`); // Use 'name' for the storage path
    
    await deleteObject(storageRef)
      .then(() => {
        console.log("File deleted from Firebase Storage.");
      })
      .catch((error) => {
        console.error("Error deleting file from Firebase Storage:", error);
      });

    // Step 4: Delete the document from Firestore
    await deleteDoc(docRef)
      .then(() => {
        console.log("Document successfully deleted from Firestore.");
      })
      .catch((error) => {
        console.error("Error deleting document from Firestore:", error);
      });

  } catch (error) {
    console.error("Error in deletion process:", error);
  }
};

export const clearStorage = async () => {
  const twoHoursAgo = Timestamp.now().toMillis(); // 2 hours ago in milliseconds
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
      const fileRef = ref(storage, `${collectionName}/${fileName}`);
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
