import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { logout } from "../../firebase/auth";
import { FaBook } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to control header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track the last scroll position

  const { role } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // If scrolling down, hide the header
        setIsVisible(false);
      } else {
        // If scrolling up, show the header
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [lastScrollY]);

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

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleNavigateToLibrary = () => {
    navigate("/library");
  };

  return (
    <nav
      className={`flex items-center justify-between px-4 w-full z-20 fixed top-0 left-0 h-16 border-b bg-gray-200 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center space-x-2">
        <FaBook className="text-2xl text-blue-600" aria-hidden="true" />
        <Link to="/home" className="text-xl font-bold text-blue-600">
          FlipBook App
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {userLoggedIn ? (
          <>
            {role === "admin" && (
              <button
                className="btn btn-secondary"
                onClick={handleNavigateToLibrary}
              >
                Library
              </button>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
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

            {error && (
              <span className="text-sm text-red-500 ml-2">{error}</span>
            )}
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
