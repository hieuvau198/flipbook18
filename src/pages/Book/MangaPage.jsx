import React from "react";

const MangaPage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        {/* Left Side - Cover Image */}
        <div>
          <img
            src="https://via.placeholder.com/300x450" // Replace with static image URL
            alt="Manga Cover"
            style={{ width: "300px", height: "450px", objectFit: "cover" }}
          />
        </div>

        {/* Right Side - Details */}
        <div style={{ flex: "1" }}>
          <h1>Charao-kun to Seiso-chan</h1>
          <p><strong>Author:</strong> Some Author</p>
          <p><strong>Artist:</strong> Some Artist</p>
          <p><strong>Status:</strong> Ongoing</p>
          <p>
            <strong>Description:</strong> This is a static description of the manga. 
            It talks about the life of Charao-kun and Seiso-chan and how they navigate 
            their school life. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Nullam ac justo convallis, tincidunt eros eu, tincidunt lacus.
          </p>

          {/* Tags/Genres */}
          <div>
            <strong>Genres:</strong>
            <span style={{ marginLeft: "10px", backgroundColor: "#e0e0e0", padding: "5px", borderRadius: "4px" }}>
              Romance
            </span>
            <span style={{ marginLeft: "10px", backgroundColor: "#e0e0e0", padding: "5px", borderRadius: "4px" }}>
              Comedy
            </span>
            <span style={{ marginLeft: "10px", backgroundColor: "#e0e0e0", padding: "5px", borderRadius: "4px" }}>
              School Life
            </span>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div>
        <h2>Chapters</h2>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          <li>
            <a href="#chapter1" style={{ textDecoration: "none", color: "#3498db" }}>
              Chapter 1: The First Meeting
            </a>
            <span style={{ marginLeft: "10px", color: "#888" }}>2023-01-01</span>
          </li>
          <li>
            <a href="#chapter2" style={{ textDecoration: "none", color: "#3498db" }}>
              Chapter 2: A New Challenge
            </a>
            <span style={{ marginLeft: "10px", color: "#888" }}>2023-02-15</span>
          </li>
          <li>
            <a href="#chapter3" style={{ textDecoration: "none", color: "#3498db" }}>
              Chapter 3: Confession Time
            </a>
            <span style={{ marginLeft: "10px", color: "#888" }}>2023-03-10</span>
          </li>
        </ul>
      </div>

      {/* Other Manga Suggestions */}
      <div>
        <h2>Other Manga You Might Like</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <img
              src="https://via.placeholder.com/150x225"
              alt="Manga 1"
              style={{ width: "150px", height: "225px", objectFit: "cover" }}
            />
            <p style={{ textAlign: "center" }}>Manga Title 1</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/150x225"
              alt="Manga 2"
              style={{ width: "150px", height: "225px", objectFit: "cover" }}
            />
            <p style={{ textAlign: "center" }}>Manga Title 2</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/150x225"
              alt="Manga 3"
              style={{ width: "150px", height: "225px", objectFit: "cover" }}
            />
            <p style={{ textAlign: "center" }}>Manga Title 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaPage;
