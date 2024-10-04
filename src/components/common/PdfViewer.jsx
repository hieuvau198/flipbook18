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

function PdfViewer({ pdfFile, isSinglePage }) {
  const [numPages, setNumPages] = useState(0);
  const [pageHeight, setPageHeight] = useState(600);
  const [pageWidth, setPageWidth] = useState(445);
  const flipBookRef = useRef(null);

  const calculateHeight = (pdfWidth, pdfHeight) => {
    const ratio = pdfHeight / pdfWidth;
    const newHeight = pageWidth * ratio;
    setPageHeight(newHeight);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (pdfPage) => {
    const { width, height } = pdfPage;
    calculateHeight(width, height);
  };

  const renderPages = () => {
    if (numPages <= 0) return null;

    const pagesArray = [];

    // Render trang đầu tiên (trang bìa) ở chế độ single page
    if (isSinglePage) {
      pagesArray.push(
        <Pages key={0} number={1}>
          <Page
            pageNumber={1}
            width={pageWidth - 2}
            height={pageHeight - 10}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Pages>
      );
    }

    // Render các trang sau ở chế độ double page
    for (let i = isSinglePage ? 2 : 1; i <= numPages; i += 2) {
      pagesArray.push(
        <Pages key={i} number={i}>
          <Page
            pageNumber={i}
            width={pageWidth - 2}
            height={pageHeight - 10}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Pages>
      );

      if (i + 1 <= numPages) {
        pagesArray.push(
          <Pages key={i + 1} number={i + 1}>
            <Page
              pageNumber={i + 1}
              width={pageWidth - 2}
              height={pageHeight - 10}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
            />
          </Pages>
        );
      }
    }

    // Nếu tổng số trang là lẻ và đang ở chế độ double page, thêm trang trống
    if (numPages % 2 !== 0 && !isSinglePage) {
      pagesArray.push(<Pages key="blank" />);
    }

    return pagesArray;
  };

  const renderFlipBook = () => {
    return (
      <HTMLFlipBook
        width={pageWidth}
        height={pageHeight}
        ref={flipBookRef}
        size="fixed"  // Không cần dùng single hay double ở đây, chỉ dùng fixed hoặc stretch
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
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
          <div className={isSinglePage ? "single-page-wrapper" : "flipbook-wrapper"}>
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
