import React, { useEffect } from 'react';
import './Demo2.css';


const Demo2 = () => {
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
            // Cleanup function to destroy the swiper instance when the component unmounts
            swiper.destroy();
        };
    }, [])
    

    return (
        <>
        <div className="best-selling-body">
      <div className="best-swiper swiper">
        <div className="best-swiper-wrapper swiper-wrapper">
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item1.png" alt="" />
            <div className="best-title title">
              <span>The Psychology of Money</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item2.png" alt="" />
            <div className="best-title title" >
              <span>The Two Towers</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item3.png" alt="" />
            <div className="best-title title" >
              <span>Goal Planner</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item4.png" alt="" />
            <div className="best-title title" >
              <span>Stupore E Tremori</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide">
            <img src="/images/product-item5.png" alt="" />
            <div className="best-title title" >
              <span>The diary of Anne Frank</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item6.png" alt="" />
            <div className="best-title title" >
              <span>Company of One</span>
            </div>
          </div>
          <div className="best-swiper-slide swiper-slide" >
            <img src="/images/product-item7.png" alt="" />
            <div className="best-title title" >
              <span>Twisted Love</span>
            </div>
          </div>
          
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