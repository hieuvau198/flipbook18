import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faFolderOpen,
  faShare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import FileNameModal from "../../components/common/FileNameModal";
import { fetchSavedPdfs, savePdfToFirestore, incrementPdfViews } from "../../utils/firebaseUtils";
import "../../styles/UploadButton.css";
import { useAuth } from "../../contexts/authContext.jsx"; 
import JqueryPdfViewer from "../../components/common/JqueryPdfViewer.jsx";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Flipbook() {
  const [pdfFile, setPdfFile] = useState(() => localStorage.getItem("pdfFile"));
  const location = useLocation();
  const navigate = useNavigate();
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, role } = useAuth();

  useEffect(() => {
    if (location.state?.pdfFileUrl) {
      const { pdfFileUrl, pdfDocId } = location.state;
      setPdfFile(pdfFileUrl);
      localStorage.setItem("pdfFile", pdfFileUrl);

      // Increment the views for the PDF in Firestore
      incrementPdfViews(pdfDocId, "pdfFiles");
    } else {
      navigate("/homepage");
    }
  }, [location.state, pdfFile, navigate]);

  const handlePdfSelect = (pdf) => {
    setPdfFile(pdf.url);
    setShowPdfList(false);
    localStorage.setItem("pdfFile", pdf.url);
    navigate('/flipbook', { state: { pdfFileUrl: pdf.url, pdfDocId: pdf.id } });
  };
  

  const handleSavePdf = async (fileName, author, status) => {
    if (!currentUser) {
      return;
    }
    try {
      await savePdfToFirestore(pdfFile.url, fileName, "pdfFiles", author, "uploader", 0, 0, status);
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
            <SavedPdfList
              onSelectPdf={handlePdfSelect} // Pass the PDF selection handler
            />
            {/* Close List button */}
            <button onClick={() => setShowPdfList(false)} className="close-list-button">
              <FontAwesomeIcon icon={faTimes} /> Close List
            </button>
          </>
        ) : (
          <>
            {pdfFile ? (
              <>
                <JqueryPdfViewer key={pdfFile} pdfFile={pdfFile} />

                <div className="toolbar">
                  <button onClick={() => setShowPdfList(true)}>
                    <FontAwesomeIcon icon={faFolderOpen} /> View List
                  </button>
                  {role === "admin" && ( // Show Save PDF button only for admin
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
