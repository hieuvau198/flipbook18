import React from "react";
import "../../styles/UploadButton.css";

const UploadButton = ({ onUpload, disabled }) => (
  <button
    onClick={onUpload}
    disabled={disabled}
    className={`c-button c-button--gooey ${disabled ? "disabled" : ""}`}
  >
    Upload and View
    <span className="c-button__blobs">
      <div></div>
      <div></div>
      <div></div>
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  </button>
);

export default UploadButton;