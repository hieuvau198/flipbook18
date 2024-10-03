import React from "react";

const FileInput = ({ onFileChange }) => (
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => onFileChange(e.target.files[0])}
    className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
  />
);

export default FileInput;