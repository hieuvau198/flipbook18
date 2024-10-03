import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";

function User() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái cho từ khóa tìm kiếm

  const handlePdfSelect = (url) => {
    navigate("/flipbook", { state: { pdfFileUrl: url } });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Cập nhật từ khóa tìm kiếm
  };

  return (
    <div className="page-background">
      {/* Ô tìm kiếm */}
      <div className="search-container text-center mb-4">
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={handleSearchChange} // Xử lý sự kiện khi người dùng gõ
          className="search-input"
        />
      </div>


      <div>
        <h1 className="text-center mb-4">Popular Books</h1>
        <SavedPdfList
          onSelectPdf={handlePdfSelect}
          searchTerm={searchTerm} // Truyền searchTerm vào SavedPdfList
        />
      </div>
    </div>
  );
}

export default User;
