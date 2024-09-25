import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { fetchSavedPdfById } from "../../utils/firebaseUtils.js";
import '../../styles/share.css'; // Import Share.css

function Share() {
  const location = useLocation();
  const navigate = useNavigate(); 

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [showPdf, setShowPdf] = useState(false);
  const [savedPdfFile, setSavedPdfFile] = useState(null);

  useEffect(() => {
    if (id) {
      handleFetchSavedPdfById(id);
    }
  }, [id]);

  const handleFetchSavedPdfById = async (id) => {
    try {
      const pdfFile = await fetchSavedPdfById(id);
      if (pdfFile) {
        setSavedPdfFile(pdfFile);
        setShowPdf(true);
      } else {
        console.log("PDF not found with id: ", id);
      }
    } catch (error) {
      console.error("Error fetching PDF by ID: ", error);
    }
  };

  const handleNavigateToFlipbook = () => {
    if (savedPdfFile && savedPdfFile.url) {
      navigate("/flipbook", { state: { pdfFile: savedPdfFile.url } });
    }
  };

  const handleCopyLink = () => {
    const shareableLink = window.location.href; // Get the current page URL
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert("Link copied to clipboard!"); // Notify the user
      })
      .catch((error) => {
        console.error("Could not copy link: ", error);
      });
  };

  return (
    <div className="pdf-details-container text-center">
      {showPdf && savedPdfFile ? (
        <div className="card mx-auto" style={{ width: '30rem' }}>
          <div className="card-body">
            <h1 className="card-title">Share This Flipbook</h1> 
            <br />
            
            <h3 className="card-text">
              <strong>Download:</strong>{" "}
              <a href={savedPdfFile.url} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </h3>
            <h3>
              <button className="btn btn-primary" onClick={handleNavigateToFlipbook}>
                Open in Flipbook
              </button>
            </h3>
            <h3>
              <button className="btn btn-secondary" onClick={handleCopyLink}>
                Copy Shared Link
              </button>
            </h3>
          </div>
        </div>
      ) : (
        <p>Loading PDF details...</p>
      )}
    </div>
  );
}

export default Share;
