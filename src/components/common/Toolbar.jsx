import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button'; // Import ToggleButton
import '../../assets/css/toolbar.css'; // Import file CSS mới chứa hiệu ứng Aqua

// Import SVG icons

import fullscreenIcon from '../../assets/icons/fullscreen.svg';
import exitFullscreenIcon from '../../assets/icons/exit-fullscreen.svg';

function Toolbar({

  toggleFullscreen,
  isFullscreen,
  onToggleMagnify, // Add this prop
  isMagnifyEnabled // Add this prop
}) {
  const [isToggled, setIsToggled] = useState(false); // State for pan toggle
  const [isMagnifyToggled, setIsMagnifyToggled] = useState(isMagnifyEnabled); // State for magnify toggle

  const handleTogglePan = (value) => {
    setIsToggled(!value);
    // Assuming you have a function to toggle pan in the parent
    // onTogglePan(); 
  };

  const handleMagnifyToggle = (value) => {
    setIsMagnifyToggled(!value); // Toggle magnify state
    onToggleMagnify(); // Call the passed function to toggle magnification
  };

  return (
    <div className="toolbar">

      <button className="toolbar-btn" onClick={toggleFullscreen}>
        <img
          src={isFullscreen ? exitFullscreenIcon : fullscreenIcon}
          alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          style={styles.icon}
        />
      </button>

      <div className="toggle">
        <ToggleButton
          value={isMagnifyToggled}
          onToggle={handleMagnifyToggle} // Use the magnify toggle handler
        />
      </div>
    </div>
  );
}

// PropTypes to define the expected types of props
Toolbar.propTypes = {

  toggleFullscreen: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onToggleMagnify: PropTypes.func.isRequired, // Added prop for magnify toggle
  isMagnifyEnabled: PropTypes.bool.isRequired // Added prop for magnify state
};

const styles = {
  icon: {
    width: '24px',  // Set icon size
    height: '24px',
  }
};

export default Toolbar;
