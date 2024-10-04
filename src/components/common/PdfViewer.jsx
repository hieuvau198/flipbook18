import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page } from "react-pdf";
import "../../styles/PdfViewer.css";

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="Page" ref={ref}>
      {props.children}
    </div>
  );
});

Pages.displayName = 'Pages';

function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);
  const [pageHeight, setPageHeight] = useState(600); // Dynamic page height
  const [pageWidth, setPageWidth] = useState(445);   // Dynamic page width
  const flipBookRef = useRef(null);

  const calculateHeight = (pdfWidth, pdfHeight) => {
    // Tính tỷ lệ của PDF và điều chỉnh chiều cao trang dựa trên chiều rộng cố định
    const ratio = pdfHeight / pdfWidth;
    const newHeight = pageWidth * ratio;
    setPageHeight(newHeight);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (pdfPage) => {
    const { width, height } = pdfPage; // Sửa chỗ này để tránh lỗi
    calculateHeight(width, height);    // Tính chiều cao trang
  };

  const renderPages = () => {
    if (numPages <= 0) return null; // Không có trang nào để render

    return [...Array(numPages).keys()].map((pNum) => (
      <Pages key={pNum} number={pNum + 1}>
        <Page
          pageNumber={pNum + 1}
          width={pageWidth - 5} 
          height={pageHeight -5} 
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onLoadSuccess={onPageLoadSuccess} // Gọi khi trang PDF tải thành công
        />
      </Pages>
    ));
  };

  // Hàm render flipbook
  const renderFlipBook = () => {
    return (
      <HTMLFlipBook
        width={pageWidth}
        height={pageHeight}
        ref={flipBookRef}
      >
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
          <div className="flipbook-wrapper">
            {/* Render toàn bộ cuốn sách lật */}
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
