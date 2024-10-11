import React, { useEffect, useState } from 'react';
import { fetchTopPdfs } from "../../utils/firebaseUtils";
import './Demo2.css';

const Demo2 = () => {
    const [topPdfs, setTopPdfs] = useState([]);

    useEffect(() => {
        const fetchTopPdfFiles = async () => {
            try {
                const topPdfFiles = await fetchTopPdfs(7); // Fetch top 7 PDFs
                setTopPdfs(topPdfFiles); // Store fetched PDFs in state
            } catch (error) {
                console.error("Error fetching top pdfs: ", error);
            }
        };

        fetchTopPdfFiles();
    }, []);

    useEffect(() => {
        var swiper = new window.Swiper(".best-swiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            intitialSlide: 2,
            speed: 600,
            preventClicks: true,
            slidesPerView: "auto",
            coverflowEffect: {
                rotate: 0,
                stretch: 80,
                depth: 350,
                modifier: 1,
                slideShadows: true,
            },
            on: {
                click(event) {
                    swiper.slideTo(this.clickedIndex);
                },
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });

        return () => {
            swiper.destroy(); // Cleanup the swiper instance when the component unmounts
        };
    }, []);

    return (
        <>
            <div className="best-selling-body">
                <div className="best-swiper swiper">
                    <div className="best-swiper-wrapper swiper-wrapper">
                        {topPdfs.map((pdf) => (
                            <div key={pdf.id} className="best-swiper-slide swiper-slide">
                                <img src={pdf.coverPageUrl || '/images/default-cover.png'} alt={pdf.name} />
                                <div className="best-title title">
                                    <span>{pdf.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="swiper-pagination"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-scrollbar"></div>
                </div>
            </div>
        </>
    );
};

export default Demo2;
