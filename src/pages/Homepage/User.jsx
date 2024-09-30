// src/pages/User.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SavedPdfList from "../../components/common/SavedPdfList.jsx"; // Import SavedPdfList

function User() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle the PDF selection and navigate to /flipbook
  const handlePdfSelect = (url) => {
    // Navigate to the /flipbook page and pass the selected PDF URL in the state
    navigate("/flipbook", { state: { pdfFileUrl: url } });
  };

  return (
    <div className="page-background homepage flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="user-page">

        {/* Always render the SavedPdfList without a toggle button */}
        <SavedPdfList
          onSelectPdf={handlePdfSelect} // Handle PDF selection and navigate
          onCloseList={() => {}} // You can provide an empty function since we don't need to close the list
        />
      </div>
    </div>
  );
}

export default User;
