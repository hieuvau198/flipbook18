import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";
import { fetchSavedPdfByIdAndCollection, savePdfToFirestore, savePdfToFirestoreTemp } from "../utils/firebaseUtils.js";

export const useHomepageLogic = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);  // Store the uploaded PDF URL
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
        console.log("Starting file upload...");  // Log upload start
        const fileName = "temp_PDF";
        const fileCollection = "temps";
        const base64File = await fileToBase64(file);
        const pdfFileId = await savePdfToFirestoreTemp(base64File, fileName, fileCollection);
        const pdfFileUrl = await fetchSavedPdfByIdAndCollection(pdfFileId, fileCollection);
        console.log("PDF uploaded successfully, URL:", pdfFileUrl);  // Log successful upload
        setPdfUrl(pdfFileUrl.url);  // Set the PDF URL to show in the viewer
      } catch (error) {
        setError("Failed to process the file due to size limit.");
        console.error("File upload failed:", error);  // Log upload failure
      } finally {
        setLoading(false);
      }
    } else {
      setError("No file selected or invalid file type.");
      console.warn("Upload attempt with no file or invalid file type");  // Log warning
    }
  };

  const closeViewer = () => {
    setPdfUrl(null);  // Close the viewer
    console.log("PDF viewer closed");  // Log viewer close
  };

  return {
    file,
    error,
    loading,
    userLoggedIn,
    pdfUrl,  // Expose the PDF URL
    handleFileChange,
    handleUpload,
    closeViewer,  // Expose the close function
  };
};
