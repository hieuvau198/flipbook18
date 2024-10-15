import { getDocument } from "pdfjs-dist";
import { db } from "../firebase/firebase";
import {
  getFirestore,
  query,
  where,
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  increment,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import * as pdfjsLib from "pdfjs-dist/webpack";

export const fetchSavedPdfs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "pdfFiles"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url || "url error",
      name: doc.data().name || "Unnamed", // Fetch 'name' field
      viewedAt: doc.data().viewedAt ? doc.data().viewedAt.toDate() : "Unknown", // Fetch 'viewedAt' field
      author: doc.data().author || "Unknown Author",
      favorites: doc.data().favorites || 0,
      status: doc.data().status || "Active",
      uploader: doc.data().uploader || "Spiderman Upload",
      views: doc.data().views || 0,
      coverPageUrl: doc.data().coverPageUrl || "", // Fetch 'imageUrl' if available
    }));
  } catch (error) {
    console.error("Error fetching PDFs: ", error);
    throw error;
  }
};

export const fetchTopPdfs = async (quantity) => {
  try {
    const pdfQuery = query(
      collection(db, "pdfFiles"),
      orderBy("views", "desc"),
      limit(quantity)
    );

    const querySnapshot = await getDocs(pdfQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url || "url error",
      name: doc.data().name || "Unnamed",
      viewedAt: doc.data().viewedAt ? doc.data().viewedAt.toDate() : "Unknown",
      author: doc.data().author || "Unknown Author",
      favorites: doc.data().favorites || 0,
      status: doc.data().status || "Active",
      uploader: doc.data().uploader || "Spiderman Upload",
      views: doc.data().views || 0,
      coverPageUrl: doc.data().coverPageUrl || "",
    }));
  } catch (error) {
    console.error("Error fetching top PDFs: ", error);
    throw error;
  }
};

export const fetchLatestPdfs = async (quantity) => {
  try {
    const pdfQuery = query(
      collection(db, "pdfFiles"), // Same collection
      orderBy("viewedAt", "desc"), // Order by viewedAt (newest first)
      limit(quantity) // Limit to the specified quantity
    );

    const querySnapshot = await getDocs(pdfQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url || "url error",
      name: doc.data().name || "Unnamed",
      viewedAt: doc.data().viewedAt ? doc.data().viewedAt.toDate() : "Unknown",
      author: doc.data().author || "Unknown Author",
      favorites: doc.data().favorites || 0,
      status: doc.data().status || "Active",
      uploader: doc.data().uploader || "Spiderman Upload",
      views: doc.data().views || 0,
      coverPageUrl: doc.data().coverPageUrl || "",
    }));
  } catch (error) {
    console.error("Error fetching latest PDFs: ", error);
    throw error;
  }
};

export const fetchRandomPdfs = async (quantity) => {
  try {
    const querySnapshot = await getDocs(collection(db, "pdfFiles"));
    const allPdfs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url || "url error",
      name: doc.data().name || "Unnamed",
      viewedAt: doc.data().viewedAt ? doc.data().viewedAt.toDate() : "Unknown",
      author: doc.data().author || "Unknown Author",
      favorites: doc.data().favorites || 0,
      status: doc.data().status || "Active",
      uploader: doc.data().uploader || "Spiderman Upload",
      views: doc.data().views || 0,
      coverPageUrl: doc.data().coverPageUrl || "",
    }));
    const shuffledPdfs = shuffleArray(allPdfs);
    return shuffledPdfs.slice(0, Math.min(quantity, shuffledPdfs.length));
  } catch (error) {
    console.error("Error fetching random PDFs: ", error);
    throw error;
  }
};

