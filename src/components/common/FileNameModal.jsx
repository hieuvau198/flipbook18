import React, { useState } from "react";
import "../../styles/Modal.css";

const FileNameModal = ({ isOpen, onClose, onSave }) => {
  const [fileName, setFileName] = useState("");

  const handleSave = () => {
    if (fileName) {
      onSave(fileName);
      setFileName(""); // Clear the input
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Name Your Saved File</h3>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default FileNameModal;
