import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";

function Homepage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for Base64 conversion
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth(); // Check login status from authContext

  // Function to convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64 string
      reader.onerror = reject;
      reader.readAsDataURL(file); // Read file as Base64 string
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType !== "application/pdf") {
        setError("Please select a valid PDF file.");
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile); // Store the file itself, not URL
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true); // Set loading while converting to Base64
        const base64Pdf = await fileToBase64(file); // Convert file to Base64
        localStorage.setItem("pdfFile", base64Pdf); // Store Base64 string in localStorage
        navigate("/flipbook"); // Redirect to /flipbook page
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
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="page-background">
      <div className="homepage flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="absolute top-4 right-4">
          {!userLoggedIn && (
            <button
              onClick={handleLogin}
              className="px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded"
            >
              Login
            </button>
          )}
        </div>

        {/* Page content */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Upload your PDF file
          </h1>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleUpload}
            disabled={!file}
            className={`w-full px-4 py-2 font-semibold text-white rounded 
                      ${file
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
              }`}
          >
            {loading ? "Uploading..." : "Upload and View"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
