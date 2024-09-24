import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchSavedPdfById } from "../utils/firebaseUtils.js";

function Share() {
  // Get the current location (URL)
  const location = useLocation();

  // Extract query parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  // Get specific query params (like `id`)
  const id = searchParams.get("id");
  const [showPdf, setShowPdf] = useState(false);
  const [savedPdfFile, setSavedPdfFile] = useState(null);

  // Fetch the PDF data by ID when the component mounts
  useEffect(() => {
    if (id) {
      handleFetchSavedPdfById(id);
    }
  }, [id]);

  const handleFetchSavedPdfById = async (id) => {
    try {
      const pdfFile = await fetchSavedPdfById(id);
      if (pdfFile) {
        setSavedPdfFile(pdfFile); // Đưa file tìm được vào state
        setShowPdf(true);
      } else {
        console.log("PDF not found with id: ", id);
      }
    } catch (error) {
      console.error("Error fetching PDF by ID: ", error);
    }
  };

  // Function to format the viewedAt timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZoneName: 'short' });
  };

  return (
    <div>
      {/* Conditionally render content based on query param */}
      {id ? (
        <h1>ID is {id}</h1>
      ) : (
        <h1>No ID provided</h1>
      )}

      {/* Conditionally render the PDF information */}
      {showPdf && savedPdfFile ? (
        <div>
          <h2>PDF Details:</h2>
          <p><strong>Name:</strong> {savedPdfFile.name}</p>
          <p><strong>URL:</strong> <a href={savedPdfFile.url} target="_blank" rel="noopener noreferrer">View PDF</a></p>
          <p><strong>Viewed At:</strong> {formatDate(savedPdfFile.viewedAt)}</p>
        </div>
      ) : (
        <p>Loading PDF details...</p>
      )}
    </div>
  );
}

export default Share;
