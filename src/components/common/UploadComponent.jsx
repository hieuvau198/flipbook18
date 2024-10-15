import React, { useEffect } from "react";
import FileInput from "../../components/forms/FileInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import UploadButton from "../../components/forms/UploadButton";
import BookViewer from "./BookViewer";
import { useHomepageLogic } from "../../hooks/useHomepageLogic";
import { useAuth } from "../../contexts/authContext";
import "../../styles/App.css";

const UploadComponent = () => {
  const {
    file,
    error,
    handleFileChange,
    handleUpload,
    handleLogin,
    userLoggedIn,
    pdfUrl,   // Get the PDF URL from the logic
    closeViewer,  // Get the close function
  } = useHomepageLogic();

  const { role } = useAuth(); // Get the role from auth context

  // Handle "Esc" key to close the viewer
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && pdfUrl) {
        closeViewer();  // Call the closeViewer function when Esc is pressed
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pdfUrl, closeViewer]);  // Effect depends on pdfUrl and closeViewer

  return (
    <div className="bg-black p-8 shadow-md w-full h-full text-white mx-auto flex flex-col justify-center items-center">
      <div className="absolute top-4 right-4">
        {!userLoggedIn && (
          <button
            onClick={handleLogin}
            className="px-4 py-2 font-semibold border border-white text-white hover:bg-white hover:text-black rounded transition-colors"
          >
            Login
          </button>
        )}
      </div>
      <div>
        <h2 className="elementor-heading-title elementor-size-default">
          Try your PDF or images
        </h2>
      </div>
      <FileInput onFileChange={handleFileChange} />
      <ErrorMessage error={error} />
      <UploadButton onUpload={handleUpload} disabled={!file} />

      {/* Conditionally render the BookViewer when a PDF is uploaded */}
      {pdfUrl && (
        <div className="read-pdf-overlay">
          {/* Close Button in Top Right is removed, now controlled by Esc */}
          <div className="read-pdf-container">
            <BookViewer pdfUrl={pdfUrl} className="read-pdf-viewer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
