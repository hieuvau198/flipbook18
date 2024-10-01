import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";
import { fetchSavedPdfByIdAndCollection, savePdfToFirestore, savePdfToFirestoreTemp } from "../utils/firebaseUtils.js";

export const useHomepageLogic = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  // Convert the file to a Base64 URL (data URL) before uploading
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // This result is a base64 URL
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType !== "application/pdf") {
        setError("Please select a valid PDF file.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true);
        const fileName = "temp_PDF"; // Set a default file name
        const fileCollection = "temps"; // Set a default collection to store

        // Convert the file to a Base64 URL before passing it to the savePdfToFirestore function
        const base64File = await fileToBase64(file);

        // Save the base64 file and get its ID from Firestore
        const pdfFileId = await savePdfToFirestoreTemp(base64File, fileName, fileCollection);

        // Fetch the saved PDF by ID and get its download URL
        const pdfFileUrl = await fetchSavedPdfByIdAndCollection(pdfFileId, fileCollection);

        // Navigate to Flipbook and pass the file URL
        navigate("/flipbook", { state: { pdfFileUrl } });
      } catch (error) {
        setError("Failed to process the file because of oversize.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("No file selected or invalid file type.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return {
    file,
    error,
    loading,
    userLoggedIn,
    handleFileChange,
    handleUpload,
    handleLogin,
  };
};