import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";

export const useHomepageLogic = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); 
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
        const base64Pdf = await fileToBase64(file);
        localStorage.setItem("pdfFile", base64Pdf);
        navigate("/flipbook");
      } catch (error) {
        setError("Failed to process the file.");
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
