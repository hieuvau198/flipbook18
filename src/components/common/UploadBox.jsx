// src/components/UploadBox.jsx
import React from "react";
import FileInput from "../../components/forms/FileInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import UploadButton from "../../components/forms/UploadButton";
import { useHomepageLogic } from "../../hooks/useHomepageLogic";
import { useAuth } from "../../contexts/authContext";

const UploadBox = () => {
  const {
    file,
    error,
    handleFileChange,
    handleUpload,
    handleLogin,
    userLoggedIn,
  } = useHomepageLogic();

  const { role } = useAuth(); // Get the role from auth context

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mb-4 mt-4">
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
      <FileInput onFileChange={handleFileChange} />
      <ErrorMessage error={error} />
      <UploadButton onUpload={handleUpload} disabled={!file} />
    </div>
  );
};

export default UploadBox;
