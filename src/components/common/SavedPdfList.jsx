// src/components/common/SavedPdfList.jsx
import React, { useState, useEffect } from "react";
import { fetchSavedPdfs } from "../../utils/firebaseUtils";
import "../../styles/UploadButton.css";
const SavedPdfList = ({ onSelectPdf }) => {
    const [savedPdfFiles, setSavedPdfFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchPdfs = async () => {
        try {
          const pdfFiles = await fetchSavedPdfs();
          setSavedPdfFiles(pdfFiles);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching PDFs: ", error);
          setIsLoading(false);
        }
      };
  
      fetchPdfs();
    }, []);
  
    return (
      <div className="pdf-list">
        <h2 className="pdf-list-title">Select a PDF to View</h2>
        {isLoading ? (
          <p>Loading PDFs...</p>
        ) : (
          <ul className="pdf-grid">
            {savedPdfFiles.map((pdf) => (
              <li key={pdf.id} className="pdf-item">
                <div className="pdf-cover">{/* Optional cover image */}</div>
                <div className="pdf-name">
                  {pdf.name} - Viewed At: {new Date(pdf.viewedAt.seconds * 1000).toLocaleString()}
                </div>
                {/* Add a button for selecting the PDF */}
                <button
                  className="select-pdf-button"
                  onClick={() => onSelectPdf(pdf.url)} // Call the onSelectPdf prop when button is clicked
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default SavedPdfList;
