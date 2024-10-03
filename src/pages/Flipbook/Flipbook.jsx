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
  faTimes,
  faBookBookmark,
} from "@fortawesome/free-solid-svg-icons";
import FileNameModal from "../../components/common/FileNameModal";
import { fetchSavedPdfs, savePdfToFirestore, getPdfByUrl } from "../../utils/firebaseUtils";
import "../../styles/UploadButton.css";
import { useAuth } from "../../contexts/authContext.jsx";
import PdfViewer from "../../components/common/PdfViewer.jsx";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Flipbook() {
  //const [pdfFile, setPdfFile] = useState(() => localStorage.getItem("pdfFile"));
  const [pdfFile, setPdfFile] = useState(() => ({ url: localStorage.getItem("pdfFile") }));
  const location = useLocation();
  const navigate = useNavigate();
  const [showPdfList, setShowPdfList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, role } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");


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
    if (!currentUser) {
      return;
    }
    try {
      await savePdfToFirestore(pdfFile.url, fileName, "pdfFiles");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving PDF: ", error);
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

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("You need to be logged in to bookmark this PDF.");
      return;
    }

    try {
      const userName = currentUser.email || "Unknown User";
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

  return (
    <div className="flipbook-background">
      <div className="flipbook-container">
        {showPdfList ? (
          <>
            <input
              type="text"
              placeholder="Search for PDFs"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                console.log(e.target.value); // In giá trị từ khóa tìm kiếm
              }}
              className="search-bar"
            />
            <SavedPdfList
              onSelectPdf={handlePdfSelect} // Pass the PDF selection handler
              searchKeyword={searchKeyword}
            />
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
              <p className="no-pdf-message text-white text-2xl text-center">No Book selected</p>
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