import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSearchPlus,
  faSearchMinus,
  faExpand,
  faDownload,
  faSave,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import FileNameModal from "../../components/common/FileNameModal"; // Modal Component
import { fetchSavedPdfs, savePdfToFirestore } from "../../utils/firebaseUtils"; // Firebase utilities

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Flipbook() {
  const [numPages, setNumPages] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const location = useLocation();

  // Retrieve the Base64 PDF from localStorage using the key "pdfFile"
  const [pdfFile, setPdfFile] = useState(() => localStorage.getItem("pdfFile"));

  const flipBookRef = useRef();
  const [zoom, setZoom] = useState(1.0);
  const [savedPdfFiles, setSavedPdfFiles] = useState([]);
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (pdfFile) {
      setNumPages(null);
      setPdfPages([]);
      localStorage.setItem('pdfFile', pdfFile); // Save PDF to local storage
    }
  }, [pdfFile]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    const pages = Array.from({ length: numPages }, (_, i) => i + 1);
    setPdfPages(pages);
  };

  const goToNextPage = () => {
    flipBookRef.current.pageFlip().flipNext();
  };

  const goToPreviousPage = () => {
    flipBookRef.current.pageFlip().flipPrev();
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = "Document"; // Default download name
    link.click();
  };

  const handleFetchSavedPdfs = async () => {
    try {
      const pdfFiles = await fetchSavedPdfs();
      setSavedPdfFiles(pdfFiles);
      setShowPdfList(true);
    } catch (error) {
      console.error("Error fetching PDFs: ", error);
    }
  };

  const handlePdfSelect = (url) => {
    setPdfFile(url);
    setShowPdfList(false);
  };

  const handleSavePdf = async (fileName) => {
    try {
      await savePdfToFirestore(pdfFile, fileName);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving PDF: ", error);
    }
  };

  return (
    <div className="flipbook-container">
      {showPdfList ? (
        <div className="pdf-list">
          <h3>Select a PDF to View</h3>
          <ul>
            {savedPdfFiles.map((pdf) => (
              <li key={pdf.id}>
                <button onClick={() => handlePdfSelect(pdf.url)}>
                  {pdf.name} - Viewed At: {new Date(pdf.viewedAt.seconds * 1000).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowPdfList(false)}>Close List</button>
        </div>
      ) : (
        <>
          {pdfFile ? (
            <>
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <HTMLFlipBook width={450} height={550} ref={flipBookRef}>
                  {pdfPages.map((pageNumber) => (
                    <div key={pageNumber} className="page">
                      <Page width={450 * zoom} pageNumber={pageNumber} />
                    </div>
                  ))}
                </HTMLFlipBook>
              </Document>

              <div className="toolbar">
                <button onClick={goToPreviousPage} disabled={numPages <= 1}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button onClick={goToNextPage} disabled={numPages <= 1}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <button onClick={handleZoomOut} disabled={zoom <= 0.5}>
                  <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button onClick={handleZoomIn}>
                  <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button onClick={handleFullscreen}>
                  <FontAwesomeIcon icon={faExpand} />
                </button>
                <button onClick={downloadPDF}>
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button onClick={handleFetchSavedPdfs}>
                  <FontAwesomeIcon icon={faFolderOpen} /> View Saved PDFs
                </button>
                <button onClick={() => setIsModalOpen(true)}>
                  <FontAwesomeIcon icon={faSave} /> Save PDF
                </button>
              </div>
            </>
          ) : (
            <p>No PDF file selected</p>
          )}
        </>
      )}

      <FileNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePdf}
      />
    </div>
  );
}

export default Flipbook;
