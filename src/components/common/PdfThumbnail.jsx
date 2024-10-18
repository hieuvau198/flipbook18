import React, { useState, useEffect } from "react";
import { fetchImageByPdfId } from "../../utils/firebaseUtils"; // Ensure the path is correct
import "../../styles/App.css";
const PdfThumbnail = ({ pdfId, pdfName }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const imageUrl = await fetchImageByPdfId(pdfId);
        setImageUrl(imageUrl);
      } catch (error) {
        console.error(`Error fetching image for PDF ID ${pdfId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnail();
  }, [pdfId]);

  return (
    <div className="thumbnail-container">
      {isLoading ? (
        <p>Loading thumbnail...</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={`${pdfName} thumbnail`}
          className="thumbnail-image"
        />
      ) : (
        <div className="placeholder-thumbnail">No Thumbnail Available</div>
      )}
    </div>
  );
};

export default PdfThumbnail;
