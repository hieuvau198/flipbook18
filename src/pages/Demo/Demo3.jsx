import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.css'; // Đảm bảo đường dẫn CSS chính xác
import '../../assets/css/vendor.css';
import '../../styles/Demo.css'; // Đảm bảo đã thêm CSS cho swiper nếu cần

const Demo3 = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clean up the timer when component unmounts
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="swiper main-swiper">
            <div className="swiper-wrapper d-flex align-items-center">
                <div className="swiper-slide">
                    <div className="container">
                        <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                            <div className="col-md-5 offset-md-1 mt-5 mt-md-0 text-center text-md-start">
                                <div className="banner-content">
                                    <h2>If you are not willing to learn, no one can help you.
                                        If you are determined to learn, no one can stop you.
                                    </h2>
                                    <p>Current Time: {currentTime.toLocaleTimeString()}</p> {/* Hiển thị thời gian hiện tại */}
                                    <a href="index.html" className="btn mt-3">Collection</a>
                                    <br />
                                    {/* Nút quay về trang Demo */}
                                    <Link to="/demo" className="btn btn-secondary mt-3">Go Back to Demo</Link>
                                </div>
                            </div>
                            <div className="col-md-6 text-center">
                                <div className="image-holder">
                                    <img
                                        src="images/banner-image2.png"
                                        className="img-fluid"
                                        alt="banner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Demo3;
