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

  return (
    <div>
      {showPdf && savedPdfFile ? (
        <div>
          <h1>PDF Details</h1>
          <h3>
            <strong>Name:</strong> {savedPdfFile.name}
          </h3>
          <h3>
            <strong>URL:</strong>{" "}
            <a href={savedPdfFile.url} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </h3>
          <h3>
            <strong>Viewed At:</strong> {new Date(savedPdfFile.viewedAt.seconds * 1000).toLocaleString()}
          </h3>

          <button onClick={handleNavigateToFlipbook}>
            Open in Flipbook
          </button>
        </div>
      ) : (
        <p>Loading PDF details...</p>
      )}
    </div>
  );
}

export default Share;
