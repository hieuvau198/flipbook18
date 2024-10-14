import React from "react";
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
    pdfUrl,  // Get the PDF URL from the logic
    closeViewer,  // Get the close function
  } = useHomepageLogic();

  const { role } = useAuth(); // Get the role from auth context

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
          {/* Close Button in Top Right */}
          <button
            className="read-pdf-close-button"
            onClick={closeViewer}
          >
            ✕
          </button>
          <div className="read-pdf-container">
            <BookViewer initialUrl={pdfUrl} className="read-pdf-viewer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;