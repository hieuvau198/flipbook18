import React, { useState, useEffect } from "react";
import "../../styles/UploadButton.css";
import PdfThumbnail from "./PdfThumbnail";
import "../../styles/App.css";

const SavedPdfList = ({ pdfFiles, onSelectPdf }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pdfFiles && pdfFiles.length > 0) {
      setIsLoading(false);
    }
  }, [pdfFiles]);

  return (
    <div className="container">
      {isLoading ? (
        <p>Loading PDFs...</p>
      ) : (
        <div className="row">
          {pdfFiles.map((pdf) => (
            <div key={pdf.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card">
                <div className="card-body">
                  {/* Show the PDF thumbnail */}
                  <PdfThumbnail pdfId={pdf.id} pdfName={pdf.name} />
                  <h5 className="card-title">{pdf.name}</h5>
                  <p className="card-text">Author: {pdf.author}</p>
                  <div className="flex justify-center items-center">
                    <button
                      className="btn btn-primary active"
                      onClick={() => onSelectPdf(pdf)}
                    >
                      View Flipbook
                    </button>
                  </div>
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
