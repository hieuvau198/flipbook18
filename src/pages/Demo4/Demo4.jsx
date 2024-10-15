import React, { useState } from 'react';
import '../../assets/css/style.css';
import '../../assets/css/vendor.css';

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
            { id: 6, title: "The Economics Book: Big Ideas Simply Explained", author: "Tara Westover", price: "$24", image: "https://m.media-amazon.com/images/I/81c6E2VdT3L._AC_UF1000,1000_QL80_.jpg" },
            // Thêm sách vào đây
        ],
    },
    {
        category: "Academic",
        books: [
            { id: 7, title: "Kiến Thức Nghề Lập Trình Cho Người Mới Bắt Đầu", author: "Michelle Obama", price: "$28", image: "https://tusachonthihay.com/wp-content/uploads/2023/04/Picsart_23-04-22_14-21-59-998.jpg" },
            { id: 8, title: "Giáo trình lập trình Java cơ bản", author: "Tara Westover", price: "$24", image: "https://sachhoc.com/image/cache/catalog/Tinhoc/laptrinh/Giao-trinh-lap-trinh-java-co-ban-500x554.jpg" },
            // Thêm sách vào đây
        ],
    },
    // Thêm các thể loại khác nếu cần
];

const Demo4 = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Lấy danh sách tất cả các thể loại
    const allCategories = bookCategories.map(cat => cat.category);

    // Hàm để toggle lựa chọn các thể loại
    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // Hàm xử lý khi người dùng áp dụng bộ lọc
    const handleApplyFilter = () => {
        // Có thể thêm logic thêm nếu cần khi áp dụng filter
    };

    // Hàm xử lý khi người dùng muốn xóa bộ lọc
    const handleClearFilter = () => {
        setSelectedCategories([]);
    };

    // Xác định các thể loại sẽ được hiển thị dựa trên lựa chọn
    const displayedCategories = selectedCategories.length > 0
        ? bookCategories.filter(cat => selectedCategories.includes(cat.category))
        : bookCategories;
    console.log("Displayed Categories:", displayedCategories);

    return (
        <section id="book-categories" className="bg-light-gray py-5">
            <div className="container">
                <h2 className="text-center mb-5">Categories</h2>

                {/* Dropdown Category */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Category
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {allCategories.map((category) => (
                                <li key={category}>
                                    <div className="form-check px-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category}
                                            id={`checkbox-${category}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                        />
                                        <label className="form-check-label" htmlFor={`checkbox-${category}`}>
                                            {category}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {selectedCategories.length > 0 && (
                        <button className="btn btn-secondary ms-2" onClick={handleClearFilter}>
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Hiển thị các thể loại sách */}
                <div className="row">
                    {displayedCategories.map((category) => (
                        <div key={category.category} className="col-md-3 mb-4"> {/* 4 cột */}
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
                                                        
                                                        <button className="btn btn-primary">In Development</button>
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
            </div>
        </section>
    );
};

export default Demo4;
