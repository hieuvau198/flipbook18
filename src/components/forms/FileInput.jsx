import React from "react";

const FileInput = ({ onFileChange }) => (
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => onFileChange(e.target.files[0])}
    className="block mb-4 text-sm text-gray-500 
               file:mr-4 
               file:py-2 
               file:px-10
               file:text-sm 
               file:font-semibold
               file:bg-black-50 
               file:text-black-700 
               hover:file:bg-blue-100
               mx-auto"  // Ensures centering
  />
);


export default FileInput;
