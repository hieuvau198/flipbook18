import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchSavedPdfById } from "../utils/firebaseUtils.js";

function Share() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [showPdf, setShowPdf] = useState(false);
  const [savedPdfFile, setSavedPdfFile] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (id) {
      handleFetchSavedPdfById(id);
    } else {
      setLoading(false); // Set loading to false if no ID
    }
  }, [id]);

  const handleFetchSavedPdfById = async (id) => {
    try {
      const pdfFile = await fetchSavedPdfById(id);
      if (pdfFile) {
        setSavedPdfFile(pdfFile);
        setShowPdf(true);
      } else {
        console.log("PDF not found with id:", id);
      }
    } catch (error) {
      console.error("Error fetching PDF by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JS Date
    return date.toLocaleString('en-US', { timeZoneName: 'short' });
  };

  const handleNavigateToFlipbook = () => {
    // Add navigation logic here if you want to navigate to the Flipbook view
    console.log("Navigating to Flipbook");
  };

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading PDF details...</p>
      ) : id ? (
        <>
          {showPdf && savedPdfFile ? (
            <div
              className="text-center p-10 relative overflow-hidden bg-cover bg-fixed"
              style={{
                backgroundImage:
                  "url('http://www.autodatz.com/wp-content/uploads/2017/05/Old-Car-Wallpapers-Hd-36-with-Old-Car-Wallpapers-Hd.jpg')",
                borderBottomLeftRadius: "85% 30%",
                borderBottomRightRadius: "85% 30%",
              }}
            >
              <div className="w-full h-full p-12 text-white shadow-lg bg-gradient-to-r from-purple-500/70 to-orange-400/70">
                <h1 className="font-dancing-script text-6xl mb-8">PDF Details</h1>
                <h3 className="font-open-sans text-lg mb-6">
                  <strong>Name:</strong> {savedPdfFile.name}
                </h3>
                <h3 className="font-open-sans text-lg mb-6">
                  <strong>URL:</strong>{" "}
                  <a
                    href={savedPdfFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View PDF
                  </a>
                </h3>
                <h3 className="font-open-sans text-lg mb-6">
                  <strong>Viewed At:</strong>{" "}
                  {formatDate(savedPdfFile.viewedAt)}
                </h3>

                <button
                  onClick={handleNavigateToFlipbook}
                  className="border-none outline-none py-2 px-6 rounded-full text-gray-700 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 mb-12"
                >
                  Open in Flipbook
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center">No PDF found with the given ID.</p>
          )}
        </>
      ) : (
        <h1 className="text-center">No ID provided</h1>
      )}
    </div>
  );
}

export default Share;
