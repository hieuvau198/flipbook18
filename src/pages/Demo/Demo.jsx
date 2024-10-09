import React, { useEffect } from 'react';
import '../../assets/css/style.css';
import '../../assets/css/vendor.css';
import '../../assets/css/ajax-loader.gif';
import "../../styles/Demo.css";

const bestSellerBooks = [
  { id: 1, title: "The Fine Print", author: "Lauren Asher", price: "$20", image: "images/book1.jpg" },
  { id: 2, title: "How Innovation Works", author: "Matt Ridley", price: "$25", image: "images/book2.jpg" },
  { id: 3, title: "Your Heart is the Sea", author: "Nikita Gill", price: "$18", image: "images/book3.jpg" },
  { id: 4, title: "The Silent Patient", author: "Alex Michaelides", price: "$22", image: "images/book4.jpg" },
  { id: 5, title: "Where the Crawdads Sing", author: "Delia Owens", price: "$19", image: "images/book5.jpg" },
  { id: 6, title: "Educated", author: "Tara Westover", price: "$24", image: "images/book6.jpg" },
  { id: 7, title: "Becoming", author: "Michelle Obama", price: "$28", image: "images/book7.jpg" },
  { id: 8, title: "The Midnight Library", author: "Matt Haig", price: "$21", image: "images/book8.jpg" },
  { id: 9, title: "Atomic Habits", author: "James Clear", price: "$17", image: "images/book9.jpg" },
  { id: 10, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", price: "$16", image: "images/book10.jpg" },
];
const BestSellerBooks = () => {
  return (
    <section id="best-seller-books" className="bg-light-gray py-5">
      <div className="container">
        <h2 className="text-center mb-5">Best Seller Books</h2>
        <div className="row">
          {bestSellerBooks.map((book) => (
            <div key={book.id} className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">Author: {book.author}</p>
                  <p className="card-text">Price: {book.price}</p>
                  <a href="#" className="btn btn-primary">Buy Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Demo = () => {
  useEffect(() => {
    // Initialize Swiper when the component is mounted
    new window.Swiper('.main-swiper', {
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      loop: true,
      spaceBetween: 50,
      slidesPerView: 1,
    });
  }, []);

  return (
    <>
      <section
        id="billboard"
        className="position-relative d-flex align-items-center py-5 bg-light-gray"
        style={{
          backgroundImage: 'url(images/banner-image-bg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '800px',
        }}
      >
        <div className="position-absolute end-0 pe-0 pe-xxl-5 me-0 me-xxl-5 swiper-next main-slider-button-next">
          <svg className="chevron-forward-circle d-flex justify-content-center align-items-center p-2" width="80" height="80">
            <use xlinkHref="#alt-arrow-right-outline"></use>
          </svg>
        </div>
        <div className="position-absolute start-0 ps-0 ps-xxl-5 ms-0 ms-xxl-5 swiper-prev main-slider-button-prev">
          <svg className="chevron-back-circle d-flex justify-content-center align-items-center p-2" width="80" height="80">
            <use xlinkHref="#alt-arrow-left-outline"></use>
          </svg>
        </div>

        <div className="swiper main-swiper">
          <div className="swiper-wrapper d-flex align-items-center">
            {/* First Slide */}
            <div className="swiper-slide">
              <div className="container">
                <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                  <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                    <div className="banner-content">
                      <h2>The Fine Print Book Collection</h2>
                      <p>Best Offer Save 30%. Grab it now!</p>
                      <a href="index.html" className="btn mt-3">Shop Collection</a>
                    </div>
                  </div>
                  <div className="col-md-6 text-center">
                    <div className="image-holder">
                      <img src="images/banner-image2.png" className="img-fluid" alt="banner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Slide */}
            <div className="swiper-slide">
              <div className="container">
                <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                  <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                    <div className="banner-content">
                      <h2>How Innovation works</h2>
                      <p>Discount available. Grab it now!</p>
                      <a href="index.html" className="btn mt-3">Shop Product</a>
                    </div>
                  </div>
                  <div className="col-md-6 text-center">
                    <div className="image-holder">
                      <img src="images/banner-image1.png" className="img-fluid" alt="banner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Slide */}
            <div className="swiper-slide">
              <div className="container">
                <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                  <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                    <div className="banner-content">
                      <h2>Your Heart is the Sea</h2>
                      <p>Limited stocks available. Grab it now!</p>
                      <a href="index.html" className="btn mt-3">Shop Collection</a>
                    </div>
                  </div>
                  <div className="col-md-6 text-center">
                    <div className="image-holder">
                      <img src="images/banner-image.png" className="img-fluid" alt="banner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
      <BestSellerBooks />
    </>
  );
};

export default Demo;
