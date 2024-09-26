import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { useLocation, useNavigate } from "react-router-dom";
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
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import FileNameModal from "../../components/common/FileNameModal";
import { fetchSavedPdfs, savePdfToFirestore } from "../../utils/firebaseUtils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Flipbook() {
  const [numPages, setNumPages] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState(() => localStorage.getItem("pdfFile"));

  const flipBookRef = useRef();
  const [zoom, setZoom] = useState(1.0);
  const [savedPdfFiles, setSavedPdfFiles] = useState([]);
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Retrieve the pdfFileUrl from navigation state or localStorage
    if (location.state?.pdfFileUrl) {
      setPdfFile(location.state.pdfFileUrl);
      localStorage.setItem("pdfFile", location.state.pdfFileUrl); // Persist the file URL
    } else if (!pdfFile) {
      // If no file found, redirect or show an error
      navigate("/homepage");
    }
  }, [location.state, pdfFile, navigate]);

  useEffect(() => {
    if (pdfFile) {
      setNumPages(null);  // Reset number of pages
      setPdfPages([]);    // Reset the array of PDF pages
    }
  }, [pdfFile]);

  // When the document is loaded, set the number of pages
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
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2.0));  // Limit max zoom to 2.0
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));  // Limit min zoom to 0.5
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
    link.href = pdfFile;  // Use the URL of the PDF
    link.download = "Document";  // Default download name
    link.click();
  };

  const handleFetchSavedPdfs = async () => {
    try {
      const pdfFiles = await fetchSavedPdfs();  // Fetch saved PDFs
      setSavedPdfFiles(pdfFiles);
      setShowPdfList(true);
    } catch (error) {
      console.error("Error fetching PDFs: ", error);
    }
  };

  const handlePdfSelect = (url) => {
    setPdfFile(url);
    setShowPdfList(false);
    localStorage.setItem("pdfFile", url); // Persist the file URL
    location.state.pdfFileUrl = url;

  };

  const handleSavePdf = async (fileName) => {
    try {
      await savePdfToFirestore(pdfFile.url, fileName, "pdfFiles");
      setIsModalOpen(false);  // Close modal after saving
    } catch (error) {
      console.error("Error saving PDF: ", error);
    }
  };

  // Share function to save PDF and navigate to Share page
  const handleShare = async () => {
    const fileName = "Shared_PDF";  // Set a default file name
    try {
      const savedPdfId = await savePdfToFirestore(pdfFile, fileName, "shares");
      navigate(`/share?id=${savedPdfId}`);  // Navigate to Share page with saved PDF ID
    } catch (error) {
      console.error("Error sharing PDF: ", error);
    }
  };

  return (
    <div className="flipbook-background">
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
            <button className="close-list-button" onClick={() => setShowPdfList(false)}>
              <span>Close List</span>
            </button>
          </div>
        ) : (
          <>
            {pdfFile ? (
              <>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
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
                  <button onClick={handleShare}>
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
              </>
            ) : (
              <p className="no-pdf-message">No PDF file selected</p>
            )}
          </>
        )}

        <FileNameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePdf}
        />
      </div>
    </div>
  );
}

export default Flipbook;
