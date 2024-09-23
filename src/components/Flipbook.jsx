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
  faBookmark,
  faShare,
  faSave,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import "../Modal.css";
import { db } from "../firebase/firebase"; // Import Firestore
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore"; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage methods

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileNameModal = ({ isOpen, onClose, onSave }) => {
  const [fileName, setFileName] = useState("");

  const handleSave = () => {
    if (fileName) {
      onSave(fileName);
      setFileName(""); // Clear the input
    }
  };

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
      </div>
    </div>
  );
};

function Flipbook() {
  const [numPages, setNumPages] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const location = useLocation();
  const [pdfFile, setPdfFile] = useState(location?.state?.pdfFile || null);
  const flipBookRef = useRef();
  const [zoom, setZoom] = useState(1.0);
  const [savedPdfFiles, setSavedPdfFiles] = useState([]); // Store saved PDFs
  const [showPdfList, setShowPdfList] = useState(false); // Toggle for list view
  const [isModalOpen, setIsModalOpen] = useState(false); // Toggle for file naming modal

  useEffect(() => {
    if (pdfFile) {
      setNumPages(null);
      setPdfPages([]);
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

  // Fetch PDFs from Firestore
  const fetchSavedPdfs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pdfFiles"));
      const pdfFiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedPdfFiles(pdfFiles);
      setShowPdfList(true); // Show list of PDFs
    } catch (error) {
      console.error("Error fetching PDFs: ", error);
    }
  };

  // Handle PDF selection from the list
  const handlePdfSelect = async (url) => {
    setPdfFile(url);
    setShowPdfList(false); // Hide the list after selecting
  };

  // Save PDF to Firestore and Firebase Storage with the provided name
  const savePdfToFirestore = async (fileName) => {
    if (pdfFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `pdfFiles/${fileName}`); // Define path in Storage

      // Convert blob to a file and upload
      const response = await fetch(pdfFile);
      const blob = await response.blob();

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL

        // Save the URL and name to Firestore
        await addDoc(collection(db, "pdfFiles"), {
          name: fileName,
          url: downloadURL,
          viewedAt: Timestamp.now(),
        });
        alert("PDF file saved to Firestore!");
        setIsModalOpen(false); // Close the modal after saving
      } catch (error) {
        console.error("Error saving PDF: ", error);
      }
    } else {
      alert("No PDF file to save.");
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
                className="modal-90w"
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
                <button onClick={fetchSavedPdfs}> {/* Button to view saved PDFs */}
                  <FontAwesomeIcon icon={faFolderOpen} /> View Saved PDFs
                </button>
                <button onClick={() => setIsModalOpen(true)}> {/* Button to save the PDF */}
                  <FontAwesomeIcon icon={faSave} /> Save PDF
                </button>
                <button>
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
                <button>
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </>
          ) : (
            <p>No PDF file selected</p>
          )}
        </>
      )}
      
      {/* File Name Modal */}
      <FileNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={savePdfToFirestore}
      />
    </div>
  );
}

export default Flipbook;
