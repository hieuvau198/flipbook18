import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/style.css'; // Đảm bảo đường dẫn CSS chính xác
import '../../assets/css/vendor.css';


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
        
            
                    
                        <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                            <div className="col-sm-6 mt-md-0 text-center text-md-start">
                                <div className="banner-content ml-4">
                                    <h2>
                                        If you are not willing to learn, no one can help you.
                                        If you are determined to learn, no one can stop you.
                                    </h2>
                                    <p>Time is money: {currentTime.toLocaleTimeString()}</p> {/* Hiển thị thời gian hiện tại */}
                                    <a href="#book-categories" className="btn-find-book mt-3">Find your book</a> {/* Cập nhật link */}
                                    <br />
                                    {/* Nút quay về trang Demo */}

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="image-holder">
                                    <img
                                        src="https://images.inc.com/uploaded_files/image/1920x1080/getty_457207765_125515.jpg"
                                        className="img-fluid"
                                        alt="banner"
                                    />
                                </div>
                            </div>
                        </div>
                    
                
    );
};

export default Demo3;
