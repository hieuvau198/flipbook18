import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page } from "react-pdf";
import "../../styles/PdfViewer.css"; // Đảm bảo rằng file CSS này đã tồn tại và chứa các quy tắc CSS

function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);
  const flipBookRef = useRef();

  // Callback khi tài liệu PDF được tải thành công
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Hàm render từng trang PDF
  const renderPages = () => {
    const pages = [];

    // Render trang bìa (trang 1)
    pages.push(
      <div key={1} className="page cover">
        {/* Đã xóa chữ "Cover Page" theo yêu cầu */}
      </div>
    );

    // Render các trang theo kiểu lật
    for (let i = 2; i <= numPages; i++) {
      pages.push(
        <div key={i} className={`page`} id={`page${i}`}>
          <div className="front-page">
            <Page pageNumber={i} width={330} />
            <label
              className="next"
              htmlFor={`checkbox-page${i}`}
              onClick={() => handlePageFlip(i)}
            >
              <i className="fas fa-chevron-right"></i>
            </label>
          </div>
          <div className="back-page">
            <img src={`image${i}.jpg`} alt={`Page ${i}`} />
            <label
              className="prev"
              htmlFor={`checkbox-page${i}`}
              onClick={() => handlePageFlip(i)}
            >
              <i className="fas fa-chevron-left"></i>
            </label>
          </div>
        </div>
      );
    }

    return pages;
  };

  // Hàm lật trang
  const handlePageFlip = (i) => {
    const pageElement = document.getElementById(`page${i}`);
    if (pageElement) {
      pageElement.classList.toggle("flipped"); // Thay đổi lớp khi lật
    }
  };

  // Hàm render FlipBook
  const renderFlipBook = () => {
    return (
      <HTMLFlipBook width={350} height={450} ref={flipBookRef}>
        {renderPages()}
      </HTMLFlipBook>
    );
  };

  return (
    <div className="pdf-viewer-container">
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="modal-90w"
        >
          <div className="flipbook-wrapper">{renderFlipBook()}</div>
        </Document>
      ) : (
        <p>No PDF file uploaded.</p>
      )}
    </div>
  );
}

export default PdfViewer;
