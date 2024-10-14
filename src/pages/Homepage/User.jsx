import React from "react";
import { useNavigate } from "react-router-dom";
import SavedPdfList from "../../components/common/SavedPdfList.jsx";
import UploadBox from "../../components/common/UploadBox.jsx";
import UploadComponent from "../../components/common/UploadComponent.jsx";
import Demo from "../Demo/Demo.jsx";
import Demo2 from "../Demo2/Demo2.jsx";
import Demo3 from "../Demo3/Demo 3 .jsx";
import Demo4 from "../Demo4/Demo4.jsx";

function User() {
  const navigate = useNavigate();

  const handlePdfSelect = (pdf) => {
    // navigate("/flipbook", { state: { pdfFileUrl: pdf.url, pdfDocId: pdf.id } });
    navigate(`/book?b=${encodeURIComponent(pdf.id)}`);
  };

  return (
    <>
      {/* apply demo 1 */}
      <div className="row">
        <div className="col-lg-12">
          <Demo></Demo>
        </div>
        <div className="col-lg-12">{/* <Demo2></Demo2> */}</div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Demo2></Demo2>
        </div>
      </div>

      {/* Upload Component */}
      <div>
      <UploadComponent />
      </div>
      {/* Apply Demo 3 */}
      <div className="row">
        <div className="col-lg-12">
          <Demo3 /> {/* Add Demo3 here */}
        </div>
      </div>
      

      {/* old content */}

      <div>
        <div className="mt-10">
          <SavedPdfList onSelectPdf={handlePdfSelect} onCloseList={() => {}} />
        </div>
      </div>

      {/* Apply Demo 4 */}
      <div className="row">
        <div className="col-lg-12">
          <Demo4 /> {/* Add Demo4 here */}
        </div>
      </div>
    </>
  );
}

export default User;
