import React, { useState, useEffect } from "react";
import { fetchImageByPdfId } from "../../utils/firebaseUtils"; // Ensure the path is correct

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
    <div>
      {isLoading ? (
        <p>Loading thumbnail...</p>
      ) : imageUrl ? (
        <img src={imageUrl} alt={`${pdfName} thumbnail`} className="img-fluid mb-2" />
      ) : (
        <div className="placeholder-thumbnail mb-2">No Thumbnail Available</div>
      )}
    </div>
  );
};

export default PdfThumbnail;