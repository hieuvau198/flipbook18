import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button'; // Import ToggleButton
import '../../assets/css/toolbar.css'; // Import CSS

import fullscreenIcon from '../../assets/icons/fullscreen.svg';
import exitFullscreenIcon from '../../assets/icons/exit-fullscreen.svg';
import zoomInIcon from '../../assets/icons/zoom-in.svg'; // Import icon cho Zoom In
import zoomOutIcon from '../../assets/icons/zoom-out.svg'; // Import icon cho Zoom Out
import backIcon from '../../assets/icons/back.svg';

function Toolbar({
  toggleFullscreen,
  isFullscreen,
  onToggleMagnify,
  isMagnifyEnabled,
  searchTerm, // Add search term prop
  onSearchChange, // Add search change handler prop
  fullscreenTitle,
  handleZoomIn, // Thêm prop cho hàm zoom in
  handleZoomOut, // Thêm prop cho hàm zoom out
  handleResetView // Thêm prop cho hàm reset view
}) {
  const [showFullscreenTooltip, setShowFullscreenTooltip] = useState(false);
  const [showZoomInTooltip, setShowZoomInTooltip] = useState(false); // Tooltip cho Zoom In
  const [showZoomOutTooltip, setShowZoomOutTooltip] = useState(false); // Tooltip cho Zoom Out
  const [isToggled, setIsToggled] = useState(false);
  const [isMagnifyToggled, setIsMagnifyToggled] = useState(isMagnifyEnabled);

  const handleMagnifyToggle = (value) => {
    setIsMagnifyToggled(!value);
    onToggleMagnify();
  };

  return (
    <div className="toolbar">
      {/* Add Search Input */}
      <input
        type="text"
        placeholder="Search text (in development)"
        style={{ width: '300px' }}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} // Call parent function on change
      />

      <div
        className="fullscreen-tooltip-container"
        onMouseEnter={() => setShowFullscreenTooltip(true)}  // Show tooltip on hover
        onMouseLeave={() => setShowFullscreenTooltip(false)} // Hide tooltip on leave
      >
        <button className="toolbar-btn" onClick={toggleFullscreen}>
          <img
            src={isFullscreen ? exitFullscreenIcon : fullscreenIcon}
            alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={styles.icon}
          />
        </button>

        {/* Fullscreen Tooltip */}
        {showFullscreenTooltip && (
          <div className="fullscreen-tooltip">
            {fullscreenTitle || "Fullscreen"}
          </div>
        )}
      </div>
      <div
        className="zoom-tooltip-container"
        onMouseEnter={() => setShowZoomInTooltip(true)} // Hiện tooltip khi hover
        onMouseLeave={() => setShowZoomInTooltip(false)} // Ẩn tooltip khi không hover
      >
        <button className="toolbar-btn" onClick={handleZoomIn}>
          <img
            src={zoomInIcon}
            alt="Zoom In"
            style={styles.icon}
          />
        </button>
        {/* Zoom In Tooltip */}
        {showZoomInTooltip && (
          <div className="zoom-tooltip">
            Zoom In
          </div>
        )}
      </div>


      {/* Zoom Out Button */}
      <div
        className="zoom-tooltip-container"
        onMouseEnter={() => setShowZoomOutTooltip(true)} // Hiện tooltip khi hover
        onMouseLeave={() => setShowZoomOutTooltip(false)} // Ẩn tooltip khi không hover
      >
        <button className="toolbar-btn" onClick={handleZoomOut}>
          <img
            src={zoomOutIcon}
            alt="Zoom Out"
            style={styles.icon}
          />
        </button>

        {/* Zoom Out Tooltip */}
        {showZoomOutTooltip && (
          <div className="zoom-tooltip">
            Zoom Out
          </div>
        )}
      </div>

      <div className="reset-tooltip-container">
        <button className="toolbar-btn" onClick={handleResetView}>
          <img src={backIcon} alt="Back" style={styles.icon} />
        </button>
      </div>

      <div className="toggle">
        <ToggleButton
          value={isMagnifyToggled}
          onToggle={handleMagnifyToggle}
        />
      </div>
    </div>
  );
}

// PropTypes to define the expected types of props
Toolbar.propTypes = {
  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onToggleMagnify: PropTypes.func.isRequired,
  isMagnifyEnabled: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired, // Added prop for search term
  onSearchChange: PropTypes.func.isRequired, // Added prop for search change handler
  fullscreenTitle: PropTypes.string, // Tooltip text
  handleZoomIn: PropTypes.func.isRequired, // Thêm prop cho hàm zoom in
  handleZoomOut: PropTypes.func.isRequired, // Thêm prop cho hàm zoom out
  handleResetView: PropTypes.func.isRequired // Đảm bảo prop cho hàm reset được định nghĩa
};

const styles = {
  icon: {
    width: '24px',
    height: '24px',
  },
};

export default Toolbar;