export const fetchSavedPdfByCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url || "url error",
      name: doc.data().name || "Unnamed", // Fetch 'name' field
      viewedAt: doc.data().viewedAt ? doc.data().viewedAt.toDate() : "Unknown", // Fetch 'viewedAt' field
      author: doc.data().author || "Unknown Author",
      favorites: doc.data().favorites || 0,
      status: doc.data().status || "Active",
      uploader: doc.data().uploader || "Spiderman Upload",
      views: doc.data().views || 0,
      coverPageUrl: doc.data().coverPageUrl || "", // Fetch 'imageUrl' if available
    }));
  } catch (error) {
    console.error(
      `Error fetching PDFs from collection: ${collectionName}`,
      error
    );
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

export const fetchPdfByCategoryName = async (categoryName) => {
  if (!categoryName) {
    throw new Error("Category name is required.");
  }

  try {
    // Query the 'categories' collection to find the document with the specified category name
    const categoryQuery = query(
      collection(db, "categories"),
      where("name", "==", categoryName)
    );
    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      throw new Error(`No category found with the name: ${categoryName}`);
    }

    // Get the first matching category (assuming category names are unique)
    const categoryDoc = categorySnapshot.docs[0];
    const { pdfIds } = categoryDoc.data();

    if (!pdfIds || pdfIds.length === 0) {
      return []; // No PDFs associated with this category
    }

    // Fetch the PDFs by their IDs
    const pdfFetchPromises = pdfIds.map(async (pdfId) => {
      const pdfDocRef = doc(db, "pdfFiles", pdfId);
      const pdfDoc = await getDoc(pdfDocRef);

      if (pdfDoc.exists()) {
        return {
          id: pdfDoc.id,
          ...pdfDoc.data(), // Include all other fields in the document
        };
      } else {
        console.warn(`PDF with ID ${pdfId} not found`);
        return null;
      }
    });

    // Wait for all PDF fetch promises to resolve and filter out null results
    const pdfFiles = (await Promise.all(pdfFetchPromises)).filter(Boolean);

    return pdfFiles;
  } catch (error) {
    console.error("Error fetching PDFs by category name: ", error);
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
      pdfId: pdfId, // Link the image to the saved PDF
      pdfTitle: pdfTitle, // Save the PDF title as metadata
      imageUrl: imageUrl,
      uploadedAt: Timestamp.now(),
    });

    console.log("First page image saved successfully with title: ", pdfTitle);

    // Return the image URL
    return imageUrl;
  } catch (error) {
    console.error("Error extracting or saving first page as image: ", error);
    throw error;
  }
};

export const savePdfToFirestore = async (
  pdfFileUrl,
  fileName,
  collectionName,
  author = "unknown",
  uploader = "unknown",
  views = 0,
  favorites = 0,
  status = "active"
) => {
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
      author: author || "unknown", // Default to "unknown" if not provided
      uploader: uploader || "unknown", // Default to "unknown" if not provided
      views: views || 0, // Default to 0 if not provided
      dailyViews: 0,
      favorites: favorites || 0, // Default to 0 if not provided
      status: status || "active", // Default to "active" if not provided
    });

    // Extract and save the first page of the PDF as an image
    const coverPageUrl = await savePdfFirstPageAsImage(downloadURL, docRef.id);

    await updateDoc(docRef, {
      coverPageUrl: coverPageUrl, // Add the coverPageUrl field
    });

    // Return the document ID of the saved Firestore record
    return docRef.id;
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};

export const savePdfToFirestoreTemp = async (
  pdfFile,
  fileName,
  collectionName
) => {
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
      expiryDate: expiryDate, // Add expiry date
    });

    return (await docRef).id;
  } catch (error) {
    console.error("Error saving PDF: ", error);
    throw error;
  }
};

export const incrementPdfViews = async (pdfDocId, collectionName) => {
  try {
    const pdfDocRef = doc(db, collectionName, pdfDocId);
    const dailyViewsRef = collection(pdfDocRef, "dailyViews");

    const today = new Date(); // Use Date object directly

    // Increment total views
    await updateDoc(pdfDocRef, {
      views: increment(1),
    });

    // Reference to today's document in the dailyViews sub-collection
    const todayDocRef = doc(dailyViewsRef, today.toISOString().slice(0, 10)); // Use YYYY-MM-DD format

    const todayDoc = await getDoc(todayDocRef);

    if (todayDoc.exists()) {
      // If a document for today exists, increment the views for today
      await updateDoc(todayDocRef, {
        views: increment(1),
      });
    } else {
      // If no document for today, create a new one with the initial view count
      await setDoc(todayDocRef, {
        views: 1,
        date: Timestamp.now(), // Save as a Firestore Timestamp
      });
    }
  } catch (error) {
    console.error("Error updating views: ", error);
    throw error;
  }
};

export const fetchDailyViews = async (pdfDocId) => {
  try {
    const dailyViewsRef = collection(db, `pdfFiles/${pdfDocId}/dailyViews`);
    const querySnapshot = await getDocs(dailyViewsRef);

    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        console.log(data);
        if (data.date) {
          // Check if the date is a Firestore Timestamp
          const date =
            data.date instanceof Timestamp
              ? data.date.toDate().toISOString().split("T")[0]
              : data.date;

          return {
            date: date, // Handle both Firestore Timestamp and string
            views: data.views || 0, // Default to 0 if views are undefined
          };
        } else {
          console.warn(
            `Document ${doc.id} does not contain a valid date field.`
          );
          return null; // Skip this entry if the date is invalid
        }
      })
      .filter((item) => item !== null); // Filter out invalid entries
  } catch (error) {
    console.error("Error fetching daily views: ", error);
    throw error;
  }
};

