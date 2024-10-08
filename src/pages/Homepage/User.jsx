import React from "react";
import { useNavigate } from "react-router-dom"; 
import SavedPdfList from "../../components/common/SavedPdfList.jsx"; 
import UploadBox from "../../components/common/UploadBox.jsx";
import UploadComponent from "../../components/common/UploadComponent.jsx";
import Demo from "../Demo/Demo.jsx";
import Demo2 from "../Demo2/Demo2.jsx";

function User() {
  const navigate = useNavigate(); 

  const handlePdfSelect = (pdf) => {
    navigate("/flipbook", { state: { pdfFileUrl: pdf.url, pdfDocId: pdf.id } });
  };

  return (
    <>
    {/* apply demo 1 */}
    <div className="row">
      <div className="col-lg-12">
      <Demo></Demo>
      </div>
      <div className="col-lg-12">
      {/* <Demo2></Demo2> */}
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
      <Demo2></Demo2>
      </div>
    
    </div>
    {/* apply demo 2 */}
    {/* old content */}
    <div>
      <UploadComponent /> {/* Add the upload box here */}
      <div className="row">
      </div>
      <div className="mt-10">
        <SavedPdfList
          onSelectPdf={handlePdfSelect} 
          onCloseList={() => {}}
        />
      </div>
    </div>
    </>
    
  );
}

export default User;
