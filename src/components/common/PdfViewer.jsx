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

  const renderCover = () => {
    return (
      <div
        className="cover"
        onClick={() => {
          setShowCover(false);
          if (flipBookRef.current) flipBookRef.current.pageFlip().flipNext();
        }}
      >
        <Page pageNumber={1} width={500} />
      </div>
    );
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 2; i <= numPages; i += 2) {
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

  return (
    <div className="pdf-viewer-container">
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="modal-90w"
        >
          {showCover ? (
            renderCover()
          ) : (
            <HTMLFlipBook width={500} height={600} ref={flipBookRef}>
              {renderPages()}
            </HTMLFlipBook>
          )}
        </Document>
      ) : (
        <p>No PDF file uploaded.</p>
      )}
    </div>
  );
}

export default PdfViewer;