export const fetchTotalDailyViews = async () => {
  try {
    const pdfs = await fetchSavedPdfs(); // Fetch all PDFs
    const allDailyViewsPromises = pdfs.map((pdf) => fetchDailyViews(pdf.id)); // Fetch daily views for each PDF
    const allDailyViews = await Promise.all(allDailyViewsPromises);

    const totalViewsByDate = {};

    allDailyViews.forEach((dailyViews) => {
      dailyViews.forEach(({ date, views }) => {
        if (!totalViewsByDate[date]) {
          totalViewsByDate[date] = 0;
        }
        totalViewsByDate[date] += views;
      });
    });

    return Object.keys(totalViewsByDate).map((date) => ({
      date,
      views: totalViewsByDate[date],
    }));
  } catch (error) {
    console.error("Error fetching total daily views: ", error);
    throw error;
  }
};

export const updatePdfByIdAndCollection = async (
  pdfId,
  collectionName,
  newName,
  newAuthor,
  newStatus
) => {
  if (!pdfId || !collectionName) {
    throw new Error(
      "pdfId and collectionName are required to update the document."
    );
  }

  try {
    // Get a reference to the document in the specified collection
    const pdfDocRef = doc(db, collectionName, pdfId);

    // Fetch the current document to retrieve existing values
    const pdfDocSnapshot = await getDoc(pdfDocRef);

    if (!pdfDocSnapshot.exists()) {
      throw new Error(
        `Document with ID ${pdfId} does not exist in the ${collectionName} collection.`
      );
    }

    const currentData = pdfDocSnapshot.data(); // Get the current data

    // Update the document with new values, keeping old ones if new values are not provided
    await updateDoc(pdfDocRef, {
      name: newName || currentData.name, // Use current name if newName is not provided
      author: newAuthor || currentData.author, // Use current author if newAuthor is not provided
      status: newStatus || currentData.status, // Use current status if newStatus is not provided
    });

    console.log(
      `Document with ID ${pdfId} successfully updated in the ${collectionName} collection.`
    );
  } catch (error) {
    console.error("Error updating the document: ", error);
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
          console.error(
            "Error deleting cover page image from Firebase Storage:",
            error
          );
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
      console.error(
        "Missing data in Firestore: No URL or file name found for the PDF."
      );
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
    const q = query(
      collection(db, collectionName),
      where("viewedAt", "<", Timestamp.fromMillis(twoHoursAgo))
    );
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
        console.error(
          `Error deleting file ${fileName} or document ${doc.id}: `,
          error
        );
      }
    });
    console.log("Storage and collection cleared for expired files.");
  } catch (error) {
    console.error("Error clearing storage and Firestore collection: ", error);
    throw error;
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

//#region categories
export const saveCategoryToFirestore = async (
  name,
  description,
  pdfIds = []
) => {
  if (!name || !description)
    throw new Error("Category name and description are required.");

  try {
    // Save the category with its associated PDF IDs to Firestore
    const docRef = await addDoc(collection(db, "categories"), {
      name: name,
      description: description,
      pdfIds: pdfIds, // Array of PDF document IDs
      createdAt: Timestamp.now(),
    });

    // Return the document ID of the saved category
    return docRef.id;
  } catch (error) {
    console.error("Error saving category: ", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories")); // Use collection to get a reference
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw error; // Throw error for further handling
  }
};

export const updateCategory = async (id, name, description, pdfIds) => {
  const categoryRef = doc(db, "categories", id);
  try {
    await updateDoc(categoryRef, {
      name,
      description,
      pdfIds, // Ensure this is just a list of IDs, not full objects
    });
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  const categoryRef = doc(db, "categories", id); // Get a reference to the document
  try {
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error; // Throw error for further handling
  }
};

export const fetchCategoriesByPdfId = async (pdfId) => {
  try {
    // Reference to the "categories" collection
    const categoriesRef = collection(db, 'categories');

    // Create a query to find categories where pdfIds array contains the given pdfId
    const q = query(categoriesRef, where('pdfIds', 'array-contains', pdfId));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);
    const categories = [];

    querySnapshot.forEach((doc) => {
      // Push each document data into the categories array
      categories.push({ id: doc.id, ...doc.data() });
    });

    return categories; // Return the array of categories
  } catch (error) {
    console.error("Error fetching categories by PDF ID:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
//#endregion