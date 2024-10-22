import React, { useState } from "react";
import "../../styles/Modal.css";
const FileNameModal = ({ isOpen, onClose, onSave }) => {
  const [fileName, setFileName] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = () => {
    if (fileName && author && status) {
      onSave(fileName, author, status); // Call onSave with all parameters
      setFileName(""); // Clear the input
      setAuthor(""); // Clear the author input
      setStatus(""); // Clear the status input
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
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author"
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Enter status"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default FileNameModal;
