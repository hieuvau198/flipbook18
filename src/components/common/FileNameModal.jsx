import React, { useState, useEffect } from "react";
import "../../styles/Modal.css";

const FileNameModal = ({ isOpen, onClose, onSave, onBack }) => {
  const [fileName, setFileName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false); // Trạng thái thông báo

  const handleSave = () => {
    if (fileName) {
      onSave(fileName);
      setFileName(""); // Xóa input sau khi lưu
      setSaveSuccess(true); // Kích hoạt thông báo lưu thành công
    }
  };

  useEffect(() => {
    let timer;
    if (saveSuccess) {
      // Tự động ẩn thông báo sau 3 giây
      timer = setTimeout(() => setSaveSuccess(false), 3000);
    }
    return () => clearTimeout(timer); // Xóa bộ hẹn giờ khi component unmount
  }, [saveSuccess]);

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

        {/* Hiển thị thông báo lưu thành công */}
        {saveSuccess && (
          <>
            <p className="success-message">Flipbook save successful!</p>
            <button onClick={onBack}>Back to PDF List</button> {/* Nút quay lại */}
          </>
        )}
      </div>
    </div>
  );
};

export default FileNameModal;
