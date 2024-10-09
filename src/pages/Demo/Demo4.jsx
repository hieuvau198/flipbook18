import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Import hook useNavigate
import '../../assets/css/style.css';
import '../../assets/css/vendor.css';
import "../../styles/Demo.css";

const bookCategories = [
    {
        category: "Novel",
        books: [
            { id: 1, title: "The Fine Print", author: "Lauren Asher", price: "$20", image: "https://m.media-amazon.com/images/I/5129NwZwnNL._SL500_.jpg" },
            { id: 2, title: "The Silent Patient", author: "Alex Michaelides", price: "$22", image: "https://m.media-amazon.com/images/I/61R+Cpm+HxL._AC_UF1000,1000_QL80_.jpg" },
            // Thêm sách vào đây
        ],
    },
    {
        category: "Science",
        books: [
            { id: 3, title: "How Innovation Works", author: "Matt Ridley", price: "$25", image: "https://m.media-amazon.com/images/I/71xxrwbV-XL._AC_UF1000,1000_QL80_.jpg" },
            { id: 4, title: "Atomic Habits", author: "James Clear", price: "$17", image: "https://tiki.vn/blog/wp-content/uploads/2024/08/atomic-habits-1.jpg" },
            // Thêm sách vào đây
        ],
    },
    {
        category: "Economic",
        books: [
            { id: 5, title: "Black Swan", author: "Michelle Obama", price: "$28", image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p8236892_p_v13_bb.jpg" },
            { id: 6, title: "The Economics Book: Big Ideas Simply Explained ", author: "Tara Westover", price: "$24", image: "https://m.media-amazon.com/images/I/81c6E2VdT3L._AC_UF1000,1000_QL80_.jpg" },
            // Thêm sách vào đây
        ],
    },
    // Thêm các thể loại khác nếu cần
];

const Demo4 = () => {
    const navigate = useNavigate();
    return (
        <section id="book-categories" className="bg-light-gray py-5">
            <div className="container">
                <h2 className="text-center mb-5">Book Category</h2>
                <div className="row">
                    {bookCategories.map((category) => (
                        <div key={category.category} className="col-md-4 mb-4">
                            <h3 className="text-center mb-3">{category.category}</h3>
                            <div className="row">
                                {category.books.map((book) => (
                                    <div key={book.id} className="col-12">
                                        <div className="card mb-3">
                                            <div className="row g-0">
                                                <div className="col-md-4">
                                                    <img src={book.image} className="img-fluid rounded-start" alt={book.title} />
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{book.title}</h5>
                                                        <p className="card-text">Author: {book.author}</p>
                                                        <p className="card-text">Price: {book.price}</p>
                                                        <a href="#" className="btn btn-primary">Buy Now !</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <button className="btn btn-secondary" onClick={() => navigate('/demo')}>Back to Demo</button>
                </div>
            </div>
        </section>
    );
};

export default Demo4;
