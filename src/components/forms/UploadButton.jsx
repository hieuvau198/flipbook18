import React from "react";

const UploadButton = ({ onUpload, disabled }) => (
  <button
    onClick={onUpload}
    disabled={disabled}
    className={`w-full px-4 py-2 font-semibold text-white rounded 
                ${disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
  >
    Upload and View
  </button>
);

export default UploadButton;
