import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faSave,
  faShare,
  faTimes,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/authContext.jsx";
import { fetchSavedPdfs, savePdfToFirestore, getPdfByUrl } from "../../utils/firebaseUtils";
import PdfViewer from "../../components/common/PdfViewer.jsx";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
import FileNameModal from "../../components/common/FileNameModal";
import "../../styles/UploadButton.css";

function Flipbook() {
  const [pdfFile, setPdfFile] = useState(() => ({ url: localStorage.getItem("pdfFile") }));
  const location = useLocation();
  const navigate = useNavigate();
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, role } = useAuth();

  useEffect(() => {
    if (location.state?.pdfFileUrl) {
      const url = location.state.pdfFileUrl;
      setPdfFile({ url });
      localStorage.setItem("pdfFile", url);
    } else if (!pdfFile.url) {
      navigate("/homepage");
    }
  }, [location.state, pdfFile.url, navigate]);

  const handlePdfSelect = (url) => {
    setPdfFile({ url });
    setShowPdfList(false);
    localStorage.setItem("pdfFile", url);
    navigate('/flipbook', { state: { pdfFileUrl: url } });
  };

  const handleSavePdf = async (fileName) => {
    if (!currentUser) return;

    try {
      await savePdfToFirestore(pdfFile.url, fileName, "pdfFiles");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving PDF: ", error);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("You need to be logged in to bookmark this PDF.");
      return;
    }

    try {
      const userName = currentUser.displayName || "Unknown User";
      console.log("PDF URL being passed:", pdfFile.url);
      const pdfData = await getPdfByUrl(pdfFile.url);

      if (!pdfData) {
        alert("PDF not found with the given URL.");
        return;
      }

      const fileName = pdfData.name || "Unnamed PDF";
      await savePdfToFirestore(pdfFile.url, fileName, userName);
      alert("PDF has been bookmarked successfully.");
    } catch (error) {
      console.error("Error bookmarking PDF: ", error);
      alert("An error occurred while bookmarking the PDF.");
    }
  };

  const handleShare = async () => {
    const fileName = "Shared_PDF";
    try {
      const savedPdfId = await savePdfToFirestore(pdfFile.url, fileName, "shares");
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
            <SavedPdfList onSelectPdf={handlePdfSelect} />
            <button onClick={() => setShowPdfList(false)} className="close-list-button">
              <FontAwesomeIcon icon={faTimes} /> Close List
            </button>
          </>
        ) : (
          <>
            {pdfFile.url ? (
              <>
                <PdfViewer key={pdfFile.url} pdfFile={pdfFile.url} />
                <div className="toolbar">
                  <button onClick={() => setShowPdfList(true)}>
                    <FontAwesomeIcon icon={faFolderOpen} /> View List
                  </button>
                  {role === "admin" ? (
                    <button onClick={() => setIsModalOpen(true)}>
                      <FontAwesomeIcon icon={faSave} /> Save Book
                    </button>
                  ) : (
                    <button onClick={handleBookmark}>
                      <FontAwesomeIcon icon={faBookBookmark} /> Bookmark
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
