import React from "react";
import "../../styles/UploadButton.css";
const UploadButton = ({ onUpload, disabled }) => (
  <button
    onClick={onUpload}
    disabled={disabled}
    className={`btn ${disabled ? "disabled" : ""}`}
  >
    Upload and View
  </button>
);

export default UploadButton;
