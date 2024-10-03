import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page } from "react-pdf";
import "../../styles/PdfViewer.css";

function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);
  const flipBookRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Function to render each page of the PDF
  const renderPages = () => {
    const pages = [];

    // Render cover page (page 1)
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
        <Page pageNumber={1} width={500} />
      </div>
    );

    // Render the rest of the pages
    for (let i = 2; i <= numPages; i++) {
      pages.push(
        <div key={i} className="page">
          <div className="front-page">
            <Page pageNumber={i} width={500} />
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

  // Function to render the flipbook
  const renderFlipBook = () => {
    return (
      <HTMLFlipBook width={500} height={600} ref={flipBookRef}>
        {renderPages()}
      </HTMLFlipBook>
    );
  };

  return (
    <div className="pdf-viewer-container">
      {pdfFile ? (
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} className="modal-90w">
          <div className="flipbook-wrapper">
            {/* Render the entire flipbook */}
            {renderFlipBook()}
          </div>
        </Document>
      ) : (
        <p>No PDF file uploaded.</p>
      )}
    </div>
  );
}

export default PdfViewer;
