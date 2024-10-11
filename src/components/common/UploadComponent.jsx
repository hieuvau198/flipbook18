import React from "react";
import FileInput from "../../components/forms/FileInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import UploadButton from "../../components/forms/UploadButton";
import { useHomepageLogic } from "../../hooks/useHomepageLogic";
import { useAuth } from "../../contexts/authContext";

const UploadComponent = () => {
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
        
      </div>
      <div>
      <div class="elementor-element elementor-element-c422140 elementor-widget elementor-widget-heading" data-id="c422140" data-element_type="widget" data-widget_type="heading.default"><div class="elementor-widget-container mb-10"><h2 class="elementor-heading-title elementor-size-default">Try your PDF or images</h2></div></div>
      </div>
      <FileInput onFileChange={handleFileChange} />
      <ErrorMessage error={error} />
      <UploadButton onUpload={handleUpload} disabled={!file} />
    </div>
  );
};

export default UploadComponent;
