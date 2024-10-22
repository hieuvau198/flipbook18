import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button'; // Import ToggleButton
import '../../assets/css/toolbar.css'; // Import CSS

import fullscreenIcon from '../../assets/icons/fullscreen.svg';
import exitFullscreenIcon from '../../assets/icons/exit-fullscreen.svg';

function Toolbar({
  toggleFullscreen,
  isFullscreen,
  onToggleMagnify,
  isMagnifyEnabled,
  searchTerm, // Add search term prop
  onSearchChange, // Add search change handler prop
}) {
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
        style={{width: '300px'}}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} // Call parent function on change
      />

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
};

const styles = {
  icon: {
    width: '24px',
    height: '20px',
  },
};

export default Toolbar;
