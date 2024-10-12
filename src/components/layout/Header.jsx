import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { logout } from "../../firebase/auth";
import { FaBook } from "react-icons/fa";
import "../../styles/App.css";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser, role } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;

      if (currentScrollTop > 10 && currentScrollTop > lastScrollTop) {
        // User is scrolling down, hide the header
        setIsScrolled(true);
      } else if (currentScrollTop < lastScrollTop) {
        // User is scrolling up, show the header
        setIsScrolled(false);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // Prevent negative scrolling
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => navigate("/login");

  const handleRegister = () => navigate("/register");

  const handleNavigateToLibrary = () => navigate("/library");

  const handleNavigateToBook = () => navigate("/book");

  return (
    <nav
      className={`app-header ${isScrolled ? "scrolled" : ""} flex items-center justify-between px-4 w-full z-20 fixed top-0 left-0 h-16 border-b transition-all`}
    >
      <div className="flex items-center space-x-2">
        <FaBook className="text-2xl" aria-hidden="true" />
        <Link to="/home" className="text-xl font-bold text-white">
          Flippin
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {userLoggedIn ? (
          <>
            {role === "admin" && (
              <button
                className="btn btn-light"
                onClick={handleNavigateToLibrary}
              >
                Library
              </button>
            )}
            <button className="btn btn-light" onClick={handleNavigateToBook}>
              Book
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-light"
              disabled={loading}
            >
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
            {currentUser && (
              <div className="flex items-center space-x-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-sm text-gray-700">
                    Welcome, {currentUser.displayName || currentUser.email}
                  </span>
                )}
              </div>
            )}
            {error && <span className="text-sm text-red-500 ml-2">{error}</span>}
          </>
        ) : (
          <>
            <button onClick={handleLogin} className="btn btn-secondary">
              <span>Login</span>
            </button>
            <button onClick={handleRegister} className="btn btn-secondary">
              <span>Register</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
