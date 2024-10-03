import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page } from "react-pdf";
import "../../styles/PdfViewer.css";

function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);
  const flipBookRef = useRef(null);
  const [showCover, setShowCover] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

<<<<<<< Updated upstream
  const renderCover = () => {
    return (
      <div
        className="cover"
        onClick={() => {
          setShowCover(false);
          if (flipBookRef.current) flipBookRef.current.pageFlip().flipNext();
        }}
      >
=======
  // Hàm render từng trang PDF
  const renderPages = () => {
    const pages = [];

    // Render trang bìa (trang 0)
    pages.push(
      <div
        key={0}
        className="page cover"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "600px",
          border: "2px solid #ccc",
          backgroundColor: "#f0f0f0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Hiển thị nội dung của trang bìa ở đây */}
>>>>>>> Stashed changes
        <Page pageNumber={1} width={500} />
      </div>
    );
  };

<<<<<<< Updated upstream
  const renderPages = () => {
    const pages = [];
    for (let i = 2; i <= numPages; i += 2) {
=======
    // Render các trang theo kiểu lật
    for (let i = 1; i <= numPages; i++) {
>>>>>>> Stashed changes
      pages.push(
        <div key={i} className="page">
          <div className="front-page">
            <Page pageNumber={i} width={500} />
<<<<<<< Updated upstream
=======
            {/* Bỏ qua nút next */}
          </div>
          <div className="back-page">
            <img src={`image${i}.jpg`} alt={`Page ${i}`} />
            {/* Bỏ qua nút prev */}
>>>>>>> Stashed changes
          </div>
          {i + 1 <= numPages && (
            <div className="back-page">
              <Page pageNumber={i + 1} width={500} />
            </div>
          )}
        </div>
      );
    }
    return pages;
  };

<<<<<<< Updated upstream
=======
  // Hàm render FlipBook
  const renderFlipBook = () => {
    return (
      <HTMLFlipBook width={500} height={600} ref={flipBookRef}>
        {renderPages()}
      </HTMLFlipBook>
    );
  };

>>>>>>> Stashed changes
  return (
    <div className="pdf-viewer-container">
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="modal-90w"
        >
<<<<<<< Updated upstream
          {showCover ? (
            renderCover()
          ) : (
            <HTMLFlipBook width={500} height={600} ref={flipBookRef}>
              {renderPages()}
            </HTMLFlipBook>
          )}
=======
          <div className="flipbook-wrapper">
            {/* Hiển thị trang bìa */}
            <div className="cover-wrapper">
              {renderPages().slice(0, 1)} {/* Chỉ hiển thị trang bìa */}
            </div>

            {/* Hiển thị phần còn lại của tài liệu như sách */}
            <div className="flipbook-wrapper">
              {renderFlipBook()} {/* Gọi hàm renderFlipBook */}
            </div>
          </div>
>>>>>>> Stashed changes
        </Document>
      ) : (
        <p>No PDF file uploaded.</p>
      )}
    </div>
  );
}

export default PdfViewer;
