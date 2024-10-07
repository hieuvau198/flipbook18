import React from "react";
import { useNavigate } from "react-router-dom"; 
import SavedPdfList from "../../components/common/SavedPdfList.jsx"; 
import UploadBox from "../../components/common/UploadBox.jsx";

function User() {
  const navigate = useNavigate(); 

  const handlePdfSelect = (pdf) => {
    navigate("/flipbook", { state: { pdfFileUrl: pdf.url, pdfDocId: pdf.id } });
  };

  return (
    <div className="page-background homepage ">
      <UploadBox /> {/* Add the upload box here */}
      <div className="row">
      </div>
      <div>
        <SavedPdfList
          onSelectPdf={handlePdfSelect} 
          onCloseList={() => {}}
        />
      </div>
    </div>
  );
}

export default User;
