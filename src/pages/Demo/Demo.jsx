import React, { useEffect, useState } from "react";

import "../../assets/css/style.css";
import "../../assets/css/vendor.css";
import "../../assets/css/ajax-loader.gif";
import "../../styles/App.css";
import { fetchLatestPdfs } from "../../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const [latestPdfs, setLatestPdfs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPdfFiles = async () => {
      try {
        const latestPdfFiles = await fetchLatestPdfs(4);
        setLatestPdfs(latestPdfFiles);
      } catch (error) {
        console.error("Error fetching latest pdfs: ", error);
      }
    };
    fetchLatestPdfFiles();
  }, []);

  useEffect(() => {
    // Initialize Swiper when the component is mounted
    new window.Swiper(".main-swiper", {
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev",
      },
      loop: true,
      spaceBetween: 50,
      slidesPerView: 1,
    });
  }, []);

  const handleNavigateToBookPage = (pdfFileId) => {
    navigate(`/book?b=${encodeURIComponent(pdfFileId)}`);
  }

  return (
    <section
      id="billboard"
      className="position-relative d-flex align-items-center py-5 bg-light-gray"
      style={{
        backgroundImage: "url(images/joanna-kosinska-1_CMoFsPfso-unsplash.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "800px",
      }}
    >
      <div className="position-absolute end-0 pe-0 pe-xxl-5 me-0 me-xxl-5 swiper-next main-slider-button-next">
        <svg
          className="chevron-forward-circle d-flex justify-content-center align-items-center p-2"
          width="80"
          height="80"
        >
          <use xlinkHref="#alt-arrow-right-outline"></use>
        </svg>
      </div>
      <div className="position-absolute start-0 ps-0 ps-xxl-5 ms-0 ms-xxl-5 swiper-prev main-slider-button-prev">
        <svg
          className="chevron-back-circle d-flex justify-content-center align-items-center p-2"
          width="80"
          height="80"
        >
          <use xlinkHref="#alt-arrow-left-outline"></use>
        </svg>
      </div>

      <div className="swiper main-swiper">
        <div className="swiper-wrapper d-flex align-items-center">
          {latestPdfs.map((pdf) => (
            <div key={pdf.id} className="swiper-slide">
              <div className="container">
                <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                  <div className="col-md-1"></div>
                  <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                    <div className="banner-content">
                      <h2>{pdf.name}</h2>
                      <p>{pdf.author}</p>
                      <a
                        
                        className="button-74" role="button"
                        onClick={() => handleNavigateToBookPage(pdf.id)}
                      >
                        Read
                      </a>
                    </div>
                  </div>
                  <div className="col-md-4 text-center">
                    <div className="image-holder demo1-image-holder" style={{ border: '2px solid black' }}>
                      <img
                        src={pdf.coverPageUrl || "images/default-cover.png"}
                        className="img-fluid"
                        alt={pdf.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Demo;
