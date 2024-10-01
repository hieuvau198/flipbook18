import React from "react";
import { useNavigate } from "react-router-dom"; 
import SavedPdfList from "../../components/common/SavedPdfList.jsx"; 
import UploadBox from "../../components/common/UploadBox.jsx";

function User() {
  const navigate = useNavigate(); 

  const handlePdfSelect = (url) => {
    navigate("/flipbook", { state: { pdfFileUrl: url } });
  };

  return (
    <div className="page-background homepage ">
      <UploadBox /> {/* Add the upload box here */}
      <div className="row">
      </div>
      <div>
        <h1 className="text-center mb-4">Popular Books</h1>
        <SavedPdfList
          onSelectPdf={handlePdfSelect} 
          onCloseList={() => {}}
        />
      </div>
    </div>
  );
}

export default User;
