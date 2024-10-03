import React from "react";
import FileInput from "../../components/forms/FileInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import UploadButton from "../../components/forms/UploadButton";
import { useHomepageLogic } from "../../hooks/useHomepageLogic";
import { useAuth } from "../../contexts/authContext";
import Admin from "./Admin.jsx";
import User from "./User.jsx";

function Homepage() {
  const {
    file,
    error,
    userLoggedIn,
    handleFileChange,
    handleUpload,
    handleLogin,
  } = useHomepageLogic();

  const { role } = useAuth(); // Get the role from auth context

  if (role === "admin") {
    return <Admin />; // Render the Admin component if user is admin
  } else {
    return <User />;
  }

  return (
    <div className="page-background homepage flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload your PDF file
        </h1>
        <FileInput onFileChange={handleFileChange} />
        <ErrorMessage error={error} />
        <UploadButton onUpload={handleUpload} disabled={!file} />
      </div>
    </div>
  );
}

export default Homepage;
