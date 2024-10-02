import React, { useState, useEffect } from "react";
import { fetchSavedPdfs, fetchImageByPdfId } from "../../utils/firebaseUtils";
import "../../styles/UploadButton.css";
import PdfThumbnail from "./PdfThumbnail";

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
    <div className="container">
      {isLoading ? (
        <p>Loading PDFs...</p>
      ) : (
        <div className="row">
          {savedPdfFiles.map((pdf) => (
            <div key={pdf.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card">
                <div className="card-body">
                   {/* Show the PDF thumbnail */}
                   <PdfThumbnail pdfId={pdf.id} pdfName={pdf.name} />
                  <h5 className="card-title">{pdf.name}</h5>
                  <p className="card-text">Author: Jason Bourne</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectPdf(pdf.url)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPdfList;
