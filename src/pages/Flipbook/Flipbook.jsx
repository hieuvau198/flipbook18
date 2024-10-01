import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faSave,
  faShare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import FileNameModal from "../../components/common/FileNameModal";
import { savePdfToFirestore } from "../../utils/firebaseUtils";
import { useAuth } from "../../contexts/authContext.jsx";
import PdfViewer from "../../components/common/PdfViewer.jsx";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
import "../../styles/UploadButton.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Flipbook() {
  const [pdfFile, setPdfFile] = useState(() => localStorage.getItem("pdfFile"));
  const location = useLocation();
  const navigate = useNavigate();
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, role } = useAuth();

  useEffect(() => {
    // Check if there is a PDF file URL in the location state
    if (location.state?.pdfFileUrl) {
      setPdfFile(location.state.pdfFileUrl);
      localStorage.setItem("pdfFile", location.state.pdfFileUrl);
    } else if (!pdfFile) {
      navigate("/homepage");
    }
  }, [location.state, pdfFile, navigate]);

  const handlePdfSelect = (url) => {
    setPdfFile(url);
    setShowPdfList(false);
    localStorage.setItem("pdfFile", url);
  };

  const handleSavePdf = async (fileName) => {
    if (!currentUser) return;

    try {
      await savePdfToFirestore(pdfFile, fileName, "pdfFiles");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving PDF: ", error);
    }
  };

  const handleShare = async () => {
    const fileName = "Shared_PDF";
    try {
      const savedPdfId = await savePdfToFirestore(pdfFile, fileName, "shares");
      navigate(`/share?id=${savedPdfId}`);
    } catch (error) {
      console.error("Error sharing PDF: ", error);
    }
  };

  return (
    <div className="flipbook-background">
      <div className="flipbook-container">
        {showPdfList ? (
          <>
            {/* Show the SavedPdfList */}
            <SavedPdfList onSelectPdf={handlePdfSelect} />
            {/* Close List button */}
            <button
              onClick={() => setShowPdfList(false)}
              className="close-list-button"
            >
              <FontAwesomeIcon icon={faTimes} /> Close List
            </button>
          </>
        ) : (
          <>
            {pdfFile ? (
              <>
                <PdfViewer pdfFile={pdfFile} />
                <div className="toolbar">
                  <button onClick={() => setShowPdfList(true)}>
                    <FontAwesomeIcon icon={faFolderOpen} /> View List
                  </button>
                  {role === "admin" && (
                    <button onClick={() => setIsModalOpen(true)}>
                      <FontAwesomeIcon icon={faSave} /> Save Book
                    </button>
                  )}
                  <button onClick={handleShare}>
                    <FontAwesomeIcon icon={faShare} /> Share Book
                  </button>
                </div>
              </>
            ) : (
              <p className="no-pdf-message">No Book selected</p>
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
